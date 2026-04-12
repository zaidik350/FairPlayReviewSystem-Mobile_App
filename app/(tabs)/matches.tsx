import Button from "@/components/Button";
import MatchCard from "@/components/MatchCard";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { MatchesListSkeleton } from "@/components/skeleton/ScreenSkeletons";
import Colors from "@/constants/colors";
import { useMatchContext } from "@/context/MatchContext";
import type { Match } from "@/types";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Filter, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterType = "all" | "live" | "upcoming" | "completed";

export default function MatchesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    matches,
    isLoadingMatches,
    getLiveMatches,
    getUpcomingMatches,
    getCompletedMatches,
  } = useMatchContext();
  const [filter, setFilter] = useState<FilterType>("all");

  const getFilteredMatches = () => {
    switch (filter) {
      case "live":
        return getLiveMatches();
      case "upcoming":
        return getUpcomingMatches();
      case "completed":
        return getCompletedMatches();
      default:
        return matches;
    }
  };

  const handleFilterPress = (newFilter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const handleMatchPress = (
    matchId: string,
    status: string,
    pitchConfigured?: boolean,
  ) => {
    if (status === "live" && pitchConfigured) {
      router.push(`/match-mode?id=${matchId}`);
    } else {
      router.push(`/match-details?id=${matchId}`);
    }
  };

  const filteredMatches = getFilteredMatches();
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "live", label: "Live" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <ScreenContainer scroll={false} safeArea={false}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Matches</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/create-match")}
        >
          <Plus size={22} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterButton,
                filter === f.key && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(f.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
              {f.key === "live" && getLiveMatches().length > 0 && (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>
                    {getLiveMatches().length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingMatches ? (
          <MatchesListSkeleton />
        ) : filteredMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Filter size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "all"
                ? "Create a new match to get started"
                : `No ${filter} matches at the moment`}
            </Text>
            {filter === "all" && (
              <Button
                title="Create Match"
                onPress={() => router.push("/create-match")}
                variant="outline"
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          filteredMatches.map((match: Match) => (
            <MatchCard
              key={match.id}
              match={match}
              onPress={() =>
                handleMatchPress(match.id, match.status, match.pitchConfigured)
              }
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  liveBadge: {
    backgroundColor: Colors.live,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 24,
  },
});
