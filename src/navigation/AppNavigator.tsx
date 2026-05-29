import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import { useTheme } from '../styles/useTheme';
import { AddHabitScreen } from '../screens/AddHabitScreen';
import { HabitHistoryScreen } from '../screens/HabitHistoryScreen';
import { HabitListScreen } from '../screens/HabitListScreen';
import { buildNavigationTheme } from './navigationTheme';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const styles = useNavigatorStyles();
  const navigationTheme = useMemo(() => buildNavigationTheme(colors), []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.navHeader,
          headerTintColor: colors.text,
          headerTitleStyle: styles.navHeaderTitle,
          headerShadowVisible: false,
          cardStyle: styles.navCard,
        }}>
        <Stack.Screen
          name="HabitList"
          component={HabitListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ title: 'New Habit' }}
        />
        <Stack.Screen
          name="HabitHistory"
          component={HabitHistoryScreen}
          options={({ route }) => ({ title: route.params.habitName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function useNavigatorStyles() {
  const { colors: themeColors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        navHeader: {
          backgroundColor: themeColors.surface,
        },
        navHeaderTitle: {
          fontWeight: '600',
        },
        navCard: {
          backgroundColor: themeColors.background,
        },
      }),
    [themeColors],
  );
}
