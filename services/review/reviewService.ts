/**
 * Review Service — CRUD + DRS analysis.
 * Falls back to AsyncStorage mock when USE_REAL_API is false.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { DecisionType, ImpactType, PitchType, Review, WicketsType } from '@/types';
import type { AnalyzeVideoResponse, CreateReviewRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ReviewService {
  /* ── Read ── */

  async getAll(): Promise<Review[]> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<Review[]>(API_ENDPOINTS.REVIEWS.LIST);
      return res.data;
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
    return json ? JSON.parse(json) : [];
  }

  /* ── Create ── */

  async create(data: CreateReviewRequest): Promise<Review> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.post<Review>(API_ENDPOINTS.REVIEWS.CREATE, data);
      return res.data;
    }
    const newReview: Review = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      videoUri: data.videoUri || 'mock-video.mp4',
    };
    const all = await this.getAll();
    all.unshift(newReview);
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    return newReview;
  }

  /* ── Analyze delivery video with AI/ML backend ── */

  async analyzeVideo(videoUri: string, matchId: string, originalDecision: DecisionType): Promise<AnalyzeVideoResponse> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.post<AnalyzeVideoResponse>(API_ENDPOINTS.REVIEWS.ANALYZE, {
        videoUri,
        matchId,
        originalDecision,
      });
      return res.data;
    }
    // Mock — simulate 2.5 s analysis then random result
    await new Promise(r => setTimeout(r, 2500));
    const impacts: ImpactType[] = ['In-line', 'Outside'];
    const pitches: PitchType[] = ['In-line', 'Outside'];
    const wicketsOpts: WicketsType[] = ['Hitting', 'Missing'];
    const impact = impacts[Math.floor(Math.random() * 2)];
    const pitch = pitches[Math.floor(Math.random() * 2)];
    const wickets = wicketsOpts[Math.floor(Math.random() * 2)];
    const isOut = impact === 'In-line' && pitch === 'In-line' && wickets === 'Hitting';
    return { impact, pitch, wickets, decision: isOut ? 'OUT' : 'NOT OUT', confidence: Math.random() * 0.2 + 0.8 };
  }
}

export const reviewService = new ReviewService();
export default reviewService;
