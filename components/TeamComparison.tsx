import Image from "next/image";
import { isPregameGame } from "@/lib/gameDisplay";
import { teamLogoUrl } from "@/lib/nba";
import type { GameDisplay, TeamDisplay } from "@/lib/types";

type WLResult = "W" | "L";

type Props = {
  game: GameDisplay;
  homeWL: WLResult[];
  awayWL: WLResult[];
};

function WLDots({ record }: { record: WLResult[] }) {
  if (!record.length) return null;
  const displayRecord = [...record].reverse();
  const wins = record.filter((r) => r === "W").length;
  return (
    <div
      className="flex flex-col items-center gap-1.5 mt-1"
      aria-label={`Last ${record.length} games: ${wins} wins and ${record.length - wins} losses`}
    >
      <div className="flex gap-1" aria-hidden="true">
        {displayRecord.map((r, i) => (
          <span
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black ${
              r === "W"
                ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/35"
                : "bg-red-400/10 text-red-300 ring-1 ring-red-400/25"
            }`}
          >
            {r}
          </span>
        ))}
      </div>
      <span className="text-center text-[9px] font-bold text-ui-muted uppercase tracking-wide">
        Last {record.length} · {wins}-{record.length - wins}
      </span>
    </div>
  );
}

function TeamColumn({
  team,
  score,
  wl,
}: {
  team: TeamDisplay;
  score: number | null;
  wl: WLResult[];
}) {
  const fullName = [team.market, team.name].filter(Boolean).join(" ");
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <Image
        src={teamLogoUrl(team.alias)}
        alt={`${fullName} logo`}
        width={64}
        height={64}
        className="object-contain w-12 h-12 sm:w-16 sm:h-16"
      />
      <div className="text-center">
        <div className="font-bold text-white text-xs sm:text-sm leading-snug">
          {fullName}
        </div>
        <div className="text-[10px] sm:text-xs text-ui-muted mt-0.5">
          {team.alias}
        </div>
      </div>
      {score !== null && (
        <div className="text-2xl sm:text-3xl font-black text-fiesta-teal tabular-nums">
          {score}
        </div>
      )}
      <WLDots record={wl} />
    </div>
  );
}

export default function TeamComparison({ game, homeWL, awayWL }: Props) {
  const showScore = !isPregameGame(game.status);

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="text-xs font-black text-ui-muted uppercase tracking-widest mb-4 sm:mb-5">
        Team Comparison
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TeamColumn
          team={game.homeTeam}
          score={showScore ? game.homeTeamScore : null}
          wl={homeWL}
        />
        <TeamColumn
          team={game.awayTeam}
          score={showScore ? game.awayTeamScore : null}
          wl={awayWL}
        />
      </div>
    </section>
  );
}
