/**
 * NotificationContext — notification preference state.
 * Delegates to userService which handles mock vs real API.
 */

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

  /* Load notification settings on mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await userService.getNotificationSettings();
        setNotifications(data);
      } catch (e) {
        console.log('Error loading notifications:', e);
      }
    })();
  }, []);

  const updateNotifications = useCallback(async (updates: Partial<NotificationSettings>) => {
    const updated = await userService.updateNotificationSettings(updates);
    setNotifications(updated);
  }, []);

  return { notifications, updateNotifications };
});
