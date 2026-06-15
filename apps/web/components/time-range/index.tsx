"use client";

import { motion } from "motion/react";
import { useId } from "react";

import { TIME_RANGES } from "@/lib/charts/data";
import type { TimeRange } from "@/lib/charts/data";
import { cn } from "@/lib/utils";

import { useTimeRange } from "./context";

interface TimeRangeSelectorControlProps {
  readonly className?: string;
  readonly onValueChange: (value: TimeRange) => void;
  readonly value: TimeRange;
}

const TimeRangeSelectorControl = ({
  className,
  onValueChange,
  value,
}: TimeRangeSelectorControlProps) => {
  const id = useId();

  return (
    <fieldset
      className={cn(
        "relative m-0 inline-flex min-w-0 shrink-0 items-center rounded-full border-0 bg-muted p-0.5",
        className
      )}
    >
      <legend className="sr-only">Time range</legend>
      {TIME_RANGES.map((option) => (
        <label
          className={cn(
            "relative flex h-7 cursor-pointer items-center rounded-full px-3 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
            value === option
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          )}
          key={option}
        >
          <input
            aria-labelledby={`${id}-${option}-label`}
            checked={value === option}
            className="sr-only"
            id={`${id}-${option}`}
            name={id}
            onChange={() => onValueChange(option)}
            type="radio"
            value={option}
          />
          {value === option ? (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-background shadow-sm"
              layoutId={id}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null}
          <span className="relative z-10" id={`${id}-${option}-label`}>
            {option}
          </span>
        </label>
      ))}
    </fieldset>
  );
};

export const TimeRangeSelector = () => {
  const { range, setRange } = useTimeRange();

  return <TimeRangeSelectorControl onValueChange={setRange} value={range} />;
};
