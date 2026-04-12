import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PitchConfigModal from "@/components/match/PitchConfigModal";
import { MatchDetailSkeleton } from "@/components/skeleton/ScreenSkeletons";
import ReviewCard from "@/components/ReviewCard";
import AppColors from "@/constants/colors";
import { useMatchContext } from "@/context/MatchContext";
import { useReviewContext } from "@/context/ReviewContext";
import type { Review } from "@/types";
import { getStatusColor } from "@/utils/matchHelpers";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock3,
  FileText,
  MapPin,
  Play,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Colors = AppColors;

export default function MatchDetailsScreen() {
  const { id, openPitchConfig } = useLocalSearchParams<{
    id: string;
    openPitchConfig?: string;
  }>();
  const router = useRouter();
  const { getMatchById, updateMatch, deleteMatch, syncPitchConfig, isLoadingMatches } =
    useMatchContext();
  const { getReviewsByMatch } = useReviewContext();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [teams, setTeams] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPitchConfigModal, setShowPitchConfigModal] = useState(false);
  const [pitchConfigMandatory, setPitchConfigMandatory] = useState(false);

  const match = getMatchById(id || "");
  const matchReviews = getReviewsByMatch(id || "");

  const formatDateTime = (value: Date) => {
    const datePart = value.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const timePart = value.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} - ${timePart}`;
  };

  const parseDateTime = (value: string): Date | null => {
    const parsed = new Date(value.replace(" - ", " "));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const closePickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const openDatePicker = () => {
    setShowTimePicker(false);
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type !== "set" || !picked) return;

    const next = selectedDateTime ? new Date(selectedDateTime) : new Date();
    next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
    setSelectedDateTime(next);
  };

  const onTimeChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (event.type !== "set" || !picked) return;

    const next = selectedDateTime ? new Date(selectedDateTime) : new Date();
    next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    setSelectedDateTime(next);
  };

  const dateLabel = selectedDateTime
    ? selectedDateTime.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Select date";

  const timeLabel = selectedDateTime
    ? selectedDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Select time";

  useEffect(() => {
    if (!match) return;
    setName(match.name);
    setTeams(match.teams);
    setVenue(match.venue);
    setSelectedDateTime(parseDateTime(match.date));
  }, [match]);

  useEffect(() => {
    if (!match) return;
    if (openPitchConfig === "1") {
      setPitchConfigMandatory(false);
      setShowPitchConfigModal(true);
    }
  }, [match, openPitchConfig]);

  if (isLoadingMatches) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Match Details",
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerShadowVisible: false,
          }}
        />
        <ScreenContainer paddingBottom={100} contentStyle={styles.content}>
          <MatchDetailSkeleton />
        </ScreenContainer>
      </>
    );
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found</Text>
      </View>
    );
  }

  const startMatch = async () => {
    await updateMatch(match.id, { status: "live" });
    router.push(`/match-mode?id=${match.id}`);
  };

  const handleStartMatch = async () => {
    if (match.status === "completed") {
      Alert.alert(
        "Match Completed",
        "This match is already completed and cannot be started again.",
      );
      return;
    }

    const latest = await syncPitchConfig(match.id);
    if (!latest?.pitchConfigured) {
      setPitchConfigMandatory(true);
      setShowPitchConfigModal(true);
      Alert.alert(
        "Wicket Configuration Required",
        "Please configure wicket before starting this match.",
      );
      return;
    }

    await startMatch();
  };

  const handleSaveChanges = async () => {
    if (match.status === "completed") {
      Alert.alert("Match Completed", "Completed matches cannot be edited.");
      setIsEditing(false);
      return;
    }

    if (!name.trim() || !teams.trim() || !venue.trim() || !selectedDateTime) {
      Alert.alert("Error", "Please fill in all fields before saving.");
      return;
    }

    setSaving(true);
    try {
      await updateMatch(match.id, {
        name: name.trim(),
        teams: teams.trim(),
        venue: venue.trim(),
        date: formatDateTime(selectedDateTime),
      });
      setIsEditing(false);
      Alert.alert("Success", "Match updated successfully.");
    } catch (error) {
      console.log("[MatchDetails][handleSaveChanges] error:", error);
      Alert.alert("Error", "Failed to update match. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMatch = () => {
    if (match.status === "completed") {
      Alert.alert("Match Completed", "Completed matches cannot be deleted.");
      return;
    }

    Alert.alert(
      "Delete Match",
      "Are you sure you want to delete this match? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteMatch(match.id);
              router.replace("/(tabs)/matches");
            } catch (error) {
              console.log("[MatchDetails][handleDeleteMatch] error:", error);
              Alert.alert("Error", "Failed to delete match. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Match Details",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer paddingBottom={100} contentStyle={styles.content}>
        <Card variant="elevated" style={styles.matchCard}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(match.status)}20` },
              ]}
            >
              {match.status === "live" && (
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(match.status) },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(match.status) },
                ]}
              >
                {match.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Match Name"
                value={name}
                onChangeText={setName}
                onFocus={closePickers}
                placeholder="Enter match name"
                icon={<FileText size={18} color={Colors.textSecondary} />}
              />

              <Input
                label="Teams"
                value={teams}
                onChangeText={setTeams}
                onFocus={closePickers}
                placeholder="e.g., Team A vs Team B"
                icon={<Users size={18} color={Colors.textSecondary} />}
              />

              <Input
                label="Venue"
                value={venue}
                onChangeText={setVenue}
                onFocus={closePickers}
                placeholder="Enter venue"
                icon={<MapPin size={18} color={Colors.textSecondary} />}
              />

              <Text style={styles.label}>Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={styles.dateTimeButton}
                  activeOpacity={0.85}
                >
                  <Calendar size={18} color={Colors.textSecondary} />
                  <Text style={styles.dateTimeText}>{dateLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={openTimePicker}
                  style={styles.dateTimeButton}
                  activeOpacity={0.85}
                >
                  <Clock3 size={18} color={Colors.textSecondary} />
                  <Text style={styles.dateTimeText}>{timeLabel}</Text>
                </TouchableOpacity>
              </View>

              {selectedDateTime ? (
                <Text style={styles.selectedDateTime}>
                  Selected: {formatDateTime(selectedDateTime)}
                </Text>
              ) : null}

              {showDatePicker ? (
                <DateTimePicker
                  value={selectedDateTime ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              ) : null}

              {showTimePicker ? (
                <DateTimePicker
                  value={selectedDateTime ?? new Date()}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onTimeChange}
                />
              ) : null}

              <View style={styles.actionRow}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    closePickers();
                    setName(match.name);
                    setTeams(match.teams);
                    setVenue(match.venue);
                    setSelectedDateTime(parseDateTime(match.date));
                  }}
                  variant="outline"
                  style={styles.actionButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveChanges}
                  loading={saving}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.matchName}>{match.name}</Text>

              <View style={styles.infoRow}>
                <Users size={18} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{match.teams}</Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={18} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{match.venue}</Text>
              </View>

              <View style={styles.infoRow}>
                <Calendar size={18} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{match.date}</Text>
              </View>

              <View style={styles.pitchConfigRow}>
                <Text style={styles.pitchConfigLabel}>Wicket Config</Text>
                <View
                  style={[
                    styles.pitchConfigBadge,
                    match.pitchConfigured
                      ? styles.pitchConfigDone
                      : styles.pitchConfigPending,
                  ]}
                >
                  <Text style={styles.pitchConfigText}>
                    {match.pitchConfigured ? "Configured" : "Pending"}
                  </Text>
                </View>
              </View>

              {match.status !== "completed" && (
                <Button
                  title={
                    match.pitchConfigured
                      ? "Update Wicket Config"
                      : "Configure Wicket"
                  }
                  onPress={() => {
                    setPitchConfigMandatory(false);
                    setShowPitchConfigModal(true);
                  }}
                  variant="outline"
                  style={styles.pitchConfigButton}
                />
              )}

              {match.status !== "completed" ? (
                <View style={styles.actionRow}>
                  <Button
                    title="Edit Match"
                    onPress={() => setIsEditing(true)}
                    variant="outline"
                    style={styles.actionButton}
                  />
                  <Button
                    title="Delete Match"
                    onPress={handleDeleteMatch}
                    loading={deleting}
                    variant="destructive"
                    style={styles.actionButton}
                  />
                </View>
              ) : (
                <Text style={styles.completedNote}>
                  Completed matches cannot be edited or deleted.
                </Text>
              )}

              {match.status !== "completed" && (
                <Button
                  title={
                    match.status === "live" ? "Continue Match" : "Start Match"
                  }
                  onPress={handleStartMatch}
                  style={styles.startButton}
                  icon={
                    <Play
                      size={18}
                      color={Colors.background}
                      fill={Colors.background}
                    />
                  }
                />
              )}
            </>
          )}
        </Card>

        {matchReviews.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Match Reviews ({matchReviews.length})
            </Text>
            {matchReviews.map((review: Review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onPress={() => router.push(`/review-detail?id=${review.id}`)}
              />
            ))}
          </>
        )}
      </ScreenContainer>

      <PitchConfigModal
        visible={showPitchConfigModal}
        match={match}
        mandatory={pitchConfigMandatory}
        onClose={() => {
          setShowPitchConfigModal(false);
          setPitchConfigMandatory(false);
          if (openPitchConfig === "1") {
            router.back();
          }
        }}
        onConfigured={async () => {
          setShowPitchConfigModal(false);
          if (pitchConfigMandatory && match.status !== "live") {
            const latest = await syncPitchConfig(match.id);
            if (!latest?.pitchConfigured) {
              Alert.alert(
                "Configuration Pending",
                "Pitch is not configured yet. Please retake the photo.",
              );
              setShowPitchConfigModal(true);
              return;
            }
            setPitchConfigMandatory(false);
            await startMatch();
            return;
          }
          if (openPitchConfig === "1") {
            router.back();
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
  },
  matchCard: {
    padding: 20,
    marginBottom: 24,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  matchName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  editForm: {
    marginTop: 4,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500" as const,
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDateTime: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
  },
  pitchConfigRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  pitchConfigLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  pitchConfigBadge: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pitchConfigDone: {
    backgroundColor: "rgba(0, 255, 136, 0.15)",
  },
  pitchConfigPending: {
    backgroundColor: "rgba(255, 184, 0, 0.15)",
  },
  pitchConfigText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "700" as const,
  },
  pitchConfigButton: {
    marginTop: 6,
  },
  startButton: {
    marginTop: 16,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  completedNote: {
    marginTop: 12,
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 16,
  },
});
