import { DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';
import type { ThemeColors } from '../styles/colors';

export function buildNavigationTheme(colors: ThemeColors): NavigationTheme {
  return {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };
}
