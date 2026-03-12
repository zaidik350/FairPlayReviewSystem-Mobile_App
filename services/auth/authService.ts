/**
 * Auth Service — login / signup / logout / changePassword.
 * Uses Supabase directly for authentication.
 */

import { STORAGE_KEYS } from '@/config/env';
import { supabase } from '@/config/supabase';
import type { User } from '@/types';
import type { ChangePasswordRequest, LoginRequest, SignupRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async login(creds: LoginRequest): Promise<{ user: User }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');

    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || creds.email.split('@')[0],
      email: data.user.email!,
      avatar: data.user.user_metadata?.avatar,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user };
  }

  async signup(data: SignupRequest): Promise<{ user: User }> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    });

    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error('Signup failed');

    const user: User = {
      id: authData.user.id,
      name: data.name,
      email: authData.user.email!,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    return { user };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(false));
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: data.new_password,
    });
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return json ? JSON.parse(json) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
}

export const authService = new AuthService();
export default authService;
