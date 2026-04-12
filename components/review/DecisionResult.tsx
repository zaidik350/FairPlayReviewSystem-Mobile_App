/**
 * DecisionResult — the final-decision card (badge + explanation + comparison).
 */

import Card from "@/components/Card";
import DecisionBadge from "@/components/DecisionBadge";
import Colors from "@/constants/colors";
import type { DecisionType } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DecisionResultProps {
  decision: DecisionType;
  originalDecision: DecisionType;
}

export default function DecisionResult({
  decision,
  originalDecision,
}: DecisionResultProps) {
  const matches = originalDecision === decision;
  return (
    <Card variant="elevated" style={styles.card}>
      <Text style={styles.title}>Final Decision</Text>
      <DecisionBadge decision={decision} size="large" />
      <Text style={styles.explanation}>
        {decision === "OUT"
          ? "Ball pitched in-line, impact in-line, hitting wickets."
          : "One or more conditions not met for OUT decision."}
      </Text>
      <View style={styles.comparison}>
        <Text style={styles.compLabel}>Your Decision:</Text>
        <Text
          style={[
            styles.compValue,
            { color: matches ? Colors.out : Colors.notOut },
          ]}
        >
          {originalDecision} {matches ? "✓" : "✗"}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24, alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  explanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
  comparison: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 8,
  },
  compLabel: { fontSize: 14, color: Colors.textSecondary },
  compValue: { fontSize: 14, fontWeight: "700" },
});
