import { Attempt, Episode } from "@prisma/client";

export type ExecMetrics = {
  bookedRevenue: number;
  projectedRevenue: number;
  outcomes: { positive: number; negative: number };
  pipeline: { open: number; collected: number; released: number };
  lastUpdated: string;
};

const CASE_VALUE = 2900;

export function calculateExecMetrics(episodes: (Episode & { attempts: Attempt[] })[]): ExecMetrics {
  let booked = 0;
  let projected = 0;
  let positive = 0;
  let negative = 0;
  let open = 0;
  let collected = 0;
  let released = 0;

  episodes.forEach((episode) => {
    const latestAttempt = episode.attempts.sort((a, b) => b.attemptNo - a.attemptNo)[0];
    if (!latestAttempt) {
      open += 1;
      projected += CASE_VALUE;
      return;
    }

    switch (episode.status) {
      case "RELEASED":
        released += 1;
        booked += CASE_VALUE;
        projected += CASE_VALUE;
        if (latestAttempt.classification === "positive") positive += 1;
        if (latestAttempt.classification === "negative") negative += 1;
        break;
      case "COLLECTED":
        collected += 1;
        projected += CASE_VALUE;
        break;
      default:
        open += 1;
        projected += CASE_VALUE;
    }
  });

  return {
    bookedRevenue: booked,
    projectedRevenue: projected,
    outcomes: { positive, negative },
    pipeline: { open, collected, released },
    lastUpdated: new Date().toISOString(),
  };
}
