"use client";

import type { ReactElement } from "react";
import { Tooltip } from "recharts";

import { recoveryLineColor, TOOLTIP_CURSOR } from "@/lib/charts/data";
import { RECOVERY_SERIES } from "@/lib/charts/types";
import type { RecoveryChartItem } from "@/lib/charts/types";
import { cn } from "@/lib/utils";

interface MetricTooltipRow {
  color: string;
  label: string;
  value: string | number;
}

interface TooltipPayloadEntry<T> {
  color?: string;
  dataKey?: string | number;
  payload?: T;
  value?: number | string;
}

interface ChartTooltipContentProps<T> {
  active?: boolean;
  payload?: TooltipPayloadEntry<T>[];
}

interface MetricChartTooltipProps {
  readonly className?: string;
  readonly date: string;
  readonly headline: string;
  readonly rows: MetricTooltipRow[];
}

const MetricChartTooltip = ({
  className,
  date,
  headline,
  rows,
}: MetricChartTooltipProps) => (
  <div
    className={cn(
      "min-w-48 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-lg",
      className
    )}
  >
    <p className="text-muted-foreground">{date}</p>
    <p className="font-medium">{headline}</p>
    <div className="my-2 border-t" />
    <div className="space-y-1.5">
      {rows.map((row) => (
        <div
          className="flex items-center justify-between gap-4"
          key={row.label}
        >
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: row.color }}
            />
            <span>{row.label}</span>
          </div>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const getPointDate = (payload: { date: string } | undefined) =>
  payload?.date ?? "";

interface ChartTooltipProps {
  readonly content: ReactElement;
}

export const ChartTooltip = ({ content }: ChartTooltipProps) => (
  <Tooltip
    content={content}
    cursor={TOOLTIP_CURSOR}
    isAnimationActive={false}
  />
);

const resolveTooltipPoint = <T extends { date: string }>(
  active: boolean | undefined,
  payload: TooltipPayloadEntry<T>[] | undefined
) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return {
    entries: payload,
    point,
    value: payload[0]?.value ?? 0,
  };
};

export const RecoveryTooltipContent = ({
  active,
  payload,
}: ChartTooltipContentProps<RecoveryChartItem>) => {
  const resolved = resolveTooltipPoint(active, payload);

  if (!resolved) {
    return null;
  }

  const { entries, point } = resolved;
  const score = point?.[RECOVERY_SERIES.score];

  return (
    <MetricChartTooltip
      date={getPointDate(point)}
      headline={`${score} recovery score`}
      rows={entries.map((entry) => ({
        color: recoveryLineColor(String(entry.dataKey)),
        label: String(entry.dataKey),
        value: entry.value ?? 0,
      }))}
    />
  );
};

export const RecoveryChartTooltip = () => (
  <ChartTooltip content={<RecoveryTooltipContent />} />
);

interface SingleSeriesTooltipContentProps<
  T extends { date: string },
> extends ChartTooltipContentProps<T> {
  readonly color: string;
  readonly headlineSuffix: string;
  readonly label: string;
  readonly valueSuffix?: string;
}

export const SingleSeriesTooltipContent = <T extends { date: string }>({
  active,
  color,
  headlineSuffix,
  label,
  payload,
  valueSuffix = "",
}: SingleSeriesTooltipContentProps<T>) => {
  const resolved = resolveTooltipPoint(active, payload);

  if (!resolved) {
    return null;
  }

  const { point, value } = resolved;

  return (
    <MetricChartTooltip
      date={getPointDate(point)}
      headline={`${value}${valueSuffix} ${headlineSuffix}`}
      rows={[
        {
          color,
          label,
          value: `${value}${valueSuffix}`,
        },
      ]}
    />
  );
};

interface SingleSeriesChartTooltipProps {
  readonly color: string;
  readonly headlineSuffix: string;
  readonly label: string;
  readonly valueSuffix?: string;
}

export const SingleSeriesChartTooltip = ({
  color,
  headlineSuffix,
  label,
  valueSuffix,
}: SingleSeriesChartTooltipProps) => (
  <ChartTooltip
    content={
      <SingleSeriesTooltipContent
        color={color}
        headlineSuffix={headlineSuffix}
        label={label}
        valueSuffix={valueSuffix}
      />
    }
  />
);
