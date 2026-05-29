import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

const DISMISS_MS = 2000;

type StreakCelebrationProps = {
  visible: boolean;
  onDismiss: () => void;
};

export function StreakCelebration({
  visible,
  onDismiss,
}: StreakCelebrationProps) {
  const styles = useStreakCelebrationStyles();

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const timer = setTimeout(onDismiss, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.message}>7-day streak!</Text>
    </View>
  );
}

function useStreakCelebrationStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        banner: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          marginBottom: spacing.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.streakMuted,
          borderWidth: 1,
          borderColor: colors.streak,
        },
        emoji: {
          fontSize: 18,
        },
        message: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.streak,
        },
      }),
    [colors],
  );
}
