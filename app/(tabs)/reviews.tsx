import ReviewCard from '@/components/ReviewCard';
import FilterPills, { type FilterItem } from '@/components/filters/FilterPills';
import MatchDropdown from '@/components/filters/MatchDropdown';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { ReviewsScreenSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { Skeleton } from '@/components/skeleton/Skeleton';
import Colors from '@/constants/colors';
import { useMatchContext } from '@/context/MatchContext';
import { useReviewContext } from '@/context/ReviewContext';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CheckCircle, FileSearch, XCircle } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type FilterType = 'all' | 'OUT' | 'NOT OUT';
type MatchFilterType = 'all' | string;

export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reviews, refreshReviews, isLoadingReviews } = useReviewContext();
  const { matches, isLoadingMatches } = useMatchContext();
  const listDataLoading = isLoadingReviews || isLoadingMatches;
  const [filter, setFilter] = useState<FilterType>('all');
  const [matchFilter, setMatchFilter] = useState<MatchFilterType>('all');

  useFocusEffect(
    useCallback(() => {
      refreshReviews().catch((error) => {
        console.log('[ReviewsScreen][useFocusEffect] refresh error:', error);
      });
    }, [refreshReviews])
  );

  const filteredReviews = useMemo(() => {
    let result = reviews;
    
    if (matchFilter !== 'all') {
      result = result.filter((r) => r.matchId === matchFilter);
    }
    
    if (filter !== 'all') {
      result = result.filter((r) => r.decision === filter);
    }
    
    return result;
  }, [reviews, filter, matchFilter]);

  const matchDropdownOptions = useMemo(() => {
    const matchIds = [...new Set(reviews.map(r => r.matchId))];
    return matchIds.map(id => ({
      id,
      name: matches.find(m => m.id === id)?.name || 'Unknown Match',
    }));
  }, [reviews, matches]);

  const outCount = reviews.filter((r) => r.decision === 'OUT').length;
  const notOutCount = reviews.filter((r) => r.decision === 'NOT OUT').length;

  const filters: FilterItem<FilterType>[] = [
    { key: 'all', label: 'All', count: reviews.length },
    { key: 'OUT', label: 'OUT', count: outCount, icon: <CheckCircle size={14} color={Colors.out} /> },
    { key: 'NOT OUT', label: 'NOT OUT', count: notOutCount, icon: <XCircle size={14} color={Colors.notOut} /> },
  ];

  return (
    <ScreenContainer scroll={false} safeArea={false}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Reviews</Text>
        {listDataLoading ? (
          <Skeleton width={160} height={14} borderRadius={4} style={{ marginTop: 6 }} />
        ) : (
          <Text style={styles.subtitle}>{reviews.length} total decisions</Text>
        )}
      </View>

      {listDataLoading ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ReviewsScreenSkeleton />
        </ScrollView>
      ) : (
        <>
      <MatchDropdown
        value={matchFilter}
        options={matchDropdownOptions}
        onChange={setMatchFilter}
      />

      <View style={styles.filterContainer}>
        <FilterPills filters={filters} active={filter} onChange={setFilter} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <FileSearch size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all'
                ? 'Start officiating matches to record reviews'
                : `No ${filter} decisions recorded`}
            </Text>
          </View>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onPress={() => router.push(`/review-detail?id=${review.id}`)}
            />
          ))
        )}
      </ScrollView>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
