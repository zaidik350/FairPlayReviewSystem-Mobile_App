/**
 * AppContext — thin composition wrapper.
 *
 * Nests AuthProvider, MatchProvider, ReviewProvider, NotificationProvider
 * and re-exports a single `useApp()` hook with the EXACT same return shape
 * so that zero screen files need updating.
 *
 * For new code, prefer importing the domain-specific hooks directly:
 *   import { useAuth } from '@/context/AuthContext';
 *   import { useMatchContext } from '@/context/MatchContext';
 *   import { useReviewContext } from '@/context/ReviewContext';
 *   import { useNotificationContext } from '@/context/NotificationContext';
 */

import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { MatchProvider, useMatchContext } from './MatchContext';
import { NotificationProvider, useNotificationContext } from './NotificationContext';
import { ReviewProvider, useReviewContext } from './ReviewContext';

/* ── Combined Provider ── */

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MatchProvider>
        <ReviewProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ReviewProvider>
      </MatchProvider>
    </AuthProvider>
  );
}

/* ── Combined hook (backward-compatible) ── */

export function useApp() {
  const auth = useAuth();
  const match = useMatchContext();
  const review = useReviewContext();
  const notification = useNotificationContext();

  return {
    // Auth
    user: auth.user,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    updateUser: auth.updateUser,
    // Matches
    matches: match.matches,
    addMatch: match.addMatch,
    updateMatch: match.updateMatch,
    getMatchById: match.getMatchById,
    getLiveMatches: match.getLiveMatches,
    getUpcomingMatches: match.getUpcomingMatches,
    getCompletedMatches: match.getCompletedMatches,
    // Reviews
    reviews: review.reviews,
    addReview: review.addReview,
    getReviewById: review.getReviewById,
    getReviewsByMatch: review.getReviewsByMatch,
    getAccuracy: review.getAccuracy,
    // Notifications
    notifications: notification.notifications,
    updateNotifications: notification.updateNotifications,
  };
}
