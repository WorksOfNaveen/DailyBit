import type { HabitCompletion } from '../types';
import { addDays, formatDate, parseDate } from './dateHelpers';

const HISTORY_DAYS = 7;

/**
 * Current streak: consecutive completed days ending today when today is done,
 * otherwise ending yesterday (so the list shows the active streak before tapping done).
 * Any missed day in the chain breaks the streak.
 */
export function calculateStreak(
  habitId: string,
  completions: HabitCompletion[],
  today: string = formatDate(new Date()),
): number {
  const completedDates = new Set(
    completions
      .filter(entry => entry.habitId === habitId && entry.completed)
      .map(entry => entry.date),
  );

  const anchorDate = completedDates.has(today)
    ? today
    : formatDate(addDays(parseDate(today), -1));

  if (!completedDates.has(anchorDate)) {
    return 0;
  }

  let streak = 0;
  let cursor = parseDate(anchorDate);

  while (completedDates.has(formatDate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function countCompletedInWindow(
  habitId: string,
  completions: HabitCompletion[],
  dates: string[],
): number {
  const completedSet = new Set(
    completions
      .filter(entry => entry.habitId === habitId && entry.completed)
      .map(entry => entry.date),
  );

  return dates.filter(date => completedSet.has(date)).length;
}

export { HISTORY_DAYS };
