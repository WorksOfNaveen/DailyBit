import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';
import type { ContributionDataPoint } from '../types';
import { getShortWeekday } from '../utils/dateHelpers';

type ContributionMapProps = {
  values: ContributionDataPoint[];
  selectedDay: string | null;
  today: string;
  onDayPress: (date: string) => void;
};

export function ContributionMap({
  values,
  selectedDay,
  today,
  onDayPress,
}: ContributionMapProps) {
  const styles = useContributionMapStyles();

  return (
    <View style={styles.mapRow}>
      {values.map(point => {
        const done = point.count > 0;
        const pending = point.date === today && !done;
        const selected = selectedDay === point.date;

        const squareStyle = done
          ? styles.squareDone
          : pending
          ? styles.squarePending
          : styles.squareMissed;

        return (
          <Pressable
            key={point.date}
            style={styles.mapCell}
            onPress={() => onDayPress(point.date)}
            accessibilityRole="button"
            accessibilityLabel={`${getShortWeekday(point.date)}, ${
              done ? 'completed' : pending ? 'pending' : 'missed'
            }`}
          >
            <View
              style={[
                styles.square,
                squareStyle,
                selected && styles.squareSelected,
              ]}
            />
            <Text style={styles.mapLabel}>{getShortWeekday(point.date)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function useContributionMapStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        mapRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.xs,
        },
        mapCell: {
          flex: 1,
          alignItems: 'center',
          gap: spacing.xs,
        },
        square: {
          width: '100%',
          aspectRatio: 1,
          maxWidth: 40,
          borderRadius: radius.sm,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        squareDone: {
          backgroundColor: colors.success,
        },
        squarePending: {
          backgroundColor: colors.primaryMuted,
        },
        squareMissed: {
          backgroundColor: colors.contributionEmpty,
        },
        squareSelected: {
          borderColor: colors.primary,
        },
        mapLabel: {
          fontSize: 11,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
