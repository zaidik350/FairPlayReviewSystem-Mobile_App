import Button from '@/components/Button';
import Card from '@/components/Card';
import ReviewCard from '@/components/ReviewCard';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useMatchContext } from '@/context/MatchContext';
import { useReviewContext } from '@/context/ReviewContext';
import type { Review } from '@/types';
import { getStatusColor } from '@/utils/matchHelpers';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Play, Users } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMatchById, updateMatch } = useMatchContext();
  const { getReviewsByMatch } = useReviewContext();

  const match = getMatchById(id || '');
  const matchReviews = getReviewsByMatch(id || '');

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found</Text>
      </View>
    );
  }

  const handleStartMatch = async () => {
    await updateMatch(match.id, { status: 'live' });
    router.push(`/live-match?id=${match.id}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Match Details',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer paddingBottom={100} contentStyle={styles.content}>
          <Card variant="elevated" style={styles.matchCard}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(match.status)}20` }]}>
                {match.status === 'live' && <View style={[styles.statusDot, { backgroundColor: getStatusColor(match.status) }]} />}
                <Text style={[styles.statusText, { color: getStatusColor(match.status) }]}>
                  {match.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.matchName}>{match.name}</Text>

            <View style={styles.infoRow}>
              <Users size={18} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{match.teams}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{match.venue}</Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{match.date}</Text>
            </View>

            {match.status !== 'completed' && (
              <Button
                title={match.status === 'live' ? 'Continue Match' : 'Start Match'}
                onPress={handleStartMatch}
                style={styles.startButton}
                icon={<Play size={18} color={Colors.background} fill={Colors.background} />}
              />
            )}
          </Card>

          {matchReviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Match Reviews ({matchReviews.length})</Text>
              {matchReviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onPress={() => router.push(`/review-detail?id=${review.id}`)}
                />
              ))}
            </>
          )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
  },
  matchCard: {
    padding: 20,
    marginBottom: 24,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  matchName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
  },
  startButton: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
});
