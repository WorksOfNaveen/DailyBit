#!/usr/bin/env node
/**
 * Enforces .cursor/rules/frontend-dependency-security.mdc on package installs.
 * - Allows read-only registry checks (npm view, npm info, etc.)
 * - Denies installs missing --ignore-scripts
 * - Requires user approval (ask) for all install/add/ci commands
 */

const fs = require('fs');

const ALLOW = { permission: 'allow' };

/** npm/yarn/pnpm commands that install or add dependencies */
const INSTALL =
  /^(npm\s+(install|i\b|add\b|ci\b)|yarn\s+(add|install)\b|pnpm\s+(add|install)\b)/i;

function respond(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function hasIgnoreScripts(command) {
  return /--ignore-scripts\b/.test(command);
}

function splitCommandChain(command) {
  return command
    .split(/&&|\|\||;/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function findInstallSegments(command) {
  return splitCommandChain(command).filter((segment) => INSTALL.test(segment));
}

function extractCommand(input, raw) {
  const candidates = [
    input.command,
    input.full_command,
    input.shellCommand,
    input.tool_input?.command,
    input.toolInput?.command,
  ];
  for (const value of candidates) {
    const command = String(value || '').trim();
    if (command) {
      return command;
    }
  }
  const trimmed = String(raw || '').trim();
  if (trimmed && !trimmed.startsWith('{')) {
    return trimmed;
  }
  return '';
}

function run() {
  let input = {};
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
    input = JSON.parse(raw || '{}');
  } catch {
    const fallback = extractCommand({}, raw);
    if (!fallback) {
      respond({
        permission: 'ask',
        user_message:
          'Package install requires your approval. Confirm the command uses --ignore-scripts.',
        agent_message:
          'Hook could not parse shell JSON; require explicit user approval before install.',
      });
      return;
    }
    input = { command: fallback };
  }

  const command = extractCommand(input, raw);
  if (!command) {
    respond({
      permission: 'ask',
      user_message:
        'Package install requires your approval. Confirm the command uses --ignore-scripts.',
      agent_message:
        'Install command missing from hook payload; require explicit user approval.',
    });
    return;
  }

  const installSegments = findInstallSegments(command);
  if (installSegments.length === 0) {
    respond(ALLOW);
    return;
  }

  const unsafeInstall = installSegments.find(
    (segment) => !hasIgnoreScripts(segment),
  );
  if (unsafeInstall) {
    respond({
      permission: 'deny',
      user_message:
        'Blocked: package installs must use --ignore-scripts (project security policy).',
      agent_message: [
        'This install was blocked by .cursor/hooks/npm-install-guard.js.',
        'Follow .cursor/rules/frontend-dependency-security.mdc:',
        '1) Run `npm view <package>` to verify the package.',
        '2) Re-run with --ignore-scripts, e.g. `npm install <pkg> --ignore-scripts`.',
        '3) Present registry data and the exact command; wait for explicit user "yes" before installing.',
      ].join(' '),
    });
    return;
  }

  respond({
    permission: 'ask',
    user_message:
      'Package install requires your approval (project dependency security policy).',
    agent_message: [
      'Install uses --ignore-scripts but still needs explicit user approval per frontend-dependency-security.mdc.',
      'Show the Security Check block with registry data and the exact command; proceed only if the user approves.',
    ].join(' '),
  });
}

try {
  run();
} catch {
  respond({
    permission: 'deny',
    user_message: 'Install guard failed. Run the install manually if you trust the command.',
    agent_message:
      'npm-install-guard hook crashed. Do not bypass policy without user consent.',
  });
}
