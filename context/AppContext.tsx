import { Match, NotificationSettings, Review, User } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEYS = {
  USER: '@cricket_drs_user',
  MATCHES: '@cricket_drs_matches',
  REVIEWS: '@cricket_drs_reviews',
  IS_LOGGED_IN: '@cricket_drs_logged_in',
  NOTIFICATIONS: '@cricket_drs_notifications',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  matchAlerts: true,
  reviewUpdates: true,
  systemNotifications: false,
};

const DEFAULT_MATCHES: Match[] = [
  {
    id: '1',
    name: 'IPL 2024 - Match 1',
    teams: 'Mumbai Indians vs Chennai Super Kings',
    venue: 'Wankhede Stadium, Mumbai',
    date: 'Feb 10, 2026',
    status: 'live',
  },
  {
    id: '2',
    name: 'IPL 2024 - Match 2',
    teams: 'Royal Challengers vs Delhi Capitals',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    date: 'Feb 12, 2026',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'IPL 2024 - Qualifier',
    teams: 'Gujarat Titans vs Rajasthan Royals',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    date: 'Feb 8, 2026',
    status: 'completed',
  },
];

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>(DEFAULT_MATCHES);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedUser, storedMatches, storedReviews, storedLoggedIn, storedNotifications] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.MATCHES),
        AsyncStorage.getItem(STORAGE_KEYS.REVIEWS),
        AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
      ]);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedMatches) setMatches(JSON.parse(storedMatches));
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      if (storedLoggedIn) setIsLoggedIn(JSON.parse(storedLoggedIn));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string, name?: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: name || email.split('@')[0],
      email,
    };
    
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
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, [user]);

  const updateNotifications = useCallback(async (updates: Partial<NotificationSettings>) => {
    const updatedNotifications = { ...notifications, ...updates };
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
  }, [notifications]);

  const getAccuracy = useCallback(() => {
    if (reviews.length === 0) return 0;
    const correctDecisions = reviews.filter(r => r.originalDecision === r.decision).length;
    return Math.round((correctDecisions / reviews.length) * 100);
  }, [reviews]);

  const addMatch = useCallback(async (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: Date.now().toString(),
    };
    
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updatedMatches));
    
    return newMatch;
  }, [matches]);

  const updateMatch = useCallback(async (id: string, updates: Partial<Match>) => {
    const updatedMatches = matches.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    setMatches(updatedMatches);
    await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updatedMatches));
  }, [matches]);

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'timestamp'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));
    
    return newReview;
  }, [reviews]);

  const getMatchById = useCallback((id: string) => {
    return matches.find(m => m.id === id);
  }, [matches]);

  const getReviewById = useCallback((id: string) => {
    return reviews.find(r => r.id === id);
  }, [reviews]);

  const getReviewsByMatch = useCallback((matchId: string) => {
    return reviews.filter(r => r.matchId === matchId);
  }, [reviews]);

  const getLiveMatches = useCallback(() => {
    return matches.filter(m => m.status === 'live');
  }, [matches]);

  const getUpcomingMatches = useCallback(() => {
    return matches.filter(m => m.status === 'upcoming');
  }, [matches]);

  const getCompletedMatches = useCallback(() => {
    return matches.filter(m => m.status === 'completed');
  }, [matches]);

  return {
    user,
    matches,
    reviews,
    isLoggedIn,
    isLoading,
    notifications,
    login,
    logout,
    updateUser,
    updateNotifications,
    getAccuracy,
    addMatch,
    updateMatch,
    addReview,
    getMatchById,
    getReviewById,
    getReviewsByMatch,
    getLiveMatches,
    getUpcomingMatches,
    getCompletedMatches,
  };
});
