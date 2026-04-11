/**
 * ReviewPromptModal — two-step modal:
 *   1. "Do you want to review?" (Yes / No)
 *   2. "What was your original decision?" (OUT / NOT OUT)
 */

import Card from "@/components/Card";
import AppColors from "@/constants/colors";
import { CheckCircle, X, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Colors = AppColors;

interface ReviewPromptModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (decision: "OUT" | "NOT OUT") => void;
}

export default function ReviewPromptModal({
  visible,
  onDismiss,
  onSubmit,
}: ReviewPromptModalProps) {
  const [wantsReview, setWantsReview] = useState<boolean | null>(null);

  const handleDismiss = () => {
    setWantsReview(null);
    onDismiss();
  };
  const handleSubmit = (d: "OUT" | "NOT OUT") => {
    setWantsReview(null);
    onSubmit(d);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Card variant="elevated" style={styles.card}>
          {wantsReview === null ? (
            <>
              <Text style={styles.title}>Delivery Recorded</Text>
              <Text style={styles.subtitle}>
                Would you like to request a DRS review for this delivery?
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.btn, styles.dismiss]}
                  onPress={handleDismiss}
                >
                  <X size={24} color={Colors.textSecondary} />
                  <Text style={styles.dismissText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.review]}
                  onPress={() => setWantsReview(true)}
                >
                  <CheckCircle size={24} color={Colors.primary} />
                  <Text style={styles.reviewText}>Yes, Review</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Your Original Decision</Text>
              <Text style={styles.subtitle}>
                What was your decision for this delivery before requesting the
                review?
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.btn, styles.outBtn]}
                  onPress={() => handleSubmit("OUT")}
                >
                  <CheckCircle size={24} color={Colors.out} />
                  <Text style={styles.outText}>OUT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.notOutBtn]}
                  onPress={() => handleSubmit("NOT OUT")}
                >
                  <XCircle size={24} color={Colors.notOut} />
                  <Text style={styles.notOutText}>NOT OUT</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setWantsReview(null)}
              >
                <Text style={styles.cancelText}>Go Back</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: { width: "100%", maxWidth: 340, padding: 24, alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttons: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  dismiss: {
    backgroundColor: "rgba(255,68,68,0.1)",
    borderWidth: 1,
    borderColor: Colors.destructive,
  },
  review: {
    backgroundColor: "rgba(0,255,136,0.1)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dismissText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  reviewText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  outBtn: {
    backgroundColor: "rgba(0,230,118,0.1)",
    borderWidth: 1,
    borderColor: Colors.out,
  },
  notOutBtn: {
    backgroundColor: "rgba(255,68,68,0.1)",
    borderWidth: 1,
    borderColor: Colors.notOut,
  },
  outText: { fontSize: 13, fontWeight: "600", color: Colors.out },
  notOutText: { fontSize: 13, fontWeight: "600", color: Colors.notOut },
  cancel: { marginTop: 16, paddingVertical: 8 },
  cancelText: { fontSize: 14, color: Colors.textMuted },
});
