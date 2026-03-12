import Card from '@/components/Card';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useMatchContext } from '@/context/MatchContext';
import { useReviewContext } from '@/context/ReviewContext';
import type { Review } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    CalendarPlus,
    ChevronRight,
    FileSearch,
    Play,
    Radio,
    Zap,
} from 'lucide-react-native';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getLiveMatches } = useMatchContext();
  const { reviews } = useReviewContext();

  const liveMatches = getLiveMatches();

  const handlePress = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (action) {
      case 'join':
        router.push('/(tabs)/matches');
        break;
      case 'schedule':
        router.push('/create-match');
        break;
      case 'live':
        if (liveMatches.length > 0) {
          router.push(`/live-match?id=${liveMatches[0].id}`);
        } else {
          router.push('/(tabs)/matches');
        }
        break;
      case 'reviews':
        router.push('/(tabs)/reviews');
        break;
    }
  };

  return (
    <ScreenContainer paddingTop={16} paddingBottom={100} contentStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'Umpire'}</Text>
            <Text style={styles.subtitle}>Ready to officiate?</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoRing}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{liveMatches.length}</Text>
            <Text style={styles.statLabel}>Live</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {reviews.filter((r: Review) => r.decision === 'OUT').length}
            </Text>
            <Text style={styles.statLabel}>OUT</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => handlePress('join')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDim]}
              style={styles.primaryActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIconContainer}>
                <Play size={32} color={Colors.background} fill={Colors.background} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.primaryActionTitle}>Join Match</Text>
                <Text style={styles.primaryActionSubtitle}>
                  Start officiating a live match
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.background} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => handlePress('schedule')}
            activeOpacity={0.85}
          >
            <Card variant="elevated" style={styles.actionCard}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(0, 230, 118, 0.15)' }]}>
                <CalendarPlus size={24} color={Colors.accent} />
              </View>
              <Text style={styles.actionTitle}>Schedule Match</Text>
              <Text style={styles.actionSubtitle}>Create a new match</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.gridActions}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePress('live')}
            activeOpacity={0.85}
          >
            <Card style={styles.gridCard}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(255, 59, 48, 0.15)' }]}>
                <Radio size={28} color={Colors.live} />
              </View>
              <Text style={styles.gridTitle}>Live Matches</Text>
              <Text style={styles.gridCount}>{liveMatches.length} active</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePress('reviews')}
            activeOpacity={0.85}
          >
            <Card style={styles.gridCard}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(0, 255, 136, 0.15)' }]}>
                <FileSearch size={28} color={Colors.primary} />
              </View>
              <Text style={styles.gridTitle}>My Reviews</Text>
              <Text style={styles.gridCount}>{reviews.length} total</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <Card variant="glass" style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Zap size={16} color={Colors.warning} />
            <Text style={styles.tipTitle}>DRS Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Remember to check all three parameters: Impact, Pitch, and Wickets
            before making your final decision.
          </Text>
        </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  logoRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActions: {
    marginBottom: 24,
  },
  primaryAction: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  primaryActionSubtitle: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 2,
  },
  secondaryAction: {
    flex: 1,
  },
  actionCard: {
    padding: 20,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  gridActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
  },
  gridCard: {
    padding: 16,
    minHeight: 140,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.live,
    letterSpacing: 0.5,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  gridCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tipCard: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warning,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
