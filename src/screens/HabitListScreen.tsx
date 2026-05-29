import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { CheckBox } from '../components/CheckBox';
import { EmptyState } from '../components/EmptyState';
import { useHabits } from '../context/HabitContext';
import type { HabitListScreenProps } from '../navigation/types';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';
import { formatHeaderDate } from '../utils/dateHelpers';
import type { HabitWithTodayStatus } from '../types';

type HabitListStyles = ReturnType<typeof useHabitListStyles>;

export function HabitListScreen({ navigation }: HabitListScreenProps) {
  const { colors } = useTheme();
  const styles = useHabitListStyles();
  const { habitsWithStatus, loading, refresh, toggleHabitToday } = useHabits();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleToggle = useCallback(
    async (habitId: string) => {
      await toggleHabitToday(habitId);
    },
    [toggleHabitToday],
  );

  const renderItem = useCallback(
    ({ item }: { item: HabitWithTodayStatus }) => (
      <HabitListItem
        item={item}
        styles={styles}
        onToggle={handleToggle}
        onOpenHistory={() =>
          navigation.navigate('HabitHistory', {
            habitId: item.habit.id,
            habitName: item.habit.name,
          })
        }
      />
    ),
    [handleToggle, navigation, styles],
  );

  return (
    <View style={styles.screenSafe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Today</Text>
          <Text style={styles.title}>{formatHeaderDate()}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add new habit"
          onPress={() => navigation.navigate('AddHabit')}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listContent,
            habitsWithStatus.length === 0 && styles.listEmpty,
          ]}
          data={habitsWithStatus}
          keyExtractor={item => item.habit.id}
          ListEmptyComponent={
            <EmptyState
              title="No habits yet"
              message="Tap + to add your first daily habit and start building streaks."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function HabitListItem({
  item,
  styles,
  onToggle,
  onOpenHistory,
}: {
  item: HabitWithTodayStatus;
  styles: HabitListStyles;
  onToggle: (habitId: string) => void;
  onOpenHistory: () => void;
}) {
  return (
    <Card style={styles.habitCard}>
      <View style={styles.row}>
        <CheckBox
          checked={item.completedToday}
          accessibilityLabel={`Mark ${item.habit.name} as done`}
          onPress={() => onToggle(item.habit.id)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View history for ${item.habit.name}`}
          onPress={onOpenHistory}
          style={styles.habitContent}>
          <Text
            style={[styles.body, item.completedToday && styles.habitNameDone]}
            numberOfLines={1}>
            {item.habit.name}
          </Text>
          <StreakBadge streak={item.streak} styles={styles} />
        </Pressable>
      </View>
    </Card>
  );
}

function StreakBadge({
  streak,
  styles,
}: {
  streak: number;
  styles: HabitListStyles;
}) {
  const active = streak > 0;

  return (
    <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
      <Text style={active ? styles.badgeTextActive : styles.badgeTextInactive}>
        {active ? `🔥 ${streak} day${streak === 1 ? '' : 's'}` : '0 days'}
      </Text>
    </View>
  );
}

function useHabitListStyles() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
    screenSafe: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingTop: insets.top + spacing.md,
      paddingBottom: insets.bottom,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    fab: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    fabPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.96 }],
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '300',
      marginTop: -2,
    },
    loader: {
      marginTop: spacing.xxl,
    },
    listContent: {
      paddingBottom: spacing.xl,
      gap: spacing.sm,
    },
    listEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    habitCard: {
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    habitContent: {
      flex: 1,
      gap: spacing.sm,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    habitNameDone: {
      textDecorationLine: 'line-through',
      opacity: 0.65,
    },
    badge: {
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    badgeActive: {
      backgroundColor: colors.streakMuted,
    },
    badgeInactive: {
      backgroundColor: colors.surfaceElevated,
    },
    badgeTextActive: {
      fontSize: 13,
      color: colors.streak,
    },
    badgeTextInactive: {
      fontSize: 13,
      color: colors.textSecondary,
    },
      }),
    [colors, insets.top, insets.bottom],
  );
}
