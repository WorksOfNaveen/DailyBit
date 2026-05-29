import type { ContributionDataPoint, HabitCompletion } from '../types';
import { getLastNDates } from './dateHelpers';
import { HISTORY_DAYS } from './streakCalculator';

/** Build contribution-graph values for the last 7 days. */
export function toContributionValues(
  habitId: string,
  completions: HabitCompletion[],
  numDays: number = HISTORY_DAYS,
): ContributionDataPoint[] {
  const dates = getLastNDates(numDays);
  const completedDates = new Set(
    completions
      .filter(entry => entry.habitId === habitId && entry.completed)
      .map(entry => entry.date),
  );

  return dates.map(date => ({
    date,
    count: completedDates.has(date) ? 1 : 0,
  }));
}
