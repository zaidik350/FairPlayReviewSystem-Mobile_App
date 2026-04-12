import Colors from "@/constants/colors";
import { Review } from "@/types";
import { formatDateShort } from "@/utils/formatters";
import { isProbablyImageUri, resolveVideoUri } from "@/utils/reviewMedia";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import { ChevronRight, Clock } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DecisionBadge from "./DecisionBadge";

interface ReviewCardProps {
  review: Review;
  onPress?: () => void;
  /** When true, shows image or video from `review.videoUri` (backend URL or file). */
  showMediaPreview?: boolean;
}

export default function ReviewCard({
  review,
  onPress,
  showMediaPreview = false,
}: ReviewCardProps) {
  const isOverturned = review.originalDecision !== review.decision;
  const mediaUri = showMediaPreview ? resolveVideoUri(review.videoUri) : "";
  const useImage = mediaUri ? isProbablyImageUri(mediaUri) : false;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const mediaBlock =
    mediaUri ? (
      <View style={styles.mediaWrap}>
        {useImage ? (
          <Image
            source={{ uri: mediaUri }}
            style={styles.media}
            resizeMode="cover"
          />
        ) : (
          <Video
            source={{ uri: mediaUri }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay={false}
          />
        )}
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {mediaBlock}

      <TouchableOpacity
        style={styles.body}
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={!onPress}
      >
        <View style={styles.header}>
          <Text style={styles.matchName} numberOfLines={1}>
            {review.matchName}
          </Text>
          <DecisionBadge decision={review.decision} size="small" />
        </View>

        <View style={styles.details}>
          <View
            style={[
              styles.statusBadge,
              isOverturned ? styles.overturnedBadge : styles.confirmedBadge,
            ]}
          >
            <Text style={styles.statusLabel}>Review</Text>
            <Text
              style={[
                styles.statusValue,
                { color: isOverturned ? Colors.notOut : Colors.out },
              ]}
            >
              {isOverturned ? "Overturned" : "Confirmed"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Original:</Text>
              <Text style={styles.infoValue}>{review.originalDecision}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Impact:</Text>
              <Text style={styles.infoValue}>{review.impact}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pitch:</Text>
              <Text style={styles.infoValue}>{review.pitch}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wickets:</Text>
              <Text style={styles.infoValue}>{review.wickets}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.timeRow}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.timeText}>
              {formatDateShort(review.timestamp)}
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
    overflow: "hidden",
  },
  mediaWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  body: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  matchName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
    marginRight: 12,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 16,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 96,
  },
  confirmedBadge: {
    backgroundColor: "rgba(0, 255, 136, 0.12)",
  },
  overturnedBadge: {
    backgroundColor: "rgba(255, 68, 68, 0.12)",
  },
  statusLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
