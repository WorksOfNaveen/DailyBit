import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

type EmptyStateProps = {
  title: string;
  message: string;
  emoji?: string;
};

export function EmptyState({ title, message, emoji = '🌱' }: EmptyStateProps) {
  const styles = useEmptyStateStyles();

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

function useEmptyStateStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        emptyContainer: {
          alignItems: 'center',
          paddingVertical: spacing.xxl,
          paddingHorizontal: spacing.lg,
        },
        emptyEmoji: {
          fontSize: 48,
          marginBottom: spacing.md,
        },
        heading: {
          fontSize: 20,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.sm,
          textAlign: 'center',
        },
        muted: {
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 22,
        },
      }),
    [colors],
  );
}
