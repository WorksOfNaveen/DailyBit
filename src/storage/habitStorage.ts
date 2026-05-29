import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, HabitCompletion } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { calculateStreak } from '../utils/streakCalculator';

const HABITS_KEY = '@dailybit:habits';
const COMPLETIONS_KEY = '@dailybit:completions';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getHabits(): Promise<Habit[]> {
  return readJson<Habit[]>(HABITS_KEY, []);
}

export async function saveHabit(habit: Habit): Promise<void> {
  const habits = await getHabits();
  habits.push(habit);
  await writeJson(HABITS_KEY, habits);
}

export async function deleteHabit(id: string): Promise<void> {
  const habits = (await getHabits()).filter(habit => habit.id !== id);
  const completions = (await getCompletions()).filter(
    entry => entry.habitId !== id,
  );
  await writeJson(HABITS_KEY, habits);
  await writeJson(COMPLETIONS_KEY, completions);
}

export async function getCompletions(): Promise<HabitCompletion[]> {
  return readJson<HabitCompletion[]>(COMPLETIONS_KEY, []);
}

export function isCompletedOnDate(
  habitId: string,
  date: string,
  completions: HabitCompletion[],
): boolean {
  return completions.some(
    entry =>
      entry.habitId === habitId && entry.date === date && entry.completed,
  );
}

export async function toggleCompletion(
  habitId: string,
  date: string = formatDate(new Date()),
): Promise<HabitCompletion[]> {
  const completions = await getCompletions();
  const index = completions.findIndex(
    entry => entry.habitId === habitId && entry.date === date,
  );

  if (index >= 0) {
    completions[index] = {
      ...completions[index],
      completed: !completions[index].completed,
    };
  } else {
    completions.push({ habitId, date, completed: true });
  }

  await writeJson(COMPLETIONS_KEY, completions);
  return completions;
}

export function getStreakForHabit(
  habitId: string,
  completions: HabitCompletion[],
): number {
  return calculateStreak(habitId, completions);
}

export function createHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
