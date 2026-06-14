import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

interface AnalyticsEmptyProps {
  readonly className?: string;
  readonly description?: string;
  readonly title: string;
}

export const AnalyticsEmpty = ({
  className,
  description = "There is no data for this period.",
  title,
}: AnalyticsEmptyProps) => (
  <Empty className={className}>
    <EmptyHeader>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
);
