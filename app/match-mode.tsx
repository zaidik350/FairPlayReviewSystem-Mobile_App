import Button from "@/components/Button";
import Card from "@/components/Card";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { MatchModeSkeleton } from "@/components/skeleton/ScreenSkeletons";
import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useMatchContext } from "@/context/MatchContext";
import { getOrCreateDeviceId } from "@/services/matchSync/deviceIdentity";
import { matchSyncService } from "@/services/matchSync/matchSyncService";
import type { MatchLiveState } from "@/services/matchSync/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Camera, Gamepad2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MatchModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getMatchById, isLoadingMatches } = useMatchContext();

  const [deviceId, setDeviceId] = React.useState("");
  const [liveState, setLiveState] = React.useState<MatchLiveState | null>(null);
  const [rolesReady, setRolesReady] = React.useState(false);

  const match = getMatchById(id || "");

  React.useEffect(() => {
    if (!id || !user?.id) {
      setRolesReady(true);
      return;
    }

    let unsub = () => {};

    (async () => {
      try {
        const did = await getOrCreateDeviceId();
        setDeviceId(did);
        const state = await matchSyncService.ensureLiveState(id, user.id);
        setLiveState(state);
        unsub = matchSyncService.subscribeLiveState(id, setLiveState);
      } catch {
        setLiveState(null);
      } finally {
        setRolesReady(true);
      }
    })();

    return () => {
      unsub();
    };
  }, [id, user?.id]);

  const showCameraOption =
    !user?.id ||
    !liveState ||
    !liveState.controlled_by_device_id ||
    liveState.controlled_by_device_id === deviceId;

  const showUmpireOption =
    !user?.id ||
    !liveState ||
    !liveState.umpire_device_id ||
    liveState.umpire_device_id === deviceId;

  const bothTakenElsewhere = !showCameraOption && !showUmpireOption;

  if (isLoadingMatches || (user?.id && id && !rolesReady)) {
    return (
      <>
        <Stack.Screen options={{ title: "Choose Control Mode" }} />
        <ScreenContainer contentStyle={styles.content}>
          <MatchModeSkeleton />
        </ScreenContainer>
      </>
    );
  }

  if (!match) {
    return (
      <ScreenContainer contentStyle={styles.center}>
        <Text style={styles.errorText}>Match not found.</Text>
        <Button title="Back" variant="outline" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Choose Control Mode" }} />
      <ScreenContainer contentStyle={styles.content}>
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.title}>Select Device Role</Text>
          <Text style={styles.subtitle}>{match.name}</Text>
          <Text style={styles.meta}>{match.teams}</Text>

          {bothTakenElsewhere ? (
            <Text style={styles.blockedHint}>
              This match already has a camera device and an umpire device
              assigned. Continue on one of those phones, or pick another match.
            </Text>
          ) : null}

          {showCameraOption ? (
            <View style={styles.optionWrap}>
              <Button
                title="Open Camera Mode"
                onPress={() => router.push(`/camera-mode?id=${match.id}`)}
                icon={<Camera size={18} color={Colors.background} />}
                style={styles.optionButton}
              />
              <Text style={styles.optionHint}>
                Mounted phone: records and runs AI analysis.
              </Text>
            </View>
          ) : null}

          {showUmpireOption ? (
            <View style={styles.optionWrap}>
              <Button
                title="Open Umpire Console"
                onPress={() => router.push(`/umpire-console?id=${match.id}`)}
                icon={<Gamepad2 size={18} color={Colors.background} />}
                style={styles.optionButton}
              />
              <Text style={styles.optionHint}>
                Hand phone: sends commands and shows outcomes live.
              </Text>
            </View>
          ) : null}

          <Button
            title="Back to Match"
            variant="outline"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </Card>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    justifyContent: "center",
    flexGrow: 1,
  },
  center: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  card: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600" as const,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  optionWrap: {
    gap: 6,
    marginTop: 6,
  },
  optionButton: {
    minHeight: 52,
  },
  optionHint: {
    color: Colors.textMuted,
    fontSize: 12,
    marginHorizontal: 4,
  },
  backButton: {
    marginTop: 8,
  },
  errorText: {
    color: Colors.text,
    marginBottom: 12,
  },
  blockedHint: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
});
