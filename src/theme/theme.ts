import { MD3DarkTheme } from "react-native-paper";
import { colors } from "./colors";

export const paperTheme = {
  ...MD3DarkTheme,
  roundness: 16,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.destructive,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceAlt,
    outline: colors.border,
    onBackground: colors.text,
    onSurface: colors.text,
    onSurfaceVariant: colors.textMuted,
    onPrimary: colors.background,
  },
};
