import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../theme/colors";

export interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  intensity?: number;
}

export function Card({
  children,
  className,
  glass = false,
  intensity = 35,
}: CardProps) {
  return (
    <View
      className={`rounded-2xl ${className ?? ""}`}
      style={[
        styles.card,
        glass ? styles.glassCard : styles.solidCard,
      ]}
    >
      {glass && (
        <BlurView
          intensity={intensity}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  solidCard: {
    backgroundColor: colors.surface,
  },

  glassCard: {
    backgroundColor: "rgba(15, 23, 42, 0.65)", // dark glass base
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  content: {
    position: "relative",
  },
});
