/**
 * ReviewContext — review list state, CRUD, accuracy calculation.
 */

import { Review } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@cricket_drs_reviews';

export const [ReviewProvider, useReviewContext] = createContextHook(() => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setReviews(JSON.parse(json));
      } catch (e) {
        console.log('Error loading reviews:', e);
      }
    })();
  }, []);

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'timestamp'>) => {
    const newReview: Review = { ...review, id: Date.now().toString(), timestamp: new Date().toISOString() };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newReview;
  }, [reviews]);

  const getReviewById = useCallback((id: string) => reviews.find(r => r.id === id), [reviews]);
  const getReviewsByMatch = useCallback((matchId: string) => reviews.filter(r => r.matchId === matchId), [reviews]);

  const getAccuracy = useCallback(() => {
    if (reviews.length === 0) return 0;
    const correct = reviews.filter(r => r.originalDecision === r.decision).length;
    return Math.round((correct / reviews.length) * 100);
  }, [reviews]);

  return { reviews, addReview, getReviewById, getReviewsByMatch, getAccuracy };
});
