"use client";

import type { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

interface MiniChartProps {
  readonly children: ReactNode;
}

export const MiniChart = ({ children }: MiniChartProps) => (
  <div className="flex flex-1 items-center justify-center">
    <ResponsiveContainer height={44} width="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

interface TrendChartProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export const TrendChart = ({ children, className }: TrendChartProps) => (
  <div className={className ?? "mt-2 h-48 w-full"}>
    <ResponsiveContainer height="100%" width="100%">
      {children}
    </ResponsiveContainer>
  </div>
);
