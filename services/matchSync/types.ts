export type DeliveryType = "LEGAL" | "WIDE" | "NO_BALL";
export type OriginalDecision = "OUT" | "NOT OUT";

export type MatchCommandType =
  | "START_RECORDING"
  | "END_DELIVERY"
  | "REQUEST_REVIEW"
  | "DISCARD_LAST_CLIP"
  | "UNDO_LAST_ACTION";

export type ClipStatus =
  | "idle"
  | "recording"
  | "pending_decision"
  | "discarded"
  | "reviewing"
  | "done"
  | "error";

export interface MatchCommandPayloadMap {
  START_RECORDING: null;
  END_DELIVERY: null;
  REQUEST_REVIEW: { originalDecision: OriginalDecision };
  DISCARD_LAST_CLIP: null;
  UNDO_LAST_ACTION: null;
}

export interface MatchCommandRow {
  id: number;
  match_id: number;
  user_id: number;
  device_id: string | null;
  type: MatchCommandType;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface MatchLiveState {
  match_id: number;
  user_id: number;
  controlled_by_device_id: string | null;
  umpire_device_id: string | null;
  camera_last_seen_at: string | null;
  umpire_last_seen_at: string | null;
  is_recording: boolean;
  recording_started_at: string | null;
  recording_time_sec: number | null;
  clip_status: ClipStatus;
  last_delivery_type: DeliveryType | null;
  over_number: number;
  legal_balls_this_over: number;
  total_legal_balls: number;
  pending_clip_id: string | null;
  last_review_original_decision: OriginalDecision | null;
  last_review_decision: OriginalDecision | null;
  last_error: string | null;
  updated_at: string;
}

export interface ReviewRealtimeRow {
  id: number;
  match_id: number;
  over: string | null;
  original_decision: OriginalDecision | null;
  decision: OriginalDecision | null;
  impact: string | null;
  pitch: string | null;
  wickets: string | null;
  created_at: string | null;
}

export interface CricketCounter {
  overNumber: number;
  legalBallsThisOver: number;
  totalLegalBalls: number;
}
