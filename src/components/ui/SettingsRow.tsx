import type { ComponentType } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export interface SettingsRowProps {
  Icon: ComponentType<{
    color?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  value?: string;
  onPress?: () => void;
}

export function SettingsRow({
  Icon,
  title,
  value,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-4"
      style={({ pressed }) => ({
        opacity: pressed && onPress ? 0.6 : 1,
      })}
    >
      {/* Left side */}
      <View className="flex-row items-center">
        <View
          className="h-10 w-10 items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
          }}
        >
          <Icon
            color={colors.secondary}
            size={18}
            strokeWidth={1.8}
          />
        </View>

        <Text
          className="ml-3 text-base"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
      </View>

      {/* Right side value */}
      {value ? (
        <Text
          className="text-sm"
          style={{ color: colors.textMuted }}
        >
          {value}
        </Text>
      ) : null}
    </Pressable>
  );
}
