import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StreakMilestoneScreenProps } from '../navigation/types';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

const MILESTONE_QUOTE =
  'Seven days in a row — you are building something real. Keep showing up tomorrow.';

export function StreakMilestoneScreen({
  navigation,
  route,
}: StreakMilestoneScreenProps) {
  const { habitName } = route.params;
  const styles = useStreakMilestoneStyles();

  return (
    <View style={styles.screen}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.title}>7-day streak!</Text>
      <Text style={styles.habitName}>{habitName}</Text>
      <Text style={styles.quote}>{MILESTONE_QUOTE}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Keep going"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Keep going</Text>
      </Pressable>
    </View>
  );
}

function useStreakMilestoneStyles() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.xxl,
          paddingBottom: insets.bottom + spacing.lg,
          justifyContent: 'center',
          alignItems: 'center',
        },
        emoji: {
          fontSize: 56,
          marginBottom: spacing.md,
        },
        title: {
          fontSize: 28,
          fontWeight: '700',
          color: colors.streak,
          marginBottom: spacing.sm,
          textAlign: 'center',
        },
        habitName: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.lg,
          textAlign: 'center',
        },
        quote: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: spacing.xxl,
        },
        button: {
          backgroundColor: colors.primary,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.md,
          minWidth: 200,
          alignItems: 'center',
        },
        buttonPressed: {
          opacity: 0.9,
        },
        buttonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
        },
      }),
    [colors, insets.top, insets.bottom],
  );
}
