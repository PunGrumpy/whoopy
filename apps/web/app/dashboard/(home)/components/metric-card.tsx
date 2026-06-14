"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly href: string;
  readonly title: string;
  readonly value: ReactNode;
}

export const MetricCard = ({
  children,
  className,
  href,
  title,
  value,
}: MetricCardProps) => (
  <div className={cn("col-span-1 border-b p-4", className)}>
    <div className="flex h-full flex-col">
      <Link
        className="flex items-center text-sm text-muted-foreground hover:underline"
        href={href}
      >
        {title}
        <ChevronRight className="mt-0.5 size-4" />
      </Link>
      <p className="text-lg font-medium">{value}</p>
      {children}
    </div>
  </div>
);
