/**
 * ReviewContext — review list state, CRUD, accuracy calculation.
 * Delegates to reviewService which handles mock vs real API.
 */

import { useAuth } from '@/context/AuthContext';
import { reviewService } from '@/services/review/reviewService';
import { Review } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

export const [ReviewProvider, useReviewContext] = createContextHook(() => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isLoggedIn, isLoading } = useAuth();

  /* Load reviews only for authenticated user */
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      setReviews([]);
      return;
    }

    (async () => {
      try {
        const data = await reviewService.getAll();
        setReviews(data);
      } catch (e) {
        console.log('Error loading reviews:', e);
      }
    })();
  }, [isLoggedIn, isLoading]);

  const refreshReviews = useCallback(async () => {
    const data = await reviewService.getAll();
    setReviews(data);
  }, []);

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'timestamp'>) => {
    const created = await reviewService.create(review);
    setReviews(prev => [created, ...prev]);
    return created;
  }, []);

  const getReviewById = useCallback((id: string) => reviews.find(r => r.id === id), [reviews]);
  const getReviewsByMatch = useCallback((matchId: string) => reviews.filter(r => r.matchId === matchId), [reviews]);

  const getAccuracy = useCallback(() => {
    if (reviews.length === 0) return 0;
    const correct = reviews.filter(r => r.originalDecision === r.decision).length;
    return Math.round((correct / reviews.length) * 100);
  }, [reviews]);

  return { reviews, addReview, refreshReviews, getReviewById, getReviewsByMatch, getAccuracy };
});
