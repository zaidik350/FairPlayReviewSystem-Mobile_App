/**
 * AuthContext — user state, login, signup, logout, updateUser.
 * Delegates to authService / userService which handle mock vs real API.
 */

import { authService } from '@/services/auth/authService';
import { userService } from '@/services/user/userService';
import { User } from '@/types';
import { UpdateProfileRequest } from '@/types/api.types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await authService.getCurrentUser();
        const authenticated = await authService.isAuthenticated();
        if (storedUser) setUser(storedUser);
        setIsLoggedIn(authenticated);
      } catch (e) {
        console.log('Error loading auth data:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await authService.login({ email, password });
    setUser(u);
    setIsLoggedIn(true);
  }, []);

  const signup = useCallback(async (fname: string, lname: string ,email: string, password: string) => {
    const { user: u } = await authService.signup({ fname, lname, email, password });
    setUser(u);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateUser = useCallback(async (updates: UpdateProfileRequest) => {
    const updated = await userService.updateProfile(updates);
    setUser(updated);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!user?.email) throw new Error('Unable to change password: user email is missing.');
    await authService.changePassword({
      email: user.email,
      old_password: oldPassword,
      new_password: newPassword,
    });
  }, [user?.email]);

  return { user, isLoggedIn, isLoading, login, signup, logout, updateUser, changePassword };
});
