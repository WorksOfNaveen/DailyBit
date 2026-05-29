import {
  shouldCelebrateStreak,
  STREAK_CELEBRATION_DAY,
} from '../src/utils/streakMilestones';

describe('shouldCelebrateStreak', () => {
  it('celebrates only when crossing from 6 to 7', () => {
    expect(shouldCelebrateStreak(6, 7)).toBe(true);
  });

  it('does not celebrate for other streak transitions', () => {
    expect(shouldCelebrateStreak(5, 6)).toBe(false);
    expect(shouldCelebrateStreak(7, 8)).toBe(false);
    expect(shouldCelebrateStreak(0, 1)).toBe(false);
    expect(shouldCelebrateStreak(6, 6)).toBe(false);
    expect(shouldCelebrateStreak(7, 6)).toBe(false);
  });

  it('uses celebration day constant of 7', () => {
    expect(STREAK_CELEBRATION_DAY).toBe(7);
    expect(
      shouldCelebrateStreak(
        STREAK_CELEBRATION_DAY - 1,
        STREAK_CELEBRATION_DAY,
      ),
    ).toBe(true);
  });
});
