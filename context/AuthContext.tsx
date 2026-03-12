/**
 * AuthContext — user state, login, logout, updateUser.
 */

import { User } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEYS = {
  USER: '@cricket_drs_user',
  IS_LOGGED_IN: '@cricket_drs_logged_in',
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedLoggedIn] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
        ]);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedLoggedIn) setIsLoggedIn(JSON.parse(storedLoggedIn));
      } catch (e) {
        console.log('Error loading auth data:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string, name?: string) => {
    const newUser: User = { id: Date.now().toString(), name: name || email.split('@')[0], email };
    setUser(newUser);
    setIsLoggedIn(true);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true)),
    ]);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsLoggedIn(false);
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(false)),
    ]);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  }, [user]);

  return { user, isLoggedIn, isLoading, login, logout, updateUser };
});
