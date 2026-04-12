/**
 * API request / response type definitions.
 * Keep these in sync with the FastAPI backend DTOs.
 */

import type { DecisionType, ImpactType, PitchType, WicketsType } from "./index";

/* ── Generic wrapper — matches backend response_formatter ── */

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export interface ApiError {
  status: "error";
  data: null;
  message: string;
}

/* ── Auth ── */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

/** Backend returns user + token on both login and signup */
export interface AuthResponseData {
  user: {
    id: number | string;
    name?: string;
    fname?: string;
    lname?: string;
    email: string;
    avatar: string | null;
  };
  access_token: string;
  token_type: string;
}

export interface ChangePasswordRequest {
  email: string;
  old_password: string;
  new_password: string;
}

/* ── User / Profile ── */

export interface UpdateProfileRequest {
  fname?: string;
  lname?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

/* ── Matches (snake_case from backend) ── */

export interface ApiMatch {
  id: number;
  user_id?: number;
  name: string;
  teams: string;
  venue: string;
  date: string;
  status: string;
  pitch_configured?: boolean;
  config_flag?: boolean;
  pitch_image_uri?: string;
  pitch_image?: string;
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

export interface WicketDetection {
  label: string;
  box: number[];
  conf: number;
}

export interface WicketConfigResponse {
  match_id: number;
  user_id: number;
  configured: boolean;
  near_box: number[] | null;
  far_box: number[] | null;
  updated_at: string | null;
}

export interface AutoWicketConfigResponse extends WicketConfigResponse {
  raw_detections?: WicketDetection[];
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
  match_id?: number;
  user_id?: number;
  status?: string;
  processing_time_ms?: number;
  frame_count?: number;
  output_video_path?: string;
  frames_dir?: string;
  metadata_path?: string;
  summary_stats?: {
    total_frames?: number;
    frames_with_ball?: number;
    frames_with_batsman?: number;
    frames_with_wicket?: number;
    frames_with_pose?: number;
    tracking_active_frames?: number;
  };
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
