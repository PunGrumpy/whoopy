import {
  Activity,
  AudioWaveform,
  Droplets,
  Flame,
  Heart,
  HeartPulse,
  Moon,
  SportShoe,
  User,
  Wind,
} from "lucide-react";

import { ExploreCard } from "./card";
import type { ExploreCardProps } from "./card";

export const METRIC_EXPLORE_ITEMS: ExploreCardProps[] = [
  {
    description: "HRV, recovery score, and daily readiness",
    href: "/dashboard/recovery",
    icon: Heart,
    title: "Recovery",
  },
  {
    description: "Performance, stages, and sleep consistency",
    href: "/dashboard/sleep",
    icon: Moon,
    title: "Sleep",
  },
  {
    description: "Daily strain, calories, and heart rate load",
    href: "/dashboard/cycles",
    icon: Activity,
    title: "Cycles",
  },
  {
    description: "Activities, duration, and sport breakdown",
    href: "/dashboard/workouts",
    icon: SportShoe,
    title: "Workouts",
  },
  {
    description: "Account settings and WHOOP connection",
    href: "/dashboard/profile",
    icon: User,
    title: "Profile",
  },
];

export const HEALTH_EXPLORE_ITEMS: ExploreCardProps[] = [
  {
    description: "Heart rate variability trends",
    href: "/dashboard/recovery",
    icon: AudioWaveform,
    title: "HRV",
  },
  {
    description: "Resting heart rate over time",
    href: "/dashboard/recovery",
    icon: HeartPulse,
    title: "Resting HR",
  },
  {
    description: "Nightly breathing rate",
    href: "/dashboard/sleep",
    icon: Wind,
    title: "Respiratory rate",
  },
  {
    description: "SpO2 from recovery readings",
    href: "/dashboard/recovery",
    icon: Droplets,
    title: "Blood oxygen",
  },
  {
    description: "Time in heart rate zones per workout",
    href: "/dashboard/workouts",
    icon: Flame,
    title: "HR zones",
  },
];

interface ExploreSectionProps {
  items: ExploreCardProps[];
  title: string;
}

export const ExploreSection = ({ items, title }: ExploreSectionProps) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl font-medium">{title}</h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ExploreCard key={item.title} {...item} />
      ))}
    </div>
  </div>
);
