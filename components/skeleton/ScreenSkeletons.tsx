import { Skeleton } from '@/components/skeleton/Skeleton';
import Colors from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

function MatchCardSkeletonItem() {
  return (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Skeleton width="55%" height={18} borderRadius={6} />
        <Skeleton width={72} height={26} borderRadius={14} />
      </View>
      <Skeleton width="85%" height={14} borderRadius={4} style={styles.mt8} />
      <View style={styles.matchFooter}>
        <Skeleton width="40%" height={12} borderRadius={4} />
        <Skeleton width="45%" height={12} borderRadius={4} />
      </View>
    </View>
  );
}

export function MatchesListSkeleton() {
  return (
    <View>
      {[0, 1, 2, 3].map((k) => (
        <MatchCardSkeletonItem key={k} />
      ))}
    </View>
  );
}

export function HomeDataSkeleton() {
  return (
    <View>
      <View style={styles.homeHeader}>
        <View style={styles.flex1}>
          <Skeleton width="70%" height={28} borderRadius={8} />
          <Skeleton width="45%" height={16} borderRadius={4} style={styles.mt10} />
        </View>
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>
      <View style={styles.statsRow}>
        {[0, 1, 2].map((k) => (
          <View key={k} style={styles.statBlock}>
            <Skeleton width={40} height={28} borderRadius={6} />
            <Skeleton width={52} height={12} borderRadius={4} style={styles.mt8} />
          </View>
        ))}
      </View>
      <Skeleton height={88} borderRadius={16} style={styles.mb16} />
      <Skeleton height={100} borderRadius={16} style={styles.mb24} />
      <Skeleton width={120} height={18} borderRadius={6} style={styles.mb16} />
      <View style={styles.gridRow}>
        <Skeleton height={140} borderRadius={16} style={styles.gridHalf} />
        <Skeleton height={140} borderRadius={16} style={styles.gridHalf} />
      </View>
    </View>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <View style={[styles.statsRow, styles.profileStatsWrap]}>
      {[0, 1, 2].map((k) => (
        <View key={k} style={styles.statCardSk}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <Skeleton width={36} height={26} borderRadius={6} style={styles.mt10} />
          <Skeleton width={56} height={12} borderRadius={4} style={styles.mt6} />
        </View>
      ))}
    </View>
  );
}

export function ReviewsScreenSkeleton() {
  return (
    <View>
      <Skeleton width={140} height={32} borderRadius={8} />
      <Skeleton width={200} height={16} borderRadius={4} style={styles.mt8} />
      <Skeleton height={48} borderRadius={12} style={styles.mt16} />
      <View style={styles.pillsRow}>
        {[0, 1, 2].map((k) => (
          <Skeleton key={k} width={88} height={36} borderRadius={18} />
        ))}
      </View>
      {[0, 1, 2, 3].map((k) => (
        <View key={k} style={styles.reviewCard}>
          <View style={styles.rowBetween}>
            <Skeleton width="50%" height={16} borderRadius={4} />
            <Skeleton width={56} height={28} borderRadius={14} />
          </View>
          <Skeleton width="70%" height={14} borderRadius={4} style={styles.mt12} />
        </View>
      ))}
    </View>
  );
}

export function MatchDetailSkeleton() {
  return (
    <View>
      <View style={styles.elevCard}>
        <View style={styles.alignEnd}>
          <Skeleton width={88} height={28} borderRadius={14} />
        </View>
        <Skeleton width="75%" height={24} borderRadius={6} style={styles.mt16} />
        <Skeleton width="90%" height={16} borderRadius={4} style={styles.mt12} />
        <Skeleton width="70%" height={16} borderRadius={4} style={styles.mt8} />
        <View style={styles.rowGap}>
          <Skeleton width="45%" height={14} borderRadius={4} />
          <Skeleton width="45%" height={14} borderRadius={4} />
        </View>
        <Skeleton height={44} borderRadius={12} style={styles.mt20} />
        <Skeleton height={44} borderRadius={12} style={styles.mt12} />
      </View>
      <Skeleton width={160} height={18} borderRadius={6} style={styles.mt24} />
      {[0, 1].map((k) => (
        <View key={k} style={styles.reviewCard}>
          <Skeleton width="60%" height={16} borderRadius={4} />
          <Skeleton width="100%" height={12} borderRadius={4} style={styles.mt10} />
        </View>
      ))}
    </View>
  );
}

