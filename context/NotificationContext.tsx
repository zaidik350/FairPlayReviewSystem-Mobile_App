/**
 * NotificationContext — notification preference state.
 */

import { NotificationSettings } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@cricket_drs_notifications';

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  matchAlerts: true,
  reviewUpdates: true,
  systemNotifications: false,
};

export const [NotificationProvider, useNotificationContext] = createContextHook(() => {
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setNotifications(JSON.parse(json));
      } catch (e) {
        console.log('Error loading notifications:', e);
      }
    })();
  }, []);

  const updateNotifications = useCallback(async (updates: Partial<NotificationSettings>) => {
    const updated = { ...notifications, ...updates };
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [notifications]);

  return { notifications, updateNotifications };
});
