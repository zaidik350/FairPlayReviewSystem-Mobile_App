import Colors from "@/constants/colors";
import { DecisionType } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DecisionBadgeProps {
  decision: DecisionType;
  size?: "small" | "medium" | "large";
}

export default function DecisionBadge({
  decision,
  size = "medium",
}: DecisionBadgeProps) {
  const isOut = decision === "OUT";

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "large":
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "small":
        return styles.smallText;
      case "large":
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getSizeStyle(),
        isOut ? styles.outBadge : styles.notOutBadge,
      ]}
    >
      <Text
        style={[
          styles.text,
          getTextStyle(),
          isOut ? styles.outText : styles.notOutText,
        ]}
      >
        {decision}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  outBadge: {
    backgroundColor: "rgba(0, 255, 136, 0.15)",
    borderWidth: 1,
    borderColor: Colors.out,
  },
  notOutBadge: {
    backgroundColor: "rgba(255, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: Colors.notOut,
  },
  text: {
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 24,
  },
  outText: {
    color: Colors.out,
  },
  notOutText: {
    color: Colors.notOut,
  },
});
