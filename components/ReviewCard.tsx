import Colors from '@/constants/colors';
import { Review } from '@/types';
import { formatDateShort } from '@/utils/formatters';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DecisionBadge from './DecisionBadge';

interface ReviewCardProps {
  review: Review;
  onPress?: () => void;
}

export default function ReviewCard({ review, onPress }: ReviewCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Text style={styles.matchName} numberOfLines={1}>{review.matchName}</Text>
        <DecisionBadge decision={review.decision} size="small" />
      </View>
      
      <View style={styles.details}>
        <View style={styles.overBadge}>
          <Text style={styles.overLabel}>Over</Text>
          <Text style={styles.overValue}>{review.over}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Impact:</Text>
            <Text style={styles.infoValue}>{review.impact}</Text>
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
          <Text style={styles.timeText}>{formatDateShort(review.timestamp)}</Text>
        </View>
        <ChevronRight size={18} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 12,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  overBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  overLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
