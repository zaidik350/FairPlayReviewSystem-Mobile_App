import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { colors } from "../../theme/colors";

export type ButtonVariant = "primary" | "secondary" | "destructive";

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: (props: { color: string; size: number }) => ReactNode;
  style?: StyleProp<ViewStyle>;
  containerClassName?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
  containerClassName,
}: ButtonProps) {
  const isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";

  const mode = isSecondary ? "outlined" : "contained";

  const buttonColor = isDestructive
    ? colors.destructiveBg
    : isSecondary
    ? "transparent"
    : colors.primary;

  const textColor = isDestructive
    ? colors.destructiveText
    : isSecondary
    ? colors.text
    : colors.onPrimary;

  const borderColor = isDestructive
    ? colors.destructive
    : isSecondary
    ? colors.secondary
    : colors.primary;

  return (
    <View className={containerClassName ?? ""}>
      <PaperButton
        mode={mode}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        icon={icon ? (props) => icon(props) : undefined}
        uppercase={false}
        style={[
          {
            borderRadius: 14,
            borderWidth: 1,
            borderColor,
            backgroundColor: buttonColor,
            shadowColor: variant === "primary" ? colors.primary : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: variant === "primary" ? 0.35 : 0,
            shadowRadius: 10,
            elevation: variant === "primary" ? 6 : 0,
          },
          style,
        ]}
        contentStyle={{
          height: 54,
          paddingHorizontal: 24,
        }}
        labelStyle={{
          fontSize: 16,
          fontWeight: "600",
          letterSpacing: 0.5,
        }}
        textColor={textColor}
      >
        {title}
      </PaperButton>
    </View>
  );
}
