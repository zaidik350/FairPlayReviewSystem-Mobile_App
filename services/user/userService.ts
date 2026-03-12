/**
 * User Service — profile + notification settings.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { NotificationSettings, User } from '@/types';
import type { UpdateProfileRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserService {
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
      return res.data;
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    const current: User = json ? JSON.parse(json) : { id: '1', name: '', email: '' };
    const updated = { ...current, ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  }

  async getNotifications(): Promise<NotificationSettings> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<NotificationSettings>(API_ENDPOINTS.USER.NOTIFICATIONS);
      return res.data;
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return json ? JSON.parse(json) : { matchAlerts: true, reviewUpdates: true, systemNotifications: false };
  }

  async updateNotifications(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.put<NotificationSettings>(API_ENDPOINTS.USER.NOTIFICATIONS, data);
      return res.data;
    }
    const current = await this.getNotifications();
    const updated = { ...current, ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  }
}

export const userService = new UserService();
export default userService;
