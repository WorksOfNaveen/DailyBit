export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitWithTodayStatus {
  habit: Habit;
  completedToday: boolean;
  streak: number;
}

export type ContributionDataPoint = {
  date: string;
  count: number;
};
