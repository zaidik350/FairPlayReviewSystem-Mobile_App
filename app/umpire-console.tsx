import Button from "@/components/Button";
import Card from "@/components/Card";
import ReviewPromptModal from "@/components/camera/ReviewPromptModal";
import ReviewCard from "@/components/ReviewCard";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { UmpireConsoleSkeleton } from "@/components/skeleton/ScreenSkeletons";
import AppColors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useMatchContext } from "@/context/MatchContext";
import { useReviewContext } from "@/context/ReviewContext";
import { getOrCreateDeviceId } from "@/services/matchSync/deviceIdentity";
import { matchSyncService } from "@/services/matchSync/matchSyncService";
import type {
    MatchCommandType,
    MatchLiveState,
    OriginalDecision,
    ReviewRealtimeRow,
} from "@/services/matchSync/types";
import type { Review } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

function isOnline(lastSeenAt: string | null) {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() <= 20000;
}

function reviewRowToReview(
  row: ReviewRealtimeRow,
  matchId: string,
  fallbackMatchName: string,
): Review {
  return {
    id: String(row.id),
    matchId,
    matchName: (row.match_name?.trim() || fallbackMatchName) as string,
    over: row.over ?? "",
    originalDecision: (row.original_decision ?? "NOT OUT") as Review["originalDecision"],
    decision: (row.decision ?? "NOT OUT") as Review["decision"],
    impact: (row.impact as Review["impact"]) ?? "In-line",
    pitch: (row.pitch as Review["pitch"]) ?? "In-line",
    wickets: (row.wickets as Review["wickets"]) ?? "Missing",
    videoUri: row.video_uri ?? "",
    timestamp: row.created_at ?? new Date().toISOString(),
  };
}

