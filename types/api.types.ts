/**
 * API request / response type definitions.
 * Keep these in sync with the FastAPI backend DTOs.
 */

import type { DecisionType, ImpactType, PitchType, WicketsType } from './index';

/* ── Generic wrapper — matches backend response_formatter ── */

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface ApiError {
  status: 'error';
  data: null;
  message: string;
}

/* ── Auth ── */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/** Backend returns user + token on both login and signup */
export interface AuthResponseData {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  access_token: string;
  token_type: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

/* ── User / Profile ── */

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

/* ── Matches (snake_case from backend) ── */

export interface ApiMatch {
  id: number;
  name: string;
  teams: string;
  venue: string;
  date: string;
  status: string;
  created_at?: string;
}

export interface CreateMatchRequest {
  name: string;
  teams: string;
  venue: string;
  date: string;
  status?: string;
}

export interface UpdateMatchRequest {
  name?: string;
  teams?: string;
  venue?: string;
  date?: string;
  status?: string;
}

/* ── Reviews (snake_case from backend) ── */

export interface ApiReview {
  id: number;
  match_id: number;
  match_name: string;
  user_id?: number;
  over: string;
  original_decision: string;
  decision: string;
  impact: string;
  pitch: string;
  wickets: string;
  video_uri?: string;
  created_at?: string;
}

export interface CreateReviewRequest {
  match_id: number;
  match_name: string;
  user_id?: number;
  over: string;
  original_decision: string;
  decision: string;
  impact: string;
  pitch: string;
  wickets: string;
  video_uri?: string;
}

/* ── Detection / DRS Analysis ── */

export interface AnalyzeVideoResponse {
  impact: ImpactType;
  pitch: PitchType;
  wickets: WicketsType;
  decision: DecisionType;
  confidence: number;
}

/* ── Notification Settings (snake_case from backend) ── */

export interface ApiNotificationSettings {
  id?: number;
  user_id: number;
  match_alerts: boolean;
  review_updates: boolean;
  system_notifications: boolean;
}
