import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  HabitList: undefined;
  AddHabit: undefined;
  HabitHistory: { habitId: string; habitName: string };
};

export type HabitListScreenProps = StackScreenProps<
  RootStackParamList,
  'HabitList'
>;

export type AddHabitScreenProps = StackScreenProps<
  RootStackParamList,
  'AddHabit'
>;

export type HabitHistoryScreenProps = StackScreenProps<
  RootStackParamList,
  'HabitHistory'
>;