export function ReviewDetailSkeleton() {
  return (
    <View>
      <Skeleton height={200} borderRadius={16} />
      <View style={styles.glassCard}>
        <Skeleton width="70%" height={20} borderRadius={6} />
        <View style={styles.rowBetween}>
          <Skeleton width={72} height={56} borderRadius={12} />
          <Skeleton width="45%" height={14} borderRadius={4} />
        </View>
      </View>
      <Skeleton width={180} height={18} borderRadius={6} style={styles.mt8} />
      <View style={styles.paramCard}>
        {[0, 1, 2].map((k) => (
          <View key={k}>
            {k > 0 ? <View style={styles.hDivider} /> : null}
            <View style={styles.paramRow}>
              <Skeleton width={40} height={40} borderRadius={20} />
              <Skeleton width={80} height={16} borderRadius={4} />
              <Skeleton width={72} height={18} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.decisionSk}>
        <Skeleton width={120} height={12} borderRadius={4} />
        <Skeleton width={100} height={40} borderRadius={20} style={styles.mt12} />
        <Skeleton width="90%" height={14} borderRadius={4} style={styles.mt16} />
      </View>
    </View>
  );
}

export function NotificationsSkeleton() {
  return (
    <View>
      <View style={styles.notifHeader}>
        <Skeleton width={64} height={64} borderRadius={32} />
        <Skeleton width="80%" height={22} borderRadius={6} style={styles.mt16} />
        <Skeleton width="95%" height={14} borderRadius={4} style={styles.mt8} />
      </View>
      <View style={styles.settingsCardSk}>
        {[0, 1, 2].map((k) => (
          <View
            key={k}
            style={[styles.settingRow, k < 2 ? styles.settingBorder : null]}
          >
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.flex1}>
              <Skeleton width="55%" height={16} borderRadius={4} />
              <Skeleton width="85%" height={12} borderRadius={4} style={styles.mt6} />
            </View>
            <Skeleton width={52} height={32} borderRadius={16} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function UmpireConsoleSkeleton() {
  return (
    <View>
      <View style={styles.elevCard}>
        <Skeleton width="70%" height={22} borderRadius={6} />
        <Skeleton width="55%" height={16} borderRadius={4} style={styles.mt10} />
        <Skeleton width="90%" height={16} borderRadius={4} style={styles.mt16} />
        <Skeleton width="75%" height={14} borderRadius={4} style={styles.mt8} />
      </View>
      <View style={styles.elevCard}>
        <Skeleton height={48} borderRadius={12} />
        <Skeleton height={48} borderRadius={12} style={styles.mt12} />
        <Skeleton width="100%" height={36} borderRadius={6} style={styles.mt12} />
      </View>
      <View style={styles.elevCard}>
        <Skeleton width="50%" height={18} borderRadius={6} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.mt16} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.mt8} />
      </View>
    </View>
  );
}

export function LiveMatchBannerSkeleton() {
  return (
    <View style={styles.liveBanner}>
      <Skeleton width="60%" height={20} borderRadius={6} />
      <Skeleton width="40%" height={14} borderRadius={4} style={styles.mt12} />
    </View>
  );
}

export function MatchModeSkeleton() {
  return (
    <View>
      <View style={styles.elevCard}>
        <Skeleton width="85%" height={22} borderRadius={6} />
        <Skeleton width="70%" height={18} borderRadius={4} style={styles.mt16} />
        <Skeleton width="55%" height={16} borderRadius={4} style={styles.mt8} />
        <Skeleton height={48} borderRadius={12} style={styles.mt24} />
        <Skeleton height={48} borderRadius={12} style={styles.mt12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  matchCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  profileStatsWrap: {
    marginBottom: 32,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridHalf: {
    flex: 1,
  },
  statCardSk: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elevCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    marginBottom: 8,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  rowGap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  glassCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  paramCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 24,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  hDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 16,
  },
  decisionSk: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 28,
    alignItems: 'center',
  },
  notifHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsCardSk: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  liveBanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
});
