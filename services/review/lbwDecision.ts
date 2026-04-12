import type { DecisionType } from "@/types";

/**
 * `match_live_state.last_review_decision` (and related CHECKs) only allow OUT | NOT OUT.
 * The ML API may return NO_DECISION or other strings — normalize before Supabase writes.
 *
 * Inconclusive model output defaults to the on-field call (original decision).
 */
export function normalizeLbwDecisionForDb(
  raw: unknown,
  originalDecision: DecisionType,
): DecisionType {
  if (raw === null || raw === undefined) return originalDecision;
  const s = String(raw)
    .trim()
    .toUpperCase()
    .replace(/_/g, " ");
  if (s === "OUT") return "OUT";
  if (s === "NOT OUT") return "NOT OUT";
  if (
    s === "NO DECISION" ||
    s === "INCONCLUSIVE" ||
    s === "UNKNOWN" ||
    s === ""
  ) {
    return originalDecision;
  }
  return originalDecision;
}
