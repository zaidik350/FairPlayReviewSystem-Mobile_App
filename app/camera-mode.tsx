import Button from "@/components/Button";
import Card from "@/components/Card";
import ScreenContainer from "@/components/layout/ScreenContainer";
import AppColors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useMatchContext } from "@/context/MatchContext";
import { useReviewContext } from "@/context/ReviewContext";
import { useCamera } from "@/hooks/useCamera";
import { useRecording } from "@/hooks/useRecording";
import { getOrCreateDeviceId } from "@/services/matchSync/deviceIdentity";
import { matchSyncService } from "@/services/matchSync/matchSyncService";
import type {
    MatchCommandRow,
    MatchLiveState,
} from "@/services/matchSync/types";
import { reviewService } from "@/services/review/reviewService";
import { CameraView } from "expo-camera";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function CameraModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getMatchById } = useMatchContext();
  const { addReview } = useReviewContext();
  const match = getMatchById(id || "");

  const [deviceId, setDeviceId] = React.useState("");
  const [liveState, setLiveState] = React.useState<MatchLiveState | null>(null);
  const [queue, setQueue] = React.useState<MatchCommandRow[]>([]);
  const [syncError, setSyncError] = React.useState("");

  const pendingClipUriRef = React.useRef<string | null>(null);
  const processingRef = React.useRef(false);
  const processedCommandIdsRef = React.useRef(new Set<string>());
  const recentCommandSignatureRef = React.useRef<Map<string, number>>(
    new Map(),
  );
  const liveStateRef = React.useRef<MatchLiveState | null>(null);

  const {
    cameraRef,
    permission,
    requestPermission,
    micPermission,
    requestMicPermission,
    facing,
  } = useCamera();

  const { isRecording, recordingTime, start, stop, reset, maxDuration } =
    useRecording({
      cameraRef,
      onRecordingComplete: async (uri) => {
        pendingClipUriRef.current = uri;
        const current = liveStateRef.current;
        if (!current || !id) return;
        if (current.clip_status === "pending_decision") {
          try {
            await matchSyncService.updateLiveState(id, {
              pending_clip_id: `${Date.now()}`,
            });
          } catch (error) {
            console.log(
              "[CameraMode][onRecordingComplete] update pending ref failed",
              error,
            );
          }
        }
      },
    });

  React.useEffect(() => {
    liveStateRef.current = liveState;
  }, [liveState]);

  React.useEffect(() => {
    if (!id || !user?.id) return;
    let liveUnsub = () => {};
    let commandUnsub = () => {};
    let hb: ReturnType<typeof setInterval> | null = null;

    (async () => {
      try {
        const did = await getOrCreateDeviceId();
        setDeviceId(did);
        console.log(
          "[CameraMode][mode] role=camera deviceId=",
          did,
          "matchId=",
          id,
          "userId=",
          user.id,
        );

        const seeded = await matchSyncService.ensureLiveState(id, user.id);
        setLiveState(seeded);
        console.log("[CameraMode][state:init]", seeded);
        await matchSyncService.assignRole(id, "camera", did);

        liveUnsub = matchSyncService.subscribeLiveState(id, (stateUpdate) => {
          console.log("[CameraMode][state:update]", {
            matchId: stateUpdate.match_id,
            isRecording: stateUpdate.is_recording,
            clipStatus: stateUpdate.clip_status,
            cameraDevice: stateUpdate.controlled_by_device_id,
            umpireDevice: stateUpdate.umpire_device_id,
            pendingClipId: stateUpdate.pending_clip_id,
            lastError: stateUpdate.last_error,
          });
          setLiveState(stateUpdate);
        });
        commandUnsub = matchSyncService.subscribeCommands(id, (cmd) => {
          const cmdId = String(cmd.id);
          if (processedCommandIdsRef.current.has(cmdId)) return;

          const signature = `${cmd.type}:${JSON.stringify(cmd.payload ?? {})}`;
          const now = Date.now();
          const prevTs = recentCommandSignatureRef.current.get(signature) ?? 0;
          if (now - prevTs < 650) {
            console.log("[CameraMode][command] deduped", {
              cmdId,
              type: cmd.type,
              payload: cmd.payload,
            });
            processedCommandIdsRef.current.add(cmdId);
            return;
          }

          console.log("[CameraMode][command] queued", {
            cmdId,
            type: cmd.type,
            payload: cmd.payload,
          });
          recentCommandSignatureRef.current.set(signature, now);
          setQueue((prev) => [...prev, cmd]);
        });

        hb = setInterval(() => {
          matchSyncService.heartbeat(id, "camera").catch((error) => {
            console.log("[CameraMode][heartbeat] failed", error);
          });
        }, 7000);
      } catch (error: any) {
        console.log("[CameraMode][init] failed", error);
        setSyncError(
          error?.message || "Failed to connect Camera Mode realtime sync.",
        );
      }
    })();

    return () => {
      liveUnsub();
      commandUnsub();
      if (hb) clearInterval(hb);
    };
  }, [id, user?.id]);

  const processCommand = React.useCallback(
    async (command: MatchCommandRow) => {
      if (!id || !match) return;

      const type = command.type;
      const current = liveStateRef.current;
      if (!current) return;

      console.log("[CameraMode][command] processing", {
        commandId: command.id,
        type,
        payload: command.payload,
        stateBefore: {
          isRecording: current.is_recording,
          clipStatus: current.clip_status,
          pendingClipId: current.pending_clip_id,
        },
      });

      if (type === "START_RECORDING") {
        if (
          isRecording ||
          current.is_recording ||
          current.clip_status === "recording"
        ) {
          console.log("[CameraMode][START_RECORDING] ignored", {
            reason: "already recording",
            localIsRecording: isRecording,
            liveIsRecording: current.is_recording,
            clipStatus: current.clip_status,
          });
          return;
        }

        pendingClipUriRef.current = null;
        await matchSyncService.updateLiveState(id, {
          is_recording: true,
          recording_started_at: new Date().toISOString(),
          clip_status: "recording",
          last_error: null,
        });
        void start();
        return;
      }

      if (type === "END_DELIVERY") {
        if (!isRecording && !current.is_recording) {
          console.log("[CameraMode][END_DELIVERY] ignored", {
            reason: "camera not recording",
            localIsRecording: isRecording,
            liveIsRecording: current.is_recording,
          });
          await matchSyncService.updateLiveState(id, {
            last_error:
              "END_DELIVERY ignored because camera was not recording.",
          });
          return;
        }

        await stop();
        await matchSyncService.updateLiveState(id, {
          is_recording: false,
          clip_status: "pending_decision",
          recording_started_at: null,
          pending_clip_id: pendingClipUriRef.current ? `${Date.now()}` : null,
          last_error: null,
        });
        return;
      }

      if (type === "REQUEST_REVIEW") {
        const originalDecision = (command.payload?.originalDecision ?? null) as
          | "OUT"
          | "NOT OUT"
          | null;
        if (!originalDecision) return;
        if (!pendingClipUriRef.current) {
          console.log("[CameraMode][REQUEST_REVIEW] blocked", {
            reason: "pending clip missing",
            clipStatus: current.clip_status,
          });
          await matchSyncService.updateLiveState(id, {
            clip_status: "error",
            last_error: "Review requested without pending clip.",
          });
          return;
        }

        await matchSyncService.updateLiveState(id, {
          clip_status: "reviewing",
          last_review_original_decision: originalDecision,
          last_error: null,
        });

        try {
          const result = await reviewService.analyzeVideo(
            pendingClipUriRef.current,
            id,
            originalDecision,
          );
          await addReview({
            matchId: id,
            matchName: match.name,
            over: `${current.over_number}.${current.legal_balls_this_over}`,
            originalDecision,
            decision: result.decision,
            impact: result.impact,
            pitch: result.pitch,
            wickets: result.wickets,
            videoUri: pendingClipUriRef.current,
          });

          pendingClipUriRef.current = null;
          reset();

          await matchSyncService.updateLiveState(id, {
            clip_status: "done",
            pending_clip_id: null,
            last_review_decision: result.decision,
            last_error: null,
          });
        } catch (error: any) {
          console.log("[CameraMode][REQUEST_REVIEW] failed", error);
          await matchSyncService.updateLiveState(id, {
            clip_status: "error",
            last_error: error?.message || "Review analysis failed.",
          });
        }
        return;
      }

      if (type === "DISCARD_LAST_CLIP") {
        console.log("[CameraMode][DISCARD_LAST_CLIP] clearing pending clip");
        pendingClipUriRef.current = null;
        reset();

        await matchSyncService.updateLiveState(id, {
          clip_status: "idle",
          is_recording: false,
          recording_started_at: null,
          pending_clip_id: null,
          last_error: null,
        });
        return;
      }
    },
    [addReview, id, isRecording, match, reset, start, stop],
  );

  React.useEffect(() => {
    if (processingRef.current) return;
    if (queue.length === 0) return;

    processingRef.current = true;
    const [next, ...rest] = queue;
    setQueue(rest);

    (async () => {
      try {
        await processCommand(next);
      } finally {
        processedCommandIdsRef.current.add(String(next.id));
        processingRef.current = false;
      }
    })();
  }, [processCommand, queue]);

  const handleEmergencyStop = async () => {
    if (!id || !isRecording) return;
    await stop();
    await matchSyncService.updateLiveState(id, {
      is_recording: false,
      clip_status: "pending_decision",
      recording_started_at: null,
      last_error: "Stopped from Camera Mode emergency control.",
    });
  };

  if (!permission || !micPermission) {
    return (
      <ScreenContainer contentStyle={styles.center}>
        <Text style={styles.infoText}>Loading camera permissions...</Text>
      </ScreenContainer>
    );
  }

  if (!permission.granted || !micPermission.granted) {
    return (
      <ScreenContainer contentStyle={styles.center}>
        <Card variant="glass" style={styles.permissionCard}>
          <Text style={styles.title}>Permissions Required</Text>
          <Text style={styles.subtle}>
            Camera and microphone are needed for Camera Mode.
          </Text>
          <Button
            title="Grant Permission"
            onPress={async () => {
              await requestPermission();
              await requestMicPermission();
            }}
          />
          <Button
            title="Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </Card>
      </ScreenContainer>
    );
  }

  if (!match) {
    return (
      <ScreenContainer contentStyle={styles.center}>
        <Text style={styles.infoText}>Match not found.</Text>
      </ScreenContainer>
    );
  }

  const CameraViewWithRef =
    CameraView as unknown as React.ForwardRefExoticComponent<
      React.ComponentProps<typeof CameraView> & React.RefAttributes<CameraView>
    >;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {Platform.OS !== "web" ? (
        <CameraViewWithRef
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="video"
        >
          <View style={styles.overlayTop}>
            <Text style={styles.modePill}>CAMERA MODE</Text>
            <Text style={styles.matchName}>{match.name}</Text>
            <Text style={styles.subtle}>Device: {deviceId.slice(0, 8)}...</Text>
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.stateText}>
              State: {liveState?.clip_status ?? "idle"}
            </Text>
            <Text style={styles.stateText}>
              Recording:{" "}
              {isRecording ? `${recordingTime}s / ${maxDuration}s` : "no"}
            </Text>
            <Text style={styles.stateText}>
              Over: {liveState?.over_number ?? 0}.
              {liveState?.legal_balls_this_over ?? 0}
            </Text>
            {syncError ? (
              <Text style={styles.errorText}>{syncError}</Text>
            ) : null}
            {liveState?.last_error ? (
              <Text style={styles.errorText}>{liveState.last_error}</Text>
            ) : null}
            <Button
              title="Emergency Stop"
              variant="destructive"
              onPress={handleEmergencyStop}
              disabled={!isRecording}
            />
            <Button
              title="Back"
              variant="outline"
              onPress={() => router.back()}
            />
          </View>
        </CameraViewWithRef>
      ) : (
        <ScreenContainer contentStyle={styles.center}>
          <Text style={styles.infoText}>
            Camera Mode needs a native device for recording.
          </Text>
          <Button
            title="Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </ScreenContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  camera: {
    flex: 1,
  },
  overlayTop: {
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 8,
  },
  overlayBottom: {
    marginTop: "auto",
    gap: 8,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modePill: {
    alignSelf: "flex-start",
    backgroundColor: AppColors.primary,
    color: AppColors.background,
    fontSize: 11,
    fontWeight: "800" as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  matchName: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: "700" as const,
  },
  subtle: {
    color: AppColors.textSecondary,
    fontSize: 12,
  },
  stateText: {
    color: AppColors.text,
    fontSize: 14,
  },
  errorText: {
    color: AppColors.destructive,
    fontSize: 12,
  },
  permissionCard: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: AppColors.text,
  },
  center: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: AppColors.text,
    marginBottom: 12,
  },
});
