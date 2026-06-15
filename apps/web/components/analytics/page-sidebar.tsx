"use client";

import { Progress } from "@/components/ui/progress";
import type { AnalyticsMetrics } from "@/lib/analytics/types";
import type { InsightCategory } from "@/lib/insights";

import { DomainInsightsPanel } from "./domain-insights-panel";

interface PageSidebarProps {
  readonly insightCategory: InsightCategory;
  readonly sidebar: AnalyticsMetrics["sidebar"];
}

export const PageSidebar = ({ insightCategory, sidebar }: PageSidebarProps) => (
  <aside className="lg:sticky lg:top-12 lg:self-start">
    <section className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-medium">Summary</h2>
      {sidebar.progress ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {sidebar.progress.label}
            </p>
            <p className="text-sm font-medium tabular-nums">
              {sidebar.progress.display} / {sidebar.progress.max}
            </p>
          </div>
          <Progress
            className="mt-2"
            value={(sidebar.progress.value / sidebar.progress.max) * 100}
          />
        </div>
      ) : null}
      <dl className="mt-6 space-y-4">
        {sidebar.stats.map((stat) => (
          <div
            className="flex items-baseline justify-between gap-3"
            key={stat.label}
          >
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="text-sm font-medium tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
    <DomainInsightsPanel category={insightCategory} />
  </aside>
);
