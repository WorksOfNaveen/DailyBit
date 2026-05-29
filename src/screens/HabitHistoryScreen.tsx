import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import { Card } from '../components/Card';
import { ContributionMap } from '../components/ContributionMap';
import { useHabits } from '../context/HabitContext';
import type { HabitHistoryScreenProps } from '../navigation/types';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';
import { toContributionValues } from '../utils/chartDataTransformers';
import {
  formatDate,
  formatDisplayDate,
  getLastNDates,
  getShortWeekday,
} from '../utils/dateHelpers';
import {
  calculateStreak,
  countCompletedInWindow,
  HISTORY_DAYS,
} from '../utils/streakCalculator';

type DayStatus = 'done' | 'pending' | 'missed';
type HabitHistoryStyles = ReturnType<typeof useHabitHistoryStyles>;

export function HabitHistoryScreen({ route }: HabitHistoryScreenProps) {
  const styles = useHabitHistoryStyles();
  const { habitId } = route.params;
  const { completions } = useHabits();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const today = formatDate(new Date());
  const last7Dates = useMemo(() => getLastNDates(HISTORY_DAYS), []);
  const contributionValues = useMemo(
    () => toContributionValues(habitId, completions, HISTORY_DAYS),
    [habitId, completions],
  );

  const currentStreak = useMemo(
    () => calculateStreak(habitId, completions),
    [habitId, completions],
  );

  const completedCount = useMemo(
    () => countCompletedInWindow(habitId, completions, last7Dates),
    [habitId, completions, last7Dates],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.screenPadded}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statsRow}>
        <StatCard
          label="Current streak"
          value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`}
          valueStyle={styles.statValueStreak}
          styles={styles}
        />
        <StatCard
          label="Last 7 days"
          value={`${completedCount}/${HISTORY_DAYS}`}
          valueStyle={styles.statValueSuccess}
          styles={styles}
        />
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.heading}>Progress</Text>
        {/* <Text style={styles.sectionSubtitle}>Tap a square to see that day</Text> */}
        <ContributionMap
          values={contributionValues}
          selectedDay={selectedDay}
          today={today}
          onDayPress={setSelectedDay}
        />

        {selectedDay ? (
          <Text style={styles.selectedDay}>
            {formatDisplayDate(selectedDay)} —{' '}
            {getDayStatusDetail(
              contributionValues.find(point => point.date === selectedDay)
                ?.count,
              selectedDay === today,
            )}
          </Text>
        ) : null}
      </Card>

      <Card>
        <Text style={styles.heading}>History</Text>
        <View style={styles.dayList}>
          {[...last7Dates].reverse().map(date => {
            const done = contributionValues.find(
              point => point.date === date,
            )?.count;
            const isToday = date === today;
            const status = getDayStatusKey(done, isToday);
            const statusStyles = getDayStatusStyles(status, styles);

            return (
              <View
                key={date}
                style={[styles.dayRow, isToday && styles.dayRowToday]}
              >
                <View>
                  <Text style={styles.body}>
                    {getShortWeekday(date)}
                    {isToday ? ' · Today' : ''}
                  </Text>
                  <Text style={styles.dayDate}>{formatDisplayDate(date)}</Text>
                </View>
                <View style={[styles.pill, statusStyles.pill]}>
                  <Text style={[styles.pillText, statusStyles.text]}>
                    {getDayStatusLabel(status)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Card>
    </ScrollView>
  );
}

function getDayStatusKey(
  done: number | undefined,
  isToday: boolean,
): DayStatus {
  if (done) {
    return 'done';
  }
  if (isToday) {
    return 'pending';
  }
  return 'missed';
}

function getDayStatusLabel(status: DayStatus): string {
  if (status === 'done') {
    return 'Done';
  }
  if (status === 'pending') {
    return 'Pending';
  }
  return 'Missed';
}

function getDayStatusDetail(
  done: number | undefined,
  isToday: boolean,
): string {
  if (done) {
    return 'Completed';
  }
  if (isToday) {
    return 'Pending';
  }
  return 'Not completed';
}

function getDayStatusStyles(status: DayStatus, styles: HabitHistoryStyles) {
  if (status === 'done') {
    return { pill: styles.pillDone, text: styles.pillTextDone };
  }
  if (status === 'pending') {
    return { pill: styles.pillPending, text: styles.pillTextPending };
  }
  return { pill: styles.pillMissed, text: styles.pillTextMissed };
}

function StatCard({
  label,
  value,
  valueStyle,
  styles,
}: {
  label: string;
  value: string;
  valueStyle: TextStyle;
  styles: HabitHistoryStyles;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function useHabitHistoryStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        screenPadded: {
          padding: spacing.md,
          gap: spacing.md,
          paddingBottom: spacing.xxl,
          backgroundColor: colors.background,
        },
        statsRow: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        statCard: {
          flex: 1,
          borderRadius: radius.md,
          borderWidth: StyleSheet.hairlineWidth,
          padding: spacing.sm,
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        statLabel: {
          fontSize: 13,
          textAlign: 'center',
          marginBottom: spacing.xs,
          color: colors.textSecondary,
        },
        statValue: {
          fontSize: 16,
          fontWeight: '500',
          textAlign: 'center',
        },
        statValueStreak: {
          color: colors.streak,
        },
        statValueSuccess: {
          color: colors.success,
        },
        chartCard: {
          overflow: 'hidden',
        },
        heading: {
          fontSize: 20,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        sectionSubtitle: {
          fontSize: 13,
          marginBottom: spacing.md,
          color: colors.textSecondary,
        },
        selectedDay: {
          fontSize: 13,
          marginTop: spacing.sm,
          color: colors.textSecondary,
        },
        dayList: {
          marginTop: spacing.sm,
        },
        dayRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.sm,
          marginBottom: spacing.xs,
          borderBottomColor: colors.border,
        },
        dayRowToday: {
          backgroundColor: colors.primaryMuted,
        },
        body: {
          fontSize: 16,
          fontWeight: '500',
          color: colors.text,
        },
        dayDate: {
          fontSize: 13,
          marginTop: 2,
          color: colors.textSecondary,
        },
        pill: {
          borderRadius: radius.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
        },
        pillDone: {
          backgroundColor: colors.successMuted,
        },
        pillPending: {
          backgroundColor: colors.primaryMuted,
        },
        pillMissed: {
          backgroundColor: colors.contributionEmpty,
        },
        pillText: {
          fontWeight: '600',
        },
        pillTextDone: {
          color: colors.success,
        },
        pillTextPending: {
          color: colors.primary,
        },
        pillTextMissed: {
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
