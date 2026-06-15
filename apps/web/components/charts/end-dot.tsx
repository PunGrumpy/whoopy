"use client";

export const makeEndDot =
  (stroke: string, length: number) =>
  (props: { cx?: number; cy?: number; index?: number }) => {
    if (props.index !== length - 1) {
      return null;
    }

    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        fill="var(--background)"
        r={4}
        stroke={stroke}
        strokeWidth={2}
      />
    );
  };
