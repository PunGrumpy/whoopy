"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MetricTabValue } from "@/lib/analytics/types";

import { AnalyticsEmpty } from "./analytics-empty";
import { SubMetricCard } from "./sub-metric-card";

interface MetricTabSectionProps {
  readonly hasData: boolean;
  readonly tabs: MetricTabValue[];
}

export const MetricTabSection = ({ hasData, tabs }: MetricTabSectionProps) => {
  if (!hasData) {
    return <AnalyticsEmpty className="min-h-48" title="No metrics available" />;
  }

  const defaultTab = tabs.at(0)?.id;

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent className="mt-6" key={tab.id} value={tab.id}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tab.metrics.map((metric) => (
              <SubMetricCard key={metric.title} metric={metric} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
