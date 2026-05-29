# DailyBit

A local-first habit tracker built with React Native. Track a small set of daily habits, mark them done each day, and see streaks and a 7-day contribution map. No account, backend, or cloud sync.

## Features

- **Splash screen** — Short branded intro when the app opens
- **Habit list** — Today’s habits with toggle, streak badge, inline delete, and navigation to history
- **Add habit** — Simple name-only form (max 50 characters)
- **History** — Last 7 days per habit: current streak, completion count, contribution map, and day-by-day list
- **Streaks** — Consecutive completed days on the list; full-screen milestone with a motivational quote when you hit 7 days
- **Light UI** — Static light appearance (not tied to system dark mode)
- **Offline storage** — Habits and completions persist with AsyncStorage

## Streak rules

A streak is the number of **consecutive completed days** ending on an anchor day:

- If **today** is completed, the anchor is today and the streak counts backward from today.
- If **today** is not completed yet, the anchor is **yesterday** (so you still see an active streak until you miss a day).
- Any gap in completed days breaks the streak.

Example: Mon ✓, Tue ✓, Wed ✗, Thu ✓, Fri ✓ → streak **2** on Friday (Thu + Fri only).

**7-day milestone:** When you complete today and your streak goes from 6 to 7, the app navigates to a milestone screen with a quote. It only fires on that toggle, not on app open or refresh.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React Native 0.85, React 19 |
| Language | TypeScript |
| Navigation | React Navigation (stack) |
| Storage | `@react-native-async-storage/async-storage` |
| UI | Custom components, co-located `StyleSheet` per screen/component |

## Project structure

```
src/
├── components/       # Button, Card, CheckBox, EmptyState, ContributionMap, SplashScreen, StreakCelebration
├── context/          # HabitProvider — shared habit state
├── navigation/       # AppNavigator, navigation theme
├── screens/          # HabitList, AddHabit, HabitHistory, StreakMilestone
├── storage/          # AsyncStorage CRUD
├── styles/           # colors (light-only), spacing, useTheme
├── utils/            # dates, streaks, milestones, chart data
├── types.ts
└── constants.ts
```

## Styling

The app uses a **fixed light palette** exported from [`src/styles/colors.ts`](src/styles/colors.ts). There is no dark mode and no in-app theme toggle. Android and iOS are configured to stay in light appearance.

Styles live **in the same file** as each screen or component, at the bottom:

- Screen files under `src/screens/` each define their own hook (e.g. `useHabitListStyles`).
- Shared UI pieces (e.g. `StreakCelebration`) keep styles in their component file (e.g. `useStreakCelebrationStyles`).
- Hooks call `useTheme()` and return `useMemo(() => StyleSheet.create({ ... }), [colors])`.
- Spacing and radius tokens come from [`src/styles/spacing.ts`](src/styles/spacing.ts).
- No global stylesheet file and no inline style objects in JSX.

## Getting started

Requires [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) and Node.js `>= 22.11.0`.

```sh
npm install
npm start
```

In another terminal:

```sh
# Android
npm run android

# iOS (after pod install in ios/)
npm run ios
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm test` | Run Jest tests |
| `npm run lint` | ESLint |

## Tests

- `__tests__/streakCalculator.test.ts` — streak calculation edge cases
- `__tests__/streakMilestones.test.ts` — 7-day celebration trigger (`6 → 7` only)
- `__tests__/App.test.tsx` — app shell render smoke test

## Data keys (AsyncStorage)

- `@dailybit:habits` — list of habits
- `@dailybit:completions` — per-day completion records (`habitId`, `date` as `YYYY-MM-DD`, `completed`)
