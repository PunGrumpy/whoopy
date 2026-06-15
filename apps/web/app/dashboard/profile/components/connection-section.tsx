interface ConnectionSectionProps {
  readonly userId: string;
}

export const ConnectionSection = ({ userId }: ConnectionSectionProps) => (
  <section className="rounded-lg border bg-card p-6">
    <h2 className="text-lg font-medium">WHOOP Connection</h2>
    <dl className="mt-4 space-y-4">
      <div className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-4 text-sm">
        <dt className="text-muted-foreground">WHOOP User ID</dt>
        <dd className="font-medium font-mono">{userId}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <dt className="text-muted-foreground">Account Status</dt>
        <dd>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 text-xs dark:bg-emerald-950 dark:text-emerald-300">
            Connected
          </span>
        </dd>
      </div>
    </dl>
  </section>
);
