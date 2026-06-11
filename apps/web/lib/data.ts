import type {
  WhoopCycle,
  WhoopRecovery,
  WhoopSleep,
  WhoopWorkout,
} from "@/lib/charts/types";

// Helper to get past dates relative to now
const getPastDate = (daysAgo: number, hours = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

const generateMockData = () => {
  const recoveries: WhoopRecovery[] = [];
  const sleeps: WhoopSleep[] = [];
  const cycles: WhoopCycle[] = [];
  const workouts: WhoopWorkout[] = [];

  const sports = [
    "Running",
    "Weightlifting",
    "Cycling",
    "Swimming",
    "Yoga",
    "Boxing",
  ];

  for (let i = 0; i < 28; i += 1) {
    // 8 AM
    const dateStr = getPastDate(i, 8);
    // 11 PM previous night
    const sleepStart = getPastDate(i, 23);

    // Seeded random for consistent but varying data day-by-day
    const seed = i;
    const random = (min: number, max: number): number => {
      const x = Math.sin(seed + 1) * 10_000;
      const r = x - Math.floor(x);
      return min + r * (max - min);
    };

    // Recovery Score (0-100)
    const recoveryScore = Math.round(random(25, 96));
    const hrv = Math.round(random(35, 115));
    const rhr = Math.round(random(48, 72));
    const spo2 = Math.round(random(95, 99));
    const skinTemp = Math.round(random(33.2, 35.8) * 10) / 10;

    recoveries.push({
      score: {
        hrv_rmssd_milli: hrv,
        recovery_score: recoveryScore,
        resting_heart_rate: rhr,
        skin_temp_celsius: skinTemp,
        spo2_percentage: spo2,
      },
      score_state: "SCORED",
      updated_at: dateStr,
    });

    // Sleep Metrics
    const sleepPerformance = Math.round(random(50, 100));
    const sleepEfficiency = Math.round(random(80, 98));
    const sleepConsistency = Math.round(random(65, 96));
    const respRate = Math.round(random(13.5, 17.5) * 10) / 10;

    // 8.2 hours needed
    const totalSleepNeeded = 8.2 * 3_600_000;
    const sleepNeededObj = {
      baseline_milli: 8 * 3_600_000,
      need_from_recent_nap_milli: 0,
      need_from_recent_strain_milli: Math.round(random(0, 0.4) * 3_600_000),
      need_from_sleep_debt_milli: Math.round(random(0, 0.8) * 3_600_000),
    };

    const actualSleepTime = (sleepPerformance / 100) * totalSleepNeeded;
    const lightSleep = actualSleepTime * 0.55;
    const deepSleep = actualSleepTime * 0.25;
    const remSleep = actualSleepTime * 0.2;
    const awakeTime = random(15, 65) * 60_000;

    sleeps.push({
      nap: false,
      score: {
        respiratory_rate: respRate,
        sleep_consistency_percentage: sleepConsistency,
        sleep_efficiency_percentage: sleepEfficiency,
        sleep_needed: sleepNeededObj,
        sleep_performance_percentage: sleepPerformance,
        stage_summary: {
          disturbance_count: Math.round(random(4, 16)),
          sleep_cycle_count: Math.round(random(3, 7)),
          total_awake_time_milli: Math.round(awakeTime),
          total_light_sleep_time_milli: Math.round(lightSleep),
          total_rem_sleep_time_milli: Math.round(remSleep),
          total_slow_wave_sleep_time_milli: Math.round(deepSleep),
        },
      },
      score_state: "SCORED",
      start: sleepStart,
    });

    // Workouts (4-5 times a week)
    const hasWorkout = random(0, 1) > 0.35;
    let workoutStrain = 0;
    // in kJ
    let workoutCalories = 0;
    if (hasWorkout) {
      const sport = sports[Math.floor(random(0, sports.length))];
      const workoutDurationMin = Math.round(random(30, 95));
      workoutStrain = Math.round(random(5, 17) * 10) / 10;
      // in kJ
      workoutCalories = Math.round(random(200, 750) * 4.184);
      const avgHr = Math.round(random(115, 155));
      const maxHr = Math.round(random(160, 190));
      const distance =
        sport === "Running" || sport === "Cycling" || sport === "Swimming"
          ? Math.round(random(1500, 11_000))
          : undefined;

      const zoneZero = workoutDurationMin * 0.08 * 60_000;
      const zoneOne = workoutDurationMin * 0.12 * 60_000;
      const zoneTwo = workoutDurationMin * 0.25 * 60_000;
      const zoneThree = workoutDurationMin * 0.32 * 60_000;
      const zoneFour = workoutDurationMin * 0.18 * 60_000;
      const zoneFive = workoutDurationMin * 0.05 * 60_000;

      // random start time between 9am and 7pm
      const wStart = getPastDate(i, Math.round(random(9, 19)));
      const wEnd = new Date(
        new Date(wStart).getTime() + workoutDurationMin * 60_000
      ).toISOString();

      workouts.push({
        end: wEnd,
        score: {
          average_heart_rate: avgHr,
          distance_meter: distance,
          kilojoule: workoutCalories,
          max_heart_rate: maxHr,
          strain: workoutStrain,
          zone_durations: {
            zone_five_milli: Math.round(zoneFive),
            zone_four_milli: Math.round(zoneFour),
            zone_one_milli: Math.round(zoneOne),
            zone_three_milli: Math.round(zoneThree),
            zone_two_milli: Math.round(zoneTwo),
            zone_zero_milli: Math.round(zoneZero),
          },
        },
        score_state: "SCORED",
        sport_name: sport,
        start: wStart,
      });
    }

    // Daily Cycle (Strain matches workout days vs rest days)
    const cycleStrain = hasWorkout
      ? Math.min(21, Math.round((workoutStrain + random(2, 4)) * 10) / 10)
      : Math.round(random(3.5, 9.5) * 10) / 10;
    // in kJ
    const cycleCalories = Math.round(
      (random(1750, 2350) + (hasWorkout ? workoutCalories / 4.184 : 0)) * 4.184
    );
    const cycleAvgHr = Math.round(random(58, 78));
    const cycleMaxHr = hasWorkout
      ? Math.round(random(160, 190))
      : Math.round(random(105, 135));

    cycles.push({
      score: {
        average_heart_rate: cycleAvgHr,
        kilojoule: cycleCalories,
        max_heart_rate: cycleMaxHr,
        strain: cycleStrain,
      },
      score_state: "SCORED",
      // Midnight-to-midnight cycle
      start: getPastDate(i, 0),
    });
  }

  return { cycles, recoveries, sleeps, workouts };
};

export const whoopData = generateMockData();
