/**
 * Review Service — CRUD + DRS analysis.
 * Falls back to AsyncStorage mock when USE_REAL_API is false.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { DecisionType, ImpactType, PitchType, Review, WicketsType } from '@/types';
import type { AnalyzeVideoResponse, ApiReview, CreateReviewRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Map backend ApiReview (snake_case, int ids) → frontend Review (camelCase, string id) */
function toReview(api: ApiReview): Review {
  return {
    id: String(api.id),
    matchId: String(api.match_id),
    matchName: api.match_name,
    over: api.over,
    originalDecision: api.original_decision as Review['originalDecision'],
    decision: api.decision as Review['decision'],
    impact: api.impact as Review['impact'],
    pitch: api.pitch as Review['pitch'],
    wickets: api.wickets as Review['wickets'],
    videoUri: api.video_uri ?? '',
    timestamp: api.created_at ?? new Date().toISOString(),
  };
}

/** Convert frontend Review fields → backend CreateReviewRequest body */
function toCreateBody(data: {
  matchId: string;
  matchName: string;
  over: string;
  originalDecision: string;
  decision: string;
  impact: string;
  pitch: string;
  wickets: string;
  videoUri?: string;
}): CreateReviewRequest {
  return {
    match_id: Number(data.matchId),
    match_name: data.matchName,
    over: data.over,
    original_decision: data.originalDecision,
    decision: data.decision,
    impact: data.impact,
    pitch: data.pitch,
    wickets: data.wickets,
    video_uri: data.videoUri,
  };
}

class ReviewService {
  /* ── Read ── */

  async getAll(): Promise<Review[]> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<ApiReview[]>(API_ENDPOINTS.REVIEWS.LIST);
      return res.data.map(toReview);
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
    return json ? JSON.parse(json) : [];
  }

  async getByMatch(matchId: string): Promise<Review[]> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<ApiReview[]>(API_ENDPOINTS.REVIEWS.BY_MATCH(matchId));
      return res.data.map(toReview);
    }
    const all = await this.getAll();
    return all.filter(r => r.matchId === matchId);
  }

  /* ── Create ── */

  async create(data: Parameters<typeof toCreateBody>[0]): Promise<Review> {
    if (API_CONFIG.USE_REAL_API) {
      const body = toCreateBody(data);
      const res = await apiClient.post<ApiReview>(API_ENDPOINTS.REVIEWS.CREATE, body);
      return toReview(res.data);
    }
    const newReview: Review = {
      id: Date.now().toString(),
      matchId: data.matchId,
      matchName: data.matchName,
      over: data.over,
      originalDecision: data.originalDecision as Review['originalDecision'],
      decision: data.decision as Review['decision'],
      impact: data.impact as Review['impact'],
      pitch: data.pitch as Review['pitch'],
      wickets: data.wickets as Review['wickets'],
      videoUri: data.videoUri || 'mock-video.mp4',
      timestamp: new Date().toISOString(),
    };
    const all = await this.getAll();
    all.unshift(newReview);
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    return newReview;
  }

  /* ── Analyze delivery video with AI/ML backend ── */

  async analyzeVideo(videoUri: string, matchId: string, originalDecision: DecisionType): Promise<AnalyzeVideoResponse> {
    if (API_CONFIG.USE_REAL_API) {
      const formData = new FormData();
      formData.append('video_file', { uri: videoUri, type: 'video/mp4', name: 'delivery.mp4' } as unknown as Blob);
      formData.append('original_decision', originalDecision);

      const endpoint = `${API_ENDPOINTS.DETECTION.ANALYZE_VIDEO}?match_id=${encodeURIComponent(matchId)}`;
      const res = await apiClient.upload<AnalyzeVideoResponse>(endpoint, formData);
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
