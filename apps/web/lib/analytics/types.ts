import type { InsightCategory } from "@/lib/insights";

export type AnalyticsDomain = "recovery" | "sleep" | "cycles" | "workouts";

export type AnalyticsChartPoint = Record<
  string,
  string | number | null | undefined
>;

export type AnalyticsChartData = AnalyticsChartPoint[];

export type ChartType = "area" | "bar" | "line";

export type MetricFormat = "hours" | "number" | "percent" | "text";

export interface SubMetricDef {
  chartType: ChartType | "none";
  color?: string;
  format?: MetricFormat;
  key: string;
  title: string;
  tooltipLabel?: string;
  tooltipSuffix?: string;
  valueSuffix?: string;
}

export interface MetricTabDef {
  id: string;
  label: string;
  metrics: SubMetricDef[];
}

export interface SidebarProgressDef {
  currentKey: string;
  format?: MetricFormat;
  label: string;
  max: number;
  valueSuffix?: string;
}

export interface SidebarStatDef {
  format?: MetricFormat;
  key: string;
  label: string;
  suffix?: string;
}

export interface HeroChartDef {
  chartType: ChartType;
  color: string;
  seriesKey: string;
  summaryFormat?: MetricFormat;
  summaryKey: string;
  title: string;
  tooltipLabel: string;
  tooltipSuffix: string;
  valueSuffix?: string;
}

export interface AnalyticsPageConfig {
  domain: AnalyticsDomain;
  hero: HeroChartDef;
  insightCategory: InsightCategory;
  sidebar: {
    progress?: SidebarProgressDef;
    stats: SidebarStatDef[];
  };
  tabs: MetricTabDef[];
}

export interface SubMetricValue {
  chartData: AnalyticsChartData;
  chartType: ChartType | "none";
  color?: string;
  seriesKey: string;
  title: string;
  tooltipLabel?: string;
  tooltipSuffix?: string;
  value: string;
  valueSuffix?: string;
}

export interface MetricTabValue {
  id: string;
  label: string;
  metrics: SubMetricValue[];
}

export interface SidebarProgressValue {
  display: string;
  label: string;
  max: number;
  value: number;
}

export interface SidebarStatValue {
  label: string;
  value: string;
}

export interface HeroChartValue {
  chartData: AnalyticsChartData;
  chartType: ChartType;
  color: string;
  seriesKey: string;
  summary: string;
  title: string;
  tooltipLabel: string;
  tooltipSuffix: string;
  valueSuffix?: string;
}

export interface AnalyticsMetrics {
  hasData: boolean;
  hero: HeroChartValue;
  sidebar: {
    progress?: SidebarProgressValue;
    stats: SidebarStatValue[];
  };
  tabs: MetricTabValue[];
}
