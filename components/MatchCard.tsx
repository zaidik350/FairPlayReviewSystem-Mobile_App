import Colors from '@/constants/colors';
import { Match } from '@/types';
import * as Haptics from 'expo-haptics';
import { Calendar, ChevronRight, MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export default function MatchCard({ match, onPress }: MatchCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getStatusStyle = () => {
    switch (match.status) {
      case 'live':
        return styles.liveStatus;
      case 'upcoming':
        return styles.upcomingStatus;
      case 'completed':
        return styles.completedStatus;
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'completed':
        return 'COMPLETED';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{match.name}</Text>
        <View style={[styles.statusBadge, getStatusStyle()]}>
          {match.status === 'live' && <View style={styles.liveDot} />}
          <Text style={[styles.statusText, match.status === 'live' && styles.liveText]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.teams}>{match.teams}</Text>
      
      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{match.venue}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{match.date}</Text>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <ChevronRight size={20} color={Colors.primary} />
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
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  liveStatus: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  upcomingStatus: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  completedStatus: {
    backgroundColor: 'rgba(138, 154, 146, 0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  liveText: {
    color: Colors.live,
  },
  teams: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: 4,
  },
});
