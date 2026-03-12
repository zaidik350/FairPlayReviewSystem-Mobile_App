/**
 * Auth Service — login / signup / logout / changePassword.
 * Falls back to mock logic when USE_REAL_API is false.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { User } from '@/types';
import type { AuthResponse, ChangePasswordRequest, LoginRequest, SignupRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async login(creds: LoginRequest): Promise<{ user: User }> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, creds);
      await apiClient.setToken(res.data.tokens.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.tokens.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
      return { user: res.data.user };
    }
    // Mock
    const user: User = { id: Date.now().toString(), name: creds.email.split('@')[0], email: creds.email };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user };
  }

  async signup(data: SignupRequest): Promise<{ user: User }> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
      await apiClient.setToken(res.data.tokens.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.tokens.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
      return { user: res.data.user };
    }
    // Mock — reuses login path
    const user: User = { id: Date.now().toString(), name: data.name, email: data.email };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user };
  }

  async logout(): Promise<void> {
    if (API_CONFIG.USE_REAL_API) {
      try { await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT); } catch { /* best-effort */ }
    }
    await apiClient.clearTokens();
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(false));
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    if (API_CONFIG.USE_REAL_API) {
      await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return;
    }
    // Mock — simulate network delay
    await new Promise(r => setTimeout(r, 800));
  }

  async getCurrentUser(): Promise<User | null> {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return json ? JSON.parse(json) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    if (API_CONFIG.USE_REAL_API) return !!(await apiClient.getToken());
    const v = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return v ? JSON.parse(v) : false;
  }
}

export const authService = new AuthService();
export default authService;
