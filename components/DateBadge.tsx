function parseParts(dateStr: string) {
  // Parse manually to avoid UTC→local timezone shift that Date("YYYY-MM-DD") causes
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(dt)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(dt),
  };
}

export default function DateBadge({ date }: { date: string }) {
  const parts = parseParts(date);

  return (
    <div className="inline-flex flex-col items-center bg-zinc-800/70 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 min-w-[2.75rem]">
      <span className="text-[8px] font-black text-ui-muted uppercase tracking-widest leading-none">
        {parts.month}
      </span>
      <span className="text-[15px] font-black text-white leading-tight tabular-nums">
        {parts.day}
      </span>
    </div>
  );
}
