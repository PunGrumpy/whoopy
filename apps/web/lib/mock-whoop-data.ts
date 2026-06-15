import type {
  WhoopCycle,
  WhoopData,
  WhoopRecovery,
  WhoopSleep,
  WhoopWorkout,
} from "@/lib/charts/types";

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const WORKOUT_ZONE_MS = {
  zone_five_milli: 4 * 60 * 1000,
  zone_four_milli: 9 * 60 * 1000,
  zone_one_milli: 8 * 60 * 1000,
  zone_three_milli: 14 * 60 * 1000,
  zone_two_milli: 17 * 60 * 1000,
  zone_zero_milli: 0,
} as const;

const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const wave = (index: number, amplitude: number, offset: number): number =>
  offset +
  amplitude * Math.sin(index / 4) +
  amplitude * 0.4 * Math.cos(index / 7);

const isoDaysAgo = (daysAgo: number, hour = 7): string => {
  const date = new Date();
  date.setUTCHours(hour, 0, 0, 0);
  date.setTime(date.getTime() - daysAgo * DAY_MS);
  return date.toISOString();
};

const sportName = (index: number): string => {
  if (index % 6 === 0) {
    return "Running";
  }
  if (index % 3 === 0) {
    return "Cycling";
  }
  return "Functional Fitness";
};

export const createMockWhoopData = (days = 90): WhoopData => {
  const recoveries: WhoopRecovery[] = [];
  const sleeps: WhoopSleep[] = [];
  const cycles: WhoopCycle[] = [];
  const workouts: WhoopWorkout[] = [];

  for (let index = 0; index < days; index += 1) {
    const recoveryScore = Math.round(clamp(wave(index, 18, 68), 22, 98));
    const hrv = Math.round(clamp(wave(index, 22, 72), 35, 120));
    const rhr = Math.round(clamp(wave(index, 6, 54), 48, 72));
    const strain = round(clamp(wave(index, 5.5, 11.5), 4.2, 19.8), 1);
    const sleepPerformance = Math.round(clamp(wave(index, 16, 78), 45, 99));
    const sleepHoursMs =
      Math.round(clamp(wave(index, 1.1, 7.1), 5.2, 8.5)) * HOUR_MS;

    recoveries.push({
      score: {
        hrv_rmssd_milli: hrv,
        recovery_score: recoveryScore,
        resting_heart_rate: rhr,
        skin_temp_celsius: round(wave(index, 0.4, 33.8), 1),
        spo2_percentage: round(clamp(wave(index, 1.5, 96.5), 94, 99), 1),
      },
      score_state: "SCORED",
      updated_at: isoDaysAgo(index, 6),
    });

    sleeps.push({
      nap: false,
      score: {
        respiratory_rate: round(wave(index, 1.2, 15.4), 1),
        sleep_consistency_percentage: Math.round(wave(index, 12, 74)),
        sleep_efficiency_percentage: Math.round(wave(index, 8, 86)),
        sleep_needed: {
          baseline_milli: 7.5 * HOUR_MS,
          need_from_recent_nap_milli: 0,
          need_from_recent_strain_milli: Math.round(
            wave(index, 0.4, 0.6) * HOUR_MS
          ),
          need_from_sleep_debt_milli: Math.round(
            wave(index, 0.5, 0.3) * HOUR_MS
          ),
        },
        sleep_performance_percentage: sleepPerformance,
        stage_summary: {
          disturbance_count: Math.round(Math.max(2, wave(index, 4, 9))),
          sleep_cycle_count: Math.round(Math.max(3, wave(index, 1.5, 5))),
          total_awake_time_milli: Math.round(sleepHoursMs * 0.08),
          total_light_sleep_time_milli: Math.round(sleepHoursMs * 0.45),
          total_rem_sleep_time_milli: Math.round(sleepHoursMs * 0.25),
          total_slow_wave_sleep_time_milli: Math.round(sleepHoursMs * 0.22),
        },
      },
      score_state: "SCORED",
      start: isoDaysAgo(index, 23),
    });

    cycles.push({
      score: {
        average_heart_rate: Math.round(wave(index, 8, 72)),
        kilojoule: Math.round(wave(index, 900, 7200)),
        max_heart_rate: Math.round(wave(index, 18, 156)),
        strain,
      },
      score_state: "SCORED",
      start: isoDaysAgo(index, 0),
    });

    if (index % 2 === 0) {
      const start = isoDaysAgo(index, 17);
      const end = new Date(
        new Date(start).getTime() + 52 * 60 * 1000
      ).toISOString();

      workouts.push({
        end,
        score: {
          average_heart_rate: Math.round(wave(index, 14, 128)),
          distance_meter:
            index % 4 === 0 ? Math.round(wave(index, 1200, 5200)) : 0,
          kilojoule: Math.round(wave(index, 220, 980)),
          max_heart_rate: Math.round(wave(index, 16, 172)),
          strain: round(clamp(wave(index, 3.5, 10.5), 6.5, 16.5), 1),
          zone_durations: WORKOUT_ZONE_MS,
        },
        score_state: "SCORED",
        sport_name: sportName(index),
        start,
      });
    }
  }

  return { cycles, recoveries, sleeps, workouts };
};
