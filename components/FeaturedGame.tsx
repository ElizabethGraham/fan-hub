import GameCard from "@/components/GameCard";
import { gameSpotlightLabel } from "@/lib/gameDisplay";
import type { GameDisplay } from "@/lib/types";

export default function FeaturedGame({ game }: { game: GameDisplay }) {
  const spotlightLabel = gameSpotlightLabel(game);

  return (
    <section>
      <div className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            className={`text-xs font-black uppercase tracking-widest ${
              spotlightLabel === "Next Up" ? "text-white" : "text-fiesta-teal"
            }`}
          >
            {spotlightLabel}
          </h2>
        </div>
        <p className="mt-1 text-xs text-ui-muted">
          Start here: the most relevant Spurs game for fans right now.
        </p>
      </div>
      <GameCard game={game} />
    </section>
  );
}
