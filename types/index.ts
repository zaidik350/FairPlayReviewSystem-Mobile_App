export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
}

export interface NotificationSettings {
  matchAlerts: boolean;
  reviewUpdates: boolean;
  systemNotifications: boolean;
}

export interface Match {
  id: string;
  name: string;
  teams: string;
  venue: string;
  date: string;
  status: "upcoming" | "live" | "completed";
  pitchConfigured?: boolean;
  pitchImageUri?: string;
}

export interface Review {
  id: string;
  matchId: string;
  matchName: string;
  over: string;
  originalDecision: "OUT" | "NOT OUT";
  decision: "OUT" | "NOT OUT";
  impact: "In-line" | "Outside";
  pitch: "In-line" | "Outside";
  wickets: "Hitting" | "Missing";
  videoUri: string;
  timestamp: string;
}

export type DecisionType = "OUT" | "NOT OUT";
export type ImpactType = "In-line" | "Outside";
export type PitchType = "In-line" | "Outside";
export type WicketsType = "Hitting" | "Missing";
