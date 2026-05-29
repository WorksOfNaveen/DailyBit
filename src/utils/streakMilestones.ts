export const STREAK_CELEBRATION_DAY = 7;

/** True when completing today crosses from a 6-day streak to 7. */
export function shouldCelebrateStreak(
  previousStreak: number,
  newStreak: number,
): boolean {
  return previousStreak === STREAK_CELEBRATION_DAY - 1 && newStreak === STREAK_CELEBRATION_DAY;
}
