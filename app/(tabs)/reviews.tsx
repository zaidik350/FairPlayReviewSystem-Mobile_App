import ReviewCard from '@/components/ReviewCard';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CheckCircle, FileSearch, Filter, XCircle } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type FilterType = 'all' | 'OUT' | 'NOT OUT';
type MatchFilterType = 'all' | string;

export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reviews, matches } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [matchFilter, setMatchFilter] = useState<MatchFilterType>('all');
  const [showMatchFilter, setShowMatchFilter] = useState(false);

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

  const handleFilterPress = (newFilter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const handleMatchFilterPress = (matchId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMatchFilter(matchId);
    setShowMatchFilter(false);
  };

  const uniqueMatchIds = useMemo(() => {
    const matchIds = [...new Set(reviews.map(r => r.matchId))];
    return matchIds;
  }, [reviews]);

  const getMatchName = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    return match?.name || 'Unknown Match';
  };

  const currentMatchName = matchFilter === 'all' ? 'All Matches' : getMatchName(matchFilter);

  const outCount = reviews.filter((r) => r.decision === 'OUT').length;
  const notOutCount = reviews.filter((r) => r.decision === 'NOT OUT').length;

  const filters: { key: FilterType; label: string; count: number; icon?: React.ReactNode }[] = [
    { key: 'all', label: 'All', count: reviews.length },
    { key: 'OUT', label: 'OUT', count: outCount, icon: <CheckCircle size={14} color={Colors.out} /> },
    { key: 'NOT OUT', label: 'NOT OUT', count: notOutCount, icon: <XCircle size={14} color={Colors.notOut} /> },
  ];

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.subtitle}>{reviews.length} total decisions</Text>
      </View>

      <View style={styles.matchFilterContainer}>
        <TouchableOpacity
          style={styles.matchFilterButton}
          onPress={() => setShowMatchFilter(!showMatchFilter)}
        >
          <Filter size={16} color={Colors.primary} />
          <Text style={styles.matchFilterText} numberOfLines={1}>
            {currentMatchName}
          </Text>
        </TouchableOpacity>
      </View>

      {showMatchFilter && (
        <View style={styles.matchFilterDropdown}>
          <TouchableOpacity
            style={[
              styles.matchFilterOption,
              matchFilter === 'all' && styles.matchFilterOptionActive,
            ]}
            onPress={() => handleMatchFilterPress('all')}
          >
            <Text style={[
              styles.matchFilterOptionText,
              matchFilter === 'all' && styles.matchFilterOptionTextActive,
            ]}>
              All Matches
            </Text>
          </TouchableOpacity>
          {uniqueMatchIds.map((matchId) => (
            <TouchableOpacity
              key={matchId}
              style={[
                styles.matchFilterOption,
                matchFilter === matchId && styles.matchFilterOptionActive,
              ]}
              onPress={() => handleMatchFilterPress(matchId)}
            >
              <Text style={[
                styles.matchFilterOptionText,
                matchFilter === matchId && styles.matchFilterOptionTextActive,
              ]} numberOfLines={1}>
                {getMatchName(matchId)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterButton,
                filter === f.key && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(f.key)}
            >
              {f.icon}
              <Text
                style={[
                  styles.filterText,
                  filter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  filter === f.key && styles.countBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    filter === f.key && styles.countTextActive,
                  ]}
                >
                  {f.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
  matchFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  matchFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  matchFilterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    flex: 1,
  },
  matchFilterDropdown: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  matchFilterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  matchFilterOptionActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  matchFilterOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  matchFilterOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  countBadge: {
    backgroundColor: 'rgba(138, 154, 146, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: Colors.primary,
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
