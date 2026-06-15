import { getSportsMixData, milliToH, round, safeAvg } from "@/lib/charts/data";
import type { WhoopData } from "@/lib/charts/types";

export type InsightCategory = "recovery" | "sleep" | "strain" | "workout";

export interface HomeInsight {
  category: InsightCategory;
  date: string;
  description: string;
  href?: string;
  id: string;
  priority: number;
  title: string;
}

const MAX_INSIGHTS = 6;

const SLEEP_DEBT_THRESHOLD_H = 0.3;
const HIGH_STRAIN_THRESHOLD = 14;
const LOW_RECOVERY_THRESHOLD = 50;
const HRV_TREND_THRESHOLD_PCT = 5;

type InsightBuilder = (data: WhoopData) => HomeInsight | null;

const avgRecoveryScore = (data: WhoopData): number | null =>
  safeAvg(data.recoveries.map((r) => r.score.recovery_score));

const avgHrv = (recoveries: WhoopData["recoveries"]): number | null =>
  safeAvg(recoveries.map((r) => r.score.hrv_rmssd_milli));

const recoveryZoneInsight: InsightBuilder = (data) => {
  const latest = data.recoveries.at(0);
  if (!latest) {
    return null;
  }

  const score = latest.score.recovery_score;
  let title: string;
  let description: string;
  let priority: number;

  if (score < 34) {
    title = "Low recovery";
    description = `Recovery is ${score}% — consider lighter activity and extra rest today.`;
    priority = 90;
  } else if (score < 67) {
    title = "Moderate recovery";
    description = `Recovery is ${score}% — moderate strain is appropriate if you feel ready.`;
    priority = 30;
  } else {
    title = "High recovery";
    description = `Recovery is ${score}% — your body is primed for higher strain today.`;
    priority = 20;
  }

  return {
    category: "recovery",
    date: latest.updated_at,
    description,
    href: "/dashboard/recovery",
    id: "recovery-zone",
    priority,
    title,
  };
};

const recoveryVsAverageInsight: InsightBuilder = (data) => {
  const latest = data.recoveries.at(0);
  const average = avgRecoveryScore(data);
  if (!latest || average === null || data.recoveries.length < 2) {
    return null;
  }

  const score = latest.score.recovery_score;
  const delta = round(score - average, 0);
  if (Math.abs(delta) < 5) {
    return null;
  }

  const direction = delta > 0 ? "above" : "below";
  const title = delta > 0 ? "Recovery trending up" : "Recovery trending down";

  return {
    category: "recovery",
    date: latest.updated_at,
    description: `Today's recovery is ${Math.abs(delta)}% ${direction} your ${data.recoveries.length}-day average of ${average}%.`,
    href: "/dashboard/recovery",
    id: "recovery-vs-avg",
    priority: 50,
    title,
  };
};

const sleepDebtInsight: InsightBuilder = (data) => {
  const latest = data.sleeps.at(0);
  if (!latest) {
    return null;
  }

  const debtH = milliToH(
    latest.score.sleep_needed?.need_from_sleep_debt_milli ?? 0
  );
  if (debtH <= SLEEP_DEBT_THRESHOLD_H) {
    return null;
  }

  return {
    category: "sleep",
    date: latest.start,
    description: `Sleep debt is ${debtH}h — prioritize an earlier bedtime to close the gap.`,
    href: "/dashboard/sleep",
    id: "sleep-debt",
    priority: 70,
    title: "Sleep debt accumulating",
  };
};

const strainRecoveryMismatchInsight: InsightBuilder = (data) => {
  const latestRecovery = data.recoveries.at(0);
  const previousCycle = data.cycles.at(1);
  if (!latestRecovery || !previousCycle) {
    return null;
  }

  const recoveryScore = latestRecovery.score.recovery_score;
  const previousStrain = previousCycle.score.strain;
  if (
    previousStrain <= HIGH_STRAIN_THRESHOLD ||
    recoveryScore >= LOW_RECOVERY_THRESHOLD
  ) {
    return null;
  }

  return {
    category: "strain",
    date: latestRecovery.updated_at,
    description: `Yesterday's strain was ${round(previousStrain, 1)} with recovery at ${recoveryScore}% today — consider active recovery.`,
    href: "/dashboard/cycles",
    id: "strain-recovery-mismatch",
    priority: 100,
    title: "High strain, low recovery",
  };
};

const workoutFrequencyInsight: InsightBuilder = (data) => {
  const count = data.workouts.length;
  if (count === 0) {
    return null;
  }

  const topSport = getSportsMixData(data.workouts)
    .toSorted((a, b) => b.value - a.value)
    .at(0);
  const label = count === 1 ? "workout" : "workouts";
  const sportDetail = topSport
    ? ` ${topSport.name} makes up ${Math.round((topSport.value / count) * 100)}% of activity.`
    : "";

  return {
    category: "workout",
    date: data.workouts.at(0)?.start ?? new Date().toISOString(),
    description: `${count} ${label} logged in this period.${sportDetail}`,
    href: "/dashboard/workouts",
    id: "workout-frequency",
    priority: 35,
    title: `${count} ${label} this period`,
  };
};

const hrvTrendInsight: InsightBuilder = (data) => {
  const latest = data.recoveries.at(0);
  if (!latest || data.recoveries.length < 2) {
    return null;
  }

  const latestHrv = latest.score.hrv_rmssd_milli;
  const previousAvg = avgHrv(data.recoveries.slice(1));
  if (previousAvg === null || previousAvg === 0) {
    return null;
  }

  const deltaPct = round(((latestHrv - previousAvg) / previousAvg) * 100, 0);
  if (Math.abs(deltaPct) < HRV_TREND_THRESHOLD_PCT) {
    return null;
  }

  const direction = deltaPct > 0 ? "up" : "down";
  const title = deltaPct > 0 ? "HRV improving" : "HRV declining";

  return {
    category: "recovery",
    date: latest.updated_at,
    description: `HRV is ${Math.abs(deltaPct)}% ${direction} from your recent average of ${previousAvg} ms.`,
    href: "/dashboard/recovery",
    id: "hrv-trend",
    priority: 40,
    title,
  };
};

const INSIGHT_BUILDERS: InsightBuilder[] = [
  recoveryZoneInsight,
  recoveryVsAverageInsight,
  sleepDebtInsight,
  strainRecoveryMismatchInsight,
  workoutFrequencyInsight,
  hrvTrendInsight,
];

export const buildHomeInsights = (data: WhoopData): HomeInsight[] =>
  INSIGHT_BUILDERS.map((build) => build(data))
    .filter((insight): insight is HomeInsight => insight !== null)
    .toSorted((a, b) => b.priority - a.priority)
    .slice(0, MAX_INSIGHTS);

export const buildDomainInsights = (
  data: WhoopData,
  category: InsightCategory
): HomeInsight[] =>
  INSIGHT_BUILDERS.map((build) => build(data))
    .filter((insight): insight is HomeInsight => insight !== null)
    .filter((insight) => insight.category === category)
    .toSorted((a, b) => b.priority - a.priority)
    .slice(0, MAX_INSIGHTS);
