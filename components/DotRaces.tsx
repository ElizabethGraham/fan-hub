"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Dot = "red" | "green" | "blue";
type Phase = "pick" | "racing" | "result";

const DOTS: Record<
  Dot,
  {
    label: string;
    fill: string;
    bg: string;
    border: string;
    text: string;
    ring: string;
  }
> = {
  red: {
    label: "Red",
    fill: "#ef4444",
    bg: "bg-red-500",
    border: "border-red-500/60",
    text: "text-red-200",
    ring: "ring-red-500/30",
  },
  green: {
    label: "Green",
    fill: "#22c55e",
    bg: "bg-green-500",
    border: "border-green-500/60",
    text: "text-emerald-200",
    ring: "ring-emerald-500/30",
  },
  blue: {
    label: "Blue",
    fill: "#3b82f6",
    bg: "bg-blue-500",
    border: "border-blue-500/60",
    text: "text-blue-200",
    ring: "ring-blue-500/30",
  },
};

const ORDER: Dot[] = ["red", "green", "blue"];
const RACE_MS = 8_000;

function pickWinner(): Dot {
  return ORDER[Math.floor(Math.random() * ORDER.length)];
}

function progressFor(dot: Dot, elapsed: number, winner: Dot): number {
  const t = Math.min(elapsed / RACE_MS, 1);
  const idx = ORDER.indexOf(dot);
  const wave =
    Math.sin(t * Math.PI * 4.8 + idx * 1.7) * 7 +
    Math.sin(t * Math.PI * 9.2 + idx * 0.9) * 3.5;
  const earlyLaneBias = [2.5, 8, 4][idx] * (1 - t);
  const winnerKick = dot === winner ? Math.max(0, t - 0.68) * 58 : 0;
  const fadeOthers = dot === winner ? 0 : Math.max(0, t - 0.78) * 18;
  const base = t * 86;

  if (t >= 1) return dot === winner ? 100 : 88 + idx * 2;
  return Math.max(
    3,
    Math.min(96, base + wave + earlyLaneBias + winnerKick - fadeOthers),
  );
}

