import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

type CheckBoxProps = {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

export function CheckBox({
  checked,
  onPress,
  accessibilityLabel,
}: CheckBoxProps) {
  const styles = useCheckBoxStyles();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
    </Pressable>
  );
}

function useCheckBoxStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        checkbox: {
          width: 28,
          height: 28,
          borderRadius: radius.full,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: colors.border,
          backgroundColor: 'transparent',
        },
        checkboxChecked: {
          backgroundColor: colors.success,
          borderColor: colors.success,
        },
        checkmark: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '700',
        },
      }),
    [colors],
  );
}
