/**
 * Auth Service — login / signup / logout / changePassword.
 * Uses backend auth endpoints when USE_REAL_API is enabled.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { User } from '@/types';
import type { AuthResponseData, ChangePasswordRequest, LoginRequest, SignupRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

function mapApiUser(raw: AuthResponseData['user']): User {
  const firstName = raw.fname?.trim() ?? '';
  const lastName = raw.lname?.trim() ?? '';
  const combinedName = `${firstName} ${lastName}`.trim();
  const fallbackName = raw.email ? raw.email.split('@')[0] : 'User';

  return {
    id: String(raw.id),
    name: raw.name?.trim() || combinedName || fallbackName,
    email: raw.email,
    avatar: raw.avatar ?? undefined,
  };
}

class AuthService {
  async login(creds: LoginRequest): Promise<{ user: User }> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.LOGIN, creds);
      const user = mapApiUser(res.data.user);
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.access_token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
      return { user };
    }

    const mockUser: User = {
      id: '1',
      name: creds.email.split('@')[0],
      email: creds.email,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user: mockUser };
  }

  async signup(data: SignupRequest): Promise<{ user: User }> {
    if (API_CONFIG.USE_REAL_API) {
      const body = {
        fname: data.fname,
        lname: data.lname,
        name: `${data.fname} ${data.lname}`.trim(),
        email: data.email,
        password: data.password,
      };
      const res = await apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.SIGNUP, body);
      const user = mapApiUser(res.data.user);
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.access_token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
      return { user };
    }

    const mockUser: User = {
      id: Date.now().toString(),
      name: `${data.fname} ${data.lname}`.trim(),
      email: data.email,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user: mockUser };
  }

  async logout(): Promise<void> {
    await apiClient.clearTokens();
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(false));
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    if (API_CONFIG.USE_REAL_API) {
      await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return json ? JSON.parse(json) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!API_CONFIG.USE_REAL_API) {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return json ? JSON.parse(json) : false;
    }

    const token = await apiClient.getToken();
    if (!token) return false;

    try {
      await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
