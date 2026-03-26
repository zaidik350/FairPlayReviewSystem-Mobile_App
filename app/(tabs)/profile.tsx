import Button from '@/components/Button';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Colors from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useMatchContext } from '@/context/MatchContext';
import { useReviewContext } from '@/context/ReviewContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronRight,
    FileCheck,
    Lock,
    LogOut,
    Target,
    Trophy,
    User,
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { matches } = useMatchContext();
  const { reviews, getAccuracy } = useReviewContext();

  const accuracy = getAccuracy();

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const settingsItems = [
    {
      icon: <User size={20} color={Colors.primary} />,
      title: 'Edit Profile',
      subtitle: 'Update your information',
      route: '/edit-profile',
    },
    {
      icon: <Bell size={20} color={Colors.accent} />,
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      route: '/notifications',
    },
    {
      icon: <Lock size={20} color={Colors.warning} />,
      title: 'Change Password',
      subtitle: 'Update your security',
      route: '/change-password',
    },
  ];

  return (
    <ScreenContainer paddingTop={16} paddingBottom={100} contentStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDim]}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </View>
          <Text style={styles.name}>{user?.name || 'Umpire'}</Text>
          <Text style={styles.email}>{user?.email || 'umpire@cricket.com'}</Text>
          <View style={styles.badge}>
            <Trophy size={14} color={Colors.warning} />
            <Text style={styles.badgeText}>Official Umpire</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            label="Matches"
            value={matches.length}
            icon={<Target size={20} color={Colors.primary} />}
            color={Colors.primary}
          />
          <StatCard
            label="Reviews"
            value={reviews.length}
            icon={<FileCheck size={20} color={Colors.accent} />}
            color={Colors.accent}
          />
          <StatCard
            label="Accuracy"
            value={`${accuracy}%`}
            icon={<Trophy size={20} color={Colors.warning} />}
            color={Colors.warning}
          />
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>

        <Card style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.settingsItem,
                index < settingsItems.length - 1 && styles.settingsItemBorder,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(item.route as any);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingsIcon}>{item.icon}</View>
              <View style={styles.settingsContent}>
                <Text style={styles.settingsTitle}>{item.title}</Text>
                <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="destructive"
          style={styles.logoutButton}
          icon={<LogOut size={18} color={Colors.destructive} />}
        />

        <Text style={styles.version}>Version 1.0.0</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 47,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 47,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.warning,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 32,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 24,
  },
});
