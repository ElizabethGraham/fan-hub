"use client";

import { useEffect, useState } from "react";

function parseParts(dateStr: string, locale: string) {
  // Parse manually to avoid UTC→local timezone shift that Date("YYYY-MM-DD") causes
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    month: new Intl.DateTimeFormat(locale, { month: "short" })
      .format(dt)
      .toUpperCase(),
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }).format(dt),
  };
}

export default function DateBadge({ date }: { date: string }) {
  // Both SSR and initial client render use "en-US" → no hydration mismatch.
  // After mount, effect switches to the user's actual device locale.
  const [parts, setParts] = useState(() => parseParts(date, "en-US"));

  useEffect(() => {
    // Intentional: first render uses en-US (SSR-safe), then switches to the
    // device locale after hydration. This is the correct pattern to avoid a
    // hydration mismatch when server and client locales differ.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(parseParts(date, navigator.language));
  }, [date]);

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