export default function UmpireConsoleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getMatchById, isLoadingMatches } = useMatchContext();
  const { refreshReviews } = useReviewContext();

  const [deviceId, setDeviceId] = React.useState("");
  const [liveState, setLiveState] = React.useState<MatchLiveState | null>(null);
  const [latestReview, setLatestReview] =
    React.useState<ReviewRealtimeRow | null>(null);
  const [sending, setSending] = React.useState(false);
  const [syncError, setSyncError] = React.useState("");
  const [optimisticIsRecording, setOptimisticIsRecording] = React.useState<
    boolean | null
  >(null);
  const [commandLock, setCommandLock] = React.useState<MatchCommandType | null>(
    null,
  );
  const [reviewRequested, setReviewRequested] = React.useState(false);
  const optimisticIsRecordingRef = React.useRef<boolean | null>(null);

  const recentCommandsRef = React.useRef<Map<string, number>>(new Map());
  const match = getMatchById(id || "");

  React.useEffect(() => {
    optimisticIsRecordingRef.current = optimisticIsRecording;
  }, [optimisticIsRecording]);

  const liveIsRecording = liveState?.is_recording ?? false;
  const effectiveIsRecording = optimisticIsRecording ?? liveIsRecording;

  const getStartDisabledReason = React.useCallback(() => {
    if (!liveState) return "Live state not loaded yet.";
    if (sending) return "A previous command is still being sent.";
    if (commandLock === "START_RECORDING")
      return "Start command sent. Waiting for sync...";
    if (effectiveIsRecording)
      return "Camera is already recording. Use End Recording.";
    if (liveState.clip_status === "recording")
      return "Clip status is recording (already started).";
    if (liveState.clip_status === "reviewing")
      return "Review analysis is in progress.";
    if (liveState.clip_status === "pending_decision")
      return "Pending decision modal is active.";
    return "Ready";
  }, [commandLock, effectiveIsRecording, liveState, sending]);

  const getEndDisabledReason = React.useCallback(() => {
    if (!liveState) return "Live state not loaded yet.";
    if (sending) return "A previous command is still being sent.";
    if (commandLock === "END_DELIVERY")
      return "End command sent. Waiting for sync...";
    if (!effectiveIsRecording) return "Recording has not started yet.";
    return "Ready";
  }, [commandLock, effectiveIsRecording, liveState, sending]);

  React.useEffect(() => {
    if (!id || !user?.id) return;

    let unsub = () => {};
    let reviewUnsub = () => {};
    let hb: ReturnType<typeof setInterval> | null = null;

    (async () => {
      try {
        const did = await getOrCreateDeviceId();
        setDeviceId(did);

        const state = await matchSyncService.ensureLiveState(id, user.id);
        setLiveState(state);
        await matchSyncService.assignRole(id, "umpire", did);

        const review = await matchSyncService.getLatestReviewForMatch(id);
        setLatestReview(review);

        unsub = matchSyncService.subscribeLiveState(id, (stateUpdate) => {
          setLiveState(stateUpdate);

          if (
            optimisticIsRecordingRef.current !== null &&
            stateUpdate.is_recording === optimisticIsRecordingRef.current
          ) {
            setOptimisticIsRecording(null);
            setCommandLock(null);
          }

          if (
            !stateUpdate.is_recording &&
            stateUpdate.clip_status === "pending_decision"
          ) {
            setOptimisticIsRecording(null);
            setCommandLock(null);
          }
        });
        reviewUnsub = matchSyncService.subscribeLatestReview(
          id,
          setLatestReview,
        );
        hb = setInterval(() => {
          matchSyncService.heartbeat(id, "umpire").catch((error) => {
            console.error("[UmpireConsole][heartbeat] failed", error);
          });
        }, 7000);
      } catch (error: any) {
        console.error("[UmpireConsole][init] failed", error);
        setSyncError(
          error?.message || "Failed to connect Umpire Console realtime sync.",
        );
      }
    })();

    return () => {
      unsub();
      reviewUnsub();
      if (hb) clearInterval(hb);
    };
  }, [id, user?.id]);

  const publishCommand = React.useCallback(
    async (
      type: MatchCommandType,
      payload: Record<string, unknown> | null = null,
    ) => {
      if (!id || !user?.id || !deviceId) return;
      if (commandLock === type) {
        return false;
      }

      const dedupeKey = `${type}:${JSON.stringify(payload ?? {})}`;
      const now = Date.now();
      const previousAt = recentCommandsRef.current.get(dedupeKey) ?? 0;
      if (now - previousAt < 650) {
        return false;
      }

      recentCommandsRef.current.set(dedupeKey, now);

      try {
        setSending(true);
        await matchSyncService.publishCommand({
          matchId: id,
          userId: user.id,
          deviceId,
          type,
          payload: payload as never,
        });
        setSyncError("");
        return true;
      } catch (error: any) {
        console.error("[UmpireConsole][publishCommand] failed", error);
        setSyncError(error?.message || "Failed to send command.");
        return false;
      } finally {
        setSending(false);
      }
    },
    [commandLock, deviceId, id, user?.id],
  );

  const handleStart = React.useCallback(async () => {
    if (!liveState) return;
    if (sending) return;
    if (effectiveIsRecording) return;
    if (
      liveState.clip_status === "recording" ||
      liveState.clip_status === "reviewing" ||
      liveState.clip_status === "pending_decision"
    ) {
      return;
    }

    setOptimisticIsRecording(true);
    setCommandLock("START_RECORDING");
    const ok = await publishCommand("START_RECORDING");
    if (!ok) {
      setOptimisticIsRecording(null);
      setCommandLock(null);
    }
  }, [effectiveIsRecording, liveState, publishCommand, sending]);

  const handleEndRecording = React.useCallback(async () => {
    if (!liveState) return;
    if (sending) return;
    if (!effectiveIsRecording) return;

    setOptimisticIsRecording(false);
    setCommandLock("END_DELIVERY");
    const ok = await publishCommand("END_DELIVERY");
    if (!ok) {
      setOptimisticIsRecording(null);
      setCommandLock(null);
    }
  }, [effectiveIsRecording, liveState, publishCommand, sending]);

  const handleDecision = async (originalDecision: OriginalDecision) => {
    if (liveState?.clip_status !== "pending_decision") return;
    setReviewRequested(true);
    const ok = await publishCommand("REQUEST_REVIEW", { originalDecision });
    if (!ok) {
      setReviewRequested(false);
    }
  };

  const handleDiscard = () => {
    if (
      liveState?.clip_status !== "pending_decision" &&
      liveState?.clip_status !== "error"
    )
      return;
    void publishCommand("DISCARD_LAST_CLIP");
  };

  const cameraOnline = isOnline(liveState?.camera_last_seen_at ?? null);
  const canStart =
    !!liveState &&
    !sending &&
    !effectiveIsRecording &&
    commandLock !== "START_RECORDING" &&
    liveState.clip_status !== "reviewing" &&
    liveState.clip_status !== "pending_decision" &&
    liveState.clip_status !== "recording";
  const canEnd =
    !!liveState &&
    !sending &&
    effectiveIsRecording &&
    commandLock !== "END_DELIVERY";
  const showReviewPrompt = liveState?.clip_status === "pending_decision";
  const showReviewLoading =
    reviewRequested || liveState?.clip_status === "reviewing";

  React.useEffect(() => {
    if (!latestReview?.id) return;
    void refreshReviews();
  }, [latestReview?.id, refreshReviews]);

  React.useEffect(() => {
    if (!liveState) return;
    if (
      liveState.clip_status === "done" ||
      liveState.clip_status === "error" ||
      liveState.clip_status === "idle"
    ) {
      setReviewRequested(false);
    }
  }, [liveState]);

  return (
    <>
      <Stack.Screen options={{ title: "Umpire Console" }} />
      {isLoadingMatches ? (
        <ScreenContainer contentStyle={styles.content}>
          <UmpireConsoleSkeleton />
        </ScreenContainer>
      ) : !match ? (
        <ScreenContainer contentStyle={styles.center}>
          <Text style={styles.error}>Match not found.</Text>
          <Button
            title="Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </ScreenContainer>
      ) : (
        <ScreenContainer contentStyle={styles.content}>
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.title}>{match.name}</Text>
            <Text style={styles.subtle}>{match.teams}</Text>
            <View style={styles.topRow}>
              <Text
                style={[
                  styles.connection,
                  cameraOnline ? styles.online : styles.offline,
                ]}
              >
                {cameraOnline ? "Camera Online" : "Camera Offline"}
              </Text>
            </View>
            <Text style={styles.subtle}>
              State: {liveState?.clip_status ?? "idle"} | Device:{" "}
              {deviceId.slice(0, 8)}...
            </Text>
            {syncError ? <Text style={styles.error}>{syncError}</Text> : null}
            {liveState?.last_error ? (
              <Text style={styles.error}>{liveState.last_error}</Text>
            ) : null}
          </Card>

          <Card variant="glass" style={styles.controlsCard}>
            <Button
              title="Start Recording"
              onPress={() => {
                void handleStart();
              }}
              disabled={!canStart || sending}
            />

            <Button
              title="End Recording"
              onPress={() => {
                void handleEndRecording();
              }}
              disabled={!canEnd || sending}
              variant="secondary"
            />
            <Text style={styles.helperText}>
              Start status: {getStartDisabledReason()}
            </Text>
            <Text style={styles.helperText}>
              End status: {getEndDisabledReason()}
            </Text>
          </Card>

          <View style={styles.reviewSection}>
            <Text style={styles.resultTitle}>Latest Review</Text>
            {latestReview ? (
              <ReviewCard
                review={reviewRowToReview(
                  latestReview,
                  String(match.id),
                  match.name,
                )}
                showMediaPreview
                onPress={async () => {
                  await refreshReviews();
                  router.push(`/review-detail?id=${latestReview.id}`);
                }}
              />
            ) : (
              <Text style={styles.resultLine}>No completed review yet.</Text>
            )}
          </View>

          <Button
            title="Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </ScreenContainer>
      )}

      <ReviewPromptModal
        visible={showReviewPrompt && !reviewRequested}
        onDismiss={handleDiscard}
        onSubmit={(decision) => {
          void handleDecision(decision);
        }}
      />

      <Modal
        visible={showReviewLoading}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.loadingOverlay}>
          <Card variant="elevated" style={styles.loadingCard}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingTitle}>Analyzing review</Text>
            <Text style={styles.loadingSubtitle}>
              AI is analyzing this delivery on the backend. Keep this screen
              open until the result appears.
            </Text>
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
  },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    padding: 16,
    gap: 8,
  },
  controlsCard: {
    padding: 14,
    gap: 10,
  },
  reviewSection: {
    gap: 10,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    width: "100%",
    maxWidth: 340,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  loadingTitle: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: "700" as const,
  },
  loadingSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  title: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: "700" as const,
  },
  subtle: {
    color: AppColors.textSecondary,
    fontSize: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6,
  },
  connection: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  online: {
    color: AppColors.success,
  },
  offline: {
    color: AppColors.warning,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  flex: {
    flex: 1,
  },
  resultTitle: {
    color: AppColors.text,
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  resultLine: {
    color: AppColors.textSecondary,
    fontSize: 13,
  },
  helperText: {
    color: AppColors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  error: {
    color: AppColors.destructive,
    fontSize: 12,
  },
});
