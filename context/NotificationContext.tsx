/**
 * NotificationContext — notification preference state.
 * Delegates to userService which handles mock vs real API.
 */

import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/user/userService';
import { NotificationSettings } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  matchAlerts: true,
  reviewUpdates: true,
  systemNotifications: false,
};

export const [NotificationProvider, useNotificationContext] = createContextHook(() => {
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const { isLoggedIn, isLoading } = useAuth();

  /* Load notification settings only when the user is authenticated */
  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      setNotifications(DEFAULT_NOTIFICATIONS);
      setIsLoadingNotifications(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoadingNotifications(true);
      try {
        const data = await userService.getNotificationSettings();
        if (!cancelled) setNotifications(data);
      } catch (e) {
        console.log('Error loading notifications:', e);
      } finally {
        if (!cancelled) setIsLoadingNotifications(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isLoading]);

  const updateNotifications = useCallback(async (updates: Partial<NotificationSettings>) => {
    const updated = await userService.updateNotificationSettings(updates);
    setNotifications(updated);
  }, []);

  return { notifications, isLoadingNotifications, updateNotifications };
});
