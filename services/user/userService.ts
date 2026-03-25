/**
 * User Service — profile + notification settings.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { NotificationSettings, User } from '@/types';
import type { ApiNotificationSettings, UpdateProfileRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Map backend ApiNotificationSettings → frontend NotificationSettings */
function toSettings(api: ApiNotificationSettings): NotificationSettings {
  return {
    matchAlerts: api.match_alerts,
    reviewUpdates: api.review_updates,
    systemNotifications: api.system_notifications,
  };
}

/** Map frontend NotificationSettings → backend snake_case body */
function toSettingsBody(s: Partial<NotificationSettings>): Record<string, boolean> {
  const body: Record<string, boolean> = {};
  if (s.matchAlerts !== undefined) body.match_alerts = s.matchAlerts;
  if (s.reviewUpdates !== undefined) body.review_updates = s.reviewUpdates;
  if (s.systemNotifications !== undefined) body.system_notifications = s.systemNotifications;
  return body;
}

/** Map backend user row → frontend User (id: string) */
function mapUser(raw: { id: number; name: string; email: string; avatar?: string | null }): User {
  return { id: String(raw.id), name: raw.name, email: raw.email, avatar: raw.avatar ?? undefined };
}

class UserService {
  async getProfile(): Promise<User> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<{ id: number; name: string; email: string; avatar: string | null }>(API_ENDPOINTS.PROFILE.GET);
      const user = mapUser(res.data);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return json ? JSON.parse(json) : { id: '1', name: '', email: '' };
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.put<{ id: number; name: string; email: string; avatar: string | null }>(API_ENDPOINTS.PROFILE.UPDATE, data);
      const user = mapUser(res.data);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    const current: User = json ? JSON.parse(json) : { id: '1', name: '', email: '' };
    const composedName = (data.fname || data.lname)
      ? `${data.fname ?? ''} ${data.lname ?? ''}`.trim()
      : undefined;

    const updated = {
      ...current,
      ...data,
      name: composedName || data.name || current.name,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<ApiNotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS);
      return toSettings(res.data);
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return json ? JSON.parse(json) : { matchAlerts: true, reviewUpdates: true, systemNotifications: false };
  }

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.put<ApiNotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS, toSettingsBody(data));
      return toSettings(res.data);
    }
    const current = await this.getNotificationSettings();
    const updated = { ...current, ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  }
}

export const userService = new UserService();
export default userService;
