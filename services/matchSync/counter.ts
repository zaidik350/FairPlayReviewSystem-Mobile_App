import type { CricketCounter, DeliveryType } from "@/services/matchSync/types";

export function applyDeliveryToCounter(
  counter: CricketCounter,
  deliveryType: DeliveryType,
): CricketCounter {
  if (deliveryType !== "LEGAL") {
    return counter;
  }

  const nextLegalBalls = counter.legalBallsThisOver + 1;
  if (nextLegalBalls >= 6) {
    return {
      overNumber: counter.overNumber + 1,
      legalBallsThisOver: 0,
      totalLegalBalls: counter.totalLegalBalls + 1,
    };
  }

  return {
    overNumber: counter.overNumber,
    legalBallsThisOver: nextLegalBalls,
    totalLegalBalls: counter.totalLegalBalls + 1,
  };
}
