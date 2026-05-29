import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style: styleProp,
  ...props
}: ButtonProps) {
  const styles = useButtonStyles();
  const isDisabled = disabled || loading;

  const btnStyle =
    variant === 'primary'
      ? styles.btnPrimary
      : variant === 'secondary'
        ? styles.btnSecondary
        : styles.btnGhost;

  const labelStyle =
    variant === 'primary'
      ? styles.btnLabelPrimary
      : variant === 'secondary'
        ? styles.btnLabelSecondary
        : styles.btnLabelGhost;

  const spinnerColor =
    variant === 'primary' ? '#FFFFFF' : styles.btnLabelSecondary.color;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => {
        const extraStyle =
          typeof styleProp === 'function' ? styleProp({ pressed }) : styleProp;
        return [
          styles.btn,
          btnStyle,
          pressed && styles.btnPressed,
          isDisabled && styles.btnDisabled,
          extraStyle,
        ];
      }}
      {...props}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={[styles.btnLabel, labelStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

function useButtonStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        btn: {
          minHeight: 48,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnPrimary: {
          backgroundColor: colors.primary,
        },
        btnSecondary: {
          backgroundColor: colors.primaryMuted,
        },
        btnGhost: {
          backgroundColor: 'transparent',
        },
        btnPressed: {
          opacity: 0.88,
          transform: [{ scale: 0.98 }],
        },
        btnDisabled: {
          opacity: 0.55,
        },
        btnLabel: {
          fontSize: 16,
          fontWeight: '500',
        },
        btnLabelPrimary: {
          color: '#FFFFFF',
        },
        btnLabelSecondary: {
          color: colors.primary,
        },
        btnLabelGhost: {
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
