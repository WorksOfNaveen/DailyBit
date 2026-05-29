import React, { useMemo, type PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({ children, style }: CardProps) {
  const styles = useCardStyles();

  return <View style={[styles.card, style]}>{children}</View>;
}

function useCardStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      }),
    [colors],
  );
}
