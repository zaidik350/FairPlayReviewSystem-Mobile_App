import { Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export interface AuthHeaderProps {
  badgeLabel: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ badgeLabel, title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-10 items-center">
      <View className="flex-row items-center">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={styles.badge}
        >
          <Sparkles color={colors.primary} size={18} strokeWidth={1.8} />
        </View>
        <Text className="ml-3 text-xs tracking-[3px]" style={styles.badgeText}>
          {badgeLabel}
        </Text>
      </View>

      <View className="mt-6 items-center">
        <View style={styles.titleGlow} />
        <Text className="text-3xl text-center" style={styles.title}>
          {title}
        </Text>
      </View>

      <Text className="mt-2 text-center" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(79,124,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.35)",
  },
  badgeText: {
    color: colors.textMuted,
  },
  title: {
    color: colors.text,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  titleGlow: {
    position: "absolute",
    width: 220,
    height: 20,
    backgroundColor: colors.primary,
    opacity: 0.12,
    borderRadius: 999,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
