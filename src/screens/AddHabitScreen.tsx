import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MAX_HABIT_NAME_LENGTH } from '../constants';
import { useHabits } from '../context/HabitContext';
import type { AddHabitScreenProps } from '../navigation/types';
import { radius, spacing } from '../styles/spacing';
import { useTheme } from '../styles/useTheme';

export function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const styles = useAddHabitStyles();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= MAX_HABIT_NAME_LENGTH;

  const handleSave = async () => {
    if (!trimmed) {
      setError('Please enter a habit name.');
      return;
    }
    if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
      setError(`Name must be ${MAX_HABIT_NAME_LENGTH} characters or fewer.`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await addHabit(trimmed);
      navigation.goBack();
    } catch {
      setError('Could not save habit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.label}>Habit name</Text>
          <TextInput
            accessibilityLabel="Habit name"
            autoFocus
            maxLength={MAX_HABIT_NAME_LENGTH}
            onChangeText={text => {
              setName(text);
              setError(null);
            }}
            placeholder="e.g. Drink water"
            placeholderTextColor={styles.placeholder.color}
            style={[styles.input, error ? styles.inputError : null]}
            value={name}
          />
          <Text style={styles.hint}>
            {trimmed.length}/{MAX_HABIT_NAME_LENGTH}
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Card>

        <View style={styles.actions}>
          <Button
            disabled={!canSave}
            label="Save habit"
            loading={saving}
            onPress={handleSave}
          />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function useAddHabitStyles() {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scroll: {
          padding: spacing.md,
          gap: spacing.lg,
        },
        label: {
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        input: {
          fontSize: 16,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          color: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        inputError: {
          borderColor: colors.danger,
        },
        hint: {
          fontSize: 13,
          marginTop: spacing.sm,
          textAlign: 'right',
          color: colors.textSecondary,
        },
        placeholder: {
          color: colors.textSecondary,
        },
        error: {
          fontSize: 13,
          marginTop: spacing.sm,
          color: colors.danger,
        },
        actions: {
          gap: spacing.sm,
        },
      }),
    [colors],
  );
}
