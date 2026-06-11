export const RECOVERY_SERIES = {
  hrv: "HRV (ms)",
  rhr: "RHR (bpm)",
  score: "Recovery Score",
  skinTemp: "Skin Temp (°C)",
  spo2: "SpO2",
} as const;

export const SLEEP_SERIES = {
  awake: "Awake",
  consistency: "Consistency %",
  cycles: "Cycles",
  deep: "Deep/SWS",
  disturbances: "Disturbances",
  efficiency: "Efficiency %",
  light: "Light",
  needBaseline: "Need Baseline (h)",
  needDebt: "Need Debt (h)",
  needNap: "Need Nap (h)",
  needStrain: "Need Strain (h)",
  performance: "Performance %",
  rem: "REM",
  respiratoryRate: "Respiratory Rate",
  sleepHours: "Sleep (h)",
} as const;

export const CYCLE_SERIES = {
  avgHr: "Avg HR",
  calories: "Calories",
  maxHr: "Max HR",
  strain: "Strain",
} as const;

export const WORKOUT_COUNT_SERIES = {
  count: "count",
} as const;

export type WhoopScoreState = "SCORED" | "NOT_SCORED";

export interface WhoopRecovery {
  updated_at: string;
  score_state: WhoopScoreState;
  score: {
    recovery_score: number;
    hrv_rmssd_milli: number;
    resting_heart_rate: number;
    spo2_percentage?: number;
    skin_temp_celsius?: number;
  };
}

export interface WhoopSleep {
  start: string;
  score_state: WhoopScoreState;
  score: {
    sleep_performance_percentage: number;
    sleep_efficiency_percentage: number;
    sleep_consistency_percentage: number;
    respiratory_rate: number | null;
    stage_summary?: {
      total_light_sleep_time_milli?: number;
      total_slow_wave_sleep_time_milli?: number;
      total_rem_sleep_time_milli?: number;
      total_awake_time_milli?: number;
      disturbance_count?: number;
      sleep_cycle_count?: number;
    };
    sleep_needed?: {
      baseline_milli?: number;
      need_from_sleep_debt_milli?: number;
      need_from_recent_strain_milli?: number;
      need_from_recent_nap_milli?: number;
    };
  };
  nap?: boolean;
}

export interface WhoopCycle {
  start: string;
  score_state: WhoopScoreState;
  score: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
}

export interface WhoopWorkout {
  start: string;
  end: string;
  sport_name?: string;
  score_state: WhoopScoreState;
  score: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
    distance_meter?: number;
    zone_durations?: {
      zone_zero_milli?: number;
      zone_one_milli?: number;
      zone_two_milli?: number;
      zone_three_milli?: number;
      zone_four_milli?: number;
      zone_five_milli?: number;
    };
  };
}

export interface WhoopData {
  cycles: WhoopCycle[];
  recoveries: WhoopRecovery[];
  sleeps: WhoopSleep[];
  workouts: WhoopWorkout[];
}

export interface RecoveryChartItem {
  date: string;
  [RECOVERY_SERIES.score]: number;
  [RECOVERY_SERIES.hrv]: number;
  [RECOVERY_SERIES.rhr]: number;
  [RECOVERY_SERIES.spo2]?: number;
  [RECOVERY_SERIES.skinTemp]?: number;
}

export interface SleepChartItem {
  date: string;
  [SLEEP_SERIES.awake]: number;
  [SLEEP_SERIES.consistency]: number;
  [SLEEP_SERIES.cycles]: number;
  [SLEEP_SERIES.deep]: number;
  [SLEEP_SERIES.disturbances]: number;
  [SLEEP_SERIES.efficiency]: number;
  [SLEEP_SERIES.light]: number;
  [SLEEP_SERIES.needBaseline]: number;
  [SLEEP_SERIES.needDebt]: number;
  [SLEEP_SERIES.needNap]: number;
  [SLEEP_SERIES.needStrain]: number;
  [SLEEP_SERIES.performance]: number;
  [SLEEP_SERIES.rem]: number;
  [SLEEP_SERIES.respiratoryRate]: number | null;
  [SLEEP_SERIES.sleepHours]: number;
}

export interface CycleChartItem {
  date: string;
  [CYCLE_SERIES.avgHr]: number;
  [CYCLE_SERIES.calories]: number;
  [CYCLE_SERIES.maxHr]: number;
  [CYCLE_SERIES.strain]: number;
}

export interface WorkoutChartItem {
  date: string;
  sport: string;
  duration: number;
  strain: number;
  "Avg HR": number;
  "Max HR": number;
  Calories: number;
  Distance: number;
  "Zone 0 (min)": number;
  "Zone 1 (min)": number;
  "Zone 2 (min)": number;
  "Zone 3 (min)": number;
  "Zone 4 (min)": number;
  "Zone 5 (min)": number;
}

export interface WorkoutCountChartItem {
  count: number;
  date: string;
}