export default function DotRaces() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [pick, setPick] = useState<Dot | null>(null);
  const [winner, setWinner] = useState<Dot | null>(null);
  const [progress, setProgress] = useState<Record<Dot, number>>({
    red: 4,
    green: 4,
    blue: 4,
  });
  const winnerRef = useRef<Dot | null>(null);
  const pickRef = useRef<Dot | null>(null);

  function startRace(chosen: Dot) {
    if (phase === "racing") return;

    const selectedWinner = pickWinner();
    winnerRef.current = selectedWinner;
    pickRef.current = chosen;
    setWinner(selectedWinner);
    setPick(chosen);
    setProgress({ red: 4, green: 4, blue: 4 });
    setPhase("racing");
  }

  useEffect(() => {
    if (phase !== "racing" || !winnerRef.current) return;
    const started = Date.now();
    let frame = 0;

    function updateRace() {
      const elapsed = Date.now() - started;
      const raceWinner = winnerRef.current;
      if (!raceWinner) return;

      setProgress({
        red: progressFor("red", elapsed, raceWinner),
        green: progressFor("green", elapsed, raceWinner),
        blue: progressFor("blue", elapsed, raceWinner),
      });

      if (elapsed >= RACE_MS) {
        setPhase("result");

        if (raceWinner === pickRef.current) {
          const colors = [
            "#ef4444",
            "#22c55e",
            "#3b82f6",
            "#00b2a9",
            "#e8338a",
            "#f58220",
          ];
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.58 },
            colors,
          });
          setTimeout(
            () =>
              confetti({
                particleCount: 55,
                spread: 90,
                origin: { y: 0.42, x: 0.35 },
                colors,
              }),
            180,
          );
          setTimeout(
            () =>
              confetti({
                particleCount: 55,
                spread: 90,
                origin: { y: 0.42, x: 0.65 },
                colors,
              }),
            320,
          );
        }
        return;
      }

      frame = window.requestAnimationFrame(updateRace);
    }

    frame = window.requestAnimationFrame(updateRace);

    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  function reset() {
    setPhase("pick");
    setPick(null);
    setWinner(null);
    setProgress({ red: 4, green: 4, blue: 4 });
    winnerRef.current = null;
    pickRef.current = null;
  }

  const correct = phase === "result" && winner === pick;

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black text-ui-muted uppercase tracking-widest leading-none">
            Fan Zone
          </p>
          <h2 className="mt-1 text-base font-black text-white leading-snug">
            Valero Dot Race
          </h2>
          <p className="mt-1 text-xs text-ui-muted">
            Pick a dot before the in-arena sprint starts.
          </p>
        </div>
        {phase === "result" ? (
          <button
            onClick={reset}
            className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-bold text-ui-muted transition hover:border-zinc-500 hover:text-white"
          >
            Race again
          </button>
        ) : (
          <div className="rounded-full border border-zinc-700/70 px-2.5 py-1 text-right text-[9px] font-black uppercase tracking-widest text-ui-muted">
            Pick one
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {ORDER.map((dot) => {
          const selected = pick === dot;
          return (
            <div key={dot}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${DOTS[dot].bg} ${
                      phase === "racing" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="text-xs font-black text-white">
                    {DOTS[dot].label}
                  </span>
                  {selected && (
                    <span className="rounded-full border border-fiesta-teal/30 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-fiesta-teal">
                      Your pick
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tabular-nums text-ui-muted">
                  {phase === "pick" ? "Ready" : `${Math.round(progress[dot])}%`}
                </span>
              </div>
              <div className="relative h-10 overflow-hidden rounded-full border border-zinc-800 bg-zinc-950 shadow-inner sm:h-9">
                <div className="absolute inset-y-0 left-1/4 w-px bg-white/[0.04]" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" />
                <div className="absolute inset-y-0 left-3/4 w-px bg-white/[0.04]" />
                <div className="absolute bottom-1 top-1 right-6 w-px bg-white/30 sm:right-5" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-ui-faint">
                  End
                </div>
                <div
                  className="absolute left-0 top-0 h-full rounded-full opacity-20 transition-[width] duration-100 ease-linear will-change-[width]"
                  style={{
                    width: `${progress[dot]}%`,
                    background: DOTS[dot].fill,
                  }}
                />
                <div className="absolute inset-y-0 left-3 right-8 sm:left-3 sm:right-7">
                  <div
                    className={`absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-zinc-950 shadow-lg ring-4 will-change-[left] ${DOTS[dot].border} ${DOTS[dot].ring}`}
                    style={{
                      left: `${progress[dot]}%`,
                      transition: "left 100ms linear",
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{ background: DOTS[dot].fill }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {phase === "pick" && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {ORDER.map((dot) => (
            <button
              key={dot}
              onClick={() => startRace(dot)}
              className={`rounded-xl border bg-zinc-950/50 px-2 py-3 text-xs font-black text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 ${DOTS[dot].border} ${DOTS[dot].ring}`}
            >
              <span
                className={`mx-auto mb-1 block h-3 w-3 rounded-full ${DOTS[dot].bg}`}
              />
              <span className={DOTS[dot].text}>{DOTS[dot].label}</span>
            </button>
          ))}
        </div>
      )}

      {phase === "racing" && pick && (
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-center text-xs font-bold text-ui-muted">
          Your pick:{" "}
          <span className={`font-black ${DOTS[pick].text}`}>
            {DOTS[pick].label}
          </span>
        </div>
      )}

      {phase === "result" && winner && pick && (
        <div
          className={`mt-5 rounded-xl border p-3 ${
            correct
              ? "border-emerald-800/50 bg-emerald-950/30"
              : "border-zinc-800 bg-zinc-950/50"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black text-white">
                {DOTS[winner].label} wins the race.
              </div>
              <p className="mt-1 text-xs text-ui-muted">
                {correct
                  ? "Good pick. That one would hit on the big board."
                  : `${DOTS[pick].label} had a run, but ${DOTS[winner].label} closed it out.`}
              </p>
            </div>
            <div
              className={`h-8 w-8 rounded-full ring-4 ${DOTS[winner].ring}`}
              style={{ background: DOTS[winner].fill }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
