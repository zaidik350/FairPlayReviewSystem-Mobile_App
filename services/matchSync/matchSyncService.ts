import supabaseClient from "@/config/supabase";
import type {
    MatchCommandPayloadMap,
    MatchCommandRow,
    MatchCommandType,
    MatchLiveState,
    ReviewRealtimeRow,
} from "@/services/matchSync/types";

const LIVE_STATE_TABLE = "match_live_state";
const COMMANDS_TABLE = "match_commands";
const REVIEWS_TABLE = "reviews";

function toDbId(value: string | number) {
  if (typeof value === "number") return value;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : value;
}

function asRecord<T extends object>(value: T | null) {
  return value as Record<string, unknown> | null;
}

export const matchSyncService = {
  async ensureLiveState(matchId: string, userId: string) {
    const dbMatchId = toDbId(matchId);
    const dbUserId = toDbId(userId);

    const { data: existing, error: fetchError } = await supabaseClient
      .from(LIVE_STATE_TABLE)
      .select("*")
      .eq("match_id", dbMatchId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existing) return existing as MatchLiveState;

    const seed = {
      match_id: dbMatchId,
      user_id: dbUserId,
      is_recording: false,
      clip_status: "idle",
      over_number: 0,
      legal_balls_this_over: 0,
      total_legal_balls: 0,
    };

    const { data, error } = await supabaseClient
      .from(LIVE_STATE_TABLE)
      .upsert(seed, { onConflict: "match_id" })
      .select("*")
      .single();

    if (error) throw error;
    return data as MatchLiveState;
  },

  async assignRole(
    matchId: string,
    role: "camera" | "umpire",
    deviceId: string,
  ) {
    const dbMatchId = toDbId(matchId);
    const payload =
      role === "camera"
        ? {
            controlled_by_device_id: deviceId,
            camera_last_seen_at: new Date().toISOString(),
          }
        : {
            umpire_device_id: deviceId,
            umpire_last_seen_at: new Date().toISOString(),
          };

    const { error } = await supabaseClient
      .from(LIVE_STATE_TABLE)
      .update(payload)
      .eq("match_id", dbMatchId);

    if (error) throw error;
  },

  async heartbeat(matchId: string, role: "camera" | "umpire") {
    const dbMatchId = toDbId(matchId);
    const nowIso = new Date().toISOString();
    const payload =
      role === "camera"
        ? { camera_last_seen_at: nowIso }
        : { umpire_last_seen_at: nowIso };

    const { error } = await supabaseClient
      .from(LIVE_STATE_TABLE)
      .update(payload)
      .eq("match_id", dbMatchId);
    if (error) throw error;
  },

  async publishCommand<T extends MatchCommandType>(args: {
    matchId: string;
    userId: string;
    deviceId: string;
    type: T;
    payload: MatchCommandPayloadMap[T];
  }) {
    const row = {
      match_id: toDbId(args.matchId),
      user_id: toDbId(args.userId),
      device_id: args.deviceId,
      type: args.type,
      payload: asRecord(args.payload as object | null),
    };

    const { data, error } = await supabaseClient
      .from(COMMANDS_TABLE)
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data as MatchCommandRow;
  },

  async updateLiveState(matchId: string, patch: Partial<MatchLiveState>) {
    const dbMatchId = toDbId(matchId);
    const { data, error } = await supabaseClient
      .from(LIVE_STATE_TABLE)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("match_id", dbMatchId)
      .select("*")
      .single();

    if (error) throw error;
    return data as MatchLiveState;
  },

  subscribeLiveState(
    matchId: string,
    onState: (state: MatchLiveState) => void,
  ) {
    const dbMatchId = toDbId(matchId);
    const channel = supabaseClient
      .channel(`live-state-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: LIVE_STATE_TABLE,
          filter: `match_id=eq.${dbMatchId}`,
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | MatchLiveState
            | undefined;
          if (row) onState(row);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  },

  subscribeCommands(
    matchId: string,
    onCommand: (command: MatchCommandRow) => void,
  ) {
    const dbMatchId = toDbId(matchId);
    const channel = supabaseClient
      .channel(`commands-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: COMMANDS_TABLE,
          filter: `match_id=eq.${dbMatchId}`,
        },
        (payload) => {
          if (!payload.new) return;
          onCommand(payload.new as MatchCommandRow);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  },

  async getLatestReviewForMatch(matchId: string) {
    const dbMatchId = toDbId(matchId);
    const { data, error } = await supabaseClient
      .from(REVIEWS_TABLE)
      .select(
        "id,match_id,over,original_decision,decision,impact,pitch,wickets,created_at",
      )
      .eq("match_id", dbMatchId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return (data as ReviewRealtimeRow | null) ?? null;
  },

  subscribeLatestReview(
    matchId: string,
    onReview: (review: ReviewRealtimeRow) => void,
  ) {
    const dbMatchId = toDbId(matchId);
    const channel = supabaseClient
      .channel(`reviews-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: REVIEWS_TABLE,
          filter: `match_id=eq.${dbMatchId}`,
        },
        (payload) => {
          if (!payload.new) return;
          onReview(payload.new as ReviewRealtimeRow);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  },
};

export default matchSyncService;
