/**
 * API request / response type definitions.
 * Keep these in sync with your backend DTOs.
 */

import type { DecisionType, ImpactType, Match, PitchType, User, WicketsType } from './index';

/* ── Generic wrappers ── */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string; details?: unknown };
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/* ── User ── */

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

/* ── Matches ── */

export interface CreateMatchRequest {
  name: string;
  teams: string;
  venue: string;
  date: string;
  status?: Match['status'];
}

export interface UpdateMatchRequest {
  name?: string;
  teams?: string;
  venue?: string;
  date?: string;
  status?: Match['status'];
}

/* ── Reviews ── */

export interface CreateReviewRequest {
  matchId: string;
  matchName: string;
  over: string;
  originalDecision: DecisionType;
  decision: DecisionType;
  impact: ImpactType;
  pitch: PitchType;
  wickets: WicketsType;
  videoUri?: string;
}

export interface AnalyzeVideoResponse {
  impact: ImpactType;
  pitch: PitchType;
  wickets: WicketsType;
  decision: DecisionType;
  confidence: number;
}
