import type { HabitCompletion } from '../src/types';
import { calculateStreak } from '../src/utils/streakCalculator';

const HABIT_ID = 'habit_test';

function completion(date: string, completed = true): HabitCompletion {
  return { habitId: HABIT_ID, date, completed };
}

describe('calculateStreak', () => {
  it('counts through yesterday when today is not completed', () => {
    const completions = [
      completion('2026-05-27'),
      completion('2026-05-28'),
    ];
    expect(calculateStreak(HABIT_ID, completions, '2026-05-29')).toBe(2);
  });

  it('returns 0 when today and yesterday are not completed', () => {
    const completions = [completion('2026-05-25')];
    expect(calculateStreak(HABIT_ID, completions, '2026-05-29')).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const completions = [
      completion('2026-05-25'),
      completion('2026-05-26', false),
      completion('2026-05-27'),
      completion('2026-05-28'),
      completion('2026-05-29'),
    ];
    expect(calculateStreak(HABIT_ID, completions, '2026-05-29')).toBe(3);
  });

  it('returns 1 when only today is completed', () => {
    const completions = [completion('2026-05-29')];
    expect(calculateStreak(HABIT_ID, completions, '2026-05-29')).toBe(1);
  });
});
