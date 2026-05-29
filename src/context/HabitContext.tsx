import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  getCompletions,
  getHabits,
  getStreakForHabit,
  isCompletedOnDate,
  saveHabit,
  toggleCompletion as toggleCompletionStorage,
  createHabitId,
} from '../storage/habitStorage';
import type { Habit, HabitCompletion, HabitWithTodayStatus } from '../types';
import { formatDate } from '../utils/dateHelpers';

type HabitContextValue = {
  habits: Habit[];
  completions: HabitCompletion[];
  habitsWithStatus: HabitWithTodayStatus[];
  loading: boolean;
  refresh: () => Promise<void>;
  addHabit: (name: string) => Promise<void>;
  toggleHabitToday: (habitId: string) => Promise<void>;
};

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: PropsWithChildren) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const today = formatDate(new Date());

  const refresh = useCallback(async () => {
    const [loadedHabits, loadedCompletions] = await Promise.all([
      getHabits(),
      getCompletions(),
    ]);
    setHabits(loadedHabits);
    setCompletions(loadedCompletions);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const habitsWithStatus = useMemo<HabitWithTodayStatus[]>(
    () =>
      habits.map(habit => ({
        habit,
        completedToday: isCompletedOnDate(habit.id, today, completions),
        streak: getStreakForHabit(habit.id, completions),
      })),
    [habits, completions, today],
  );

  const addHabit = useCallback(
    async (name: string) => {
      const habit: Habit = {
        id: createHabitId(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };
      await saveHabit(habit);
      await refresh();
    },
    [refresh],
  );

  const toggleHabitToday = useCallback(
    async (habitId: string) => {
      const updated = await toggleCompletionStorage(habitId, today);
      setCompletions(updated);
    },
    [today],
  );

  const value = useMemo(
    () => ({
      habits,
      completions,
      habitsWithStatus,
      loading,
      refresh,
      addHabit,
      toggleHabitToday,
    }),
    [
      habits,
      completions,
      habitsWithStatus,
      loading,
      refresh,
      addHabit,
      toggleHabitToday,
    ],
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits(): HabitContextValue {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitProvider');
  }
  return context;
}
