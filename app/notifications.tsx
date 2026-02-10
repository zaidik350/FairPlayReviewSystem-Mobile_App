import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { Bell, FileCheck, Radio, Settings } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, updateNotifications } = useApp();

  const handleToggle = (key: keyof typeof notifications, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateNotifications({ [key]: value });
  };

  const notificationItems = [
    {
      key: 'matchAlerts' as const,
      icon: <Radio size={20} color={Colors.live} />,
      title: 'Match Alerts',
      subtitle: 'Get notified when matches go live',
      value: notifications.matchAlerts,
    },
    {
      key: 'reviewUpdates' as const,
      icon: <FileCheck size={20} color={Colors.primary} />,
      title: 'Review Updates',
      subtitle: 'Notifications for review decisions',
      value: notifications.reviewUpdates,
    },
    {
      key: 'systemNotifications' as const,
      icon: <Settings size={20} color={Colors.accent} />,
      title: 'System Notifications',
      subtitle: 'App updates and announcements',
      value: notifications.systemNotifications,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Bell size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Notification Preferences</Text>
            <Text style={styles.headerSubtitle}>
              Choose which notifications you would like to receive
            </Text>
          </View>

          <Card style={styles.settingsCard}>
            {notificationItems.map((item, index) => (
              <View
                key={item.key}
                style={[
                  styles.settingItem,
                  index < notificationItems.length - 1 && styles.settingItemBorder,
                ]}
              >
                <View style={styles.settingIcon}>{item.icon}</View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: Colors.cardBorder, true: Colors.primaryDim }}
                  thumbColor={item.value ? Colors.primary : Colors.textMuted}
                />
              </View>
            ))}
          </Card>

          <Text style={styles.footerText}>
            You can change these preferences at any time. Some notifications may
            still be sent for important account and security updates.
          </Text>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
