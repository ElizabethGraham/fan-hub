import GameCard from "@/components/GameCard";
import Layout from "@/components/Layout";
import { getSeasonSchedule } from "@/lib/schedule";
import { CENTRAL_TIMEZONE, DATE_KEY_LOCALE, SPURS_ALIAS } from "@/lib/constants";
import { gameSpotlightLabel, isPossibleGame } from "@/lib/gameDisplay";
import type {
  GameDisplay,
} from "@/lib/types";

function centralToday(): string {
  return new Intl.DateTimeFormat(DATE_KEY_LOCALE, {
    timeZone: CENTRAL_TIMEZONE,
  }).format(new Date());
}

function byDateAsc(a: GameDisplay, b: GameDisplay): number {
  return a.date.localeCompare(b.date);
}

function byDateDesc(a: GameDisplay, b: GameDisplay): number {
  return b.date.localeCompare(a.date);
}

function sectionGames(games: GameDisplay[]) {
  const today = centralToday();
  const live = games.filter((g) => g.status === "live").sort(byDateAsc);
  const recent = games.filter((g) => g.status === "final").sort(byDateDesc);
  const confirmedUpcoming = games
    .filter(
      (g) => g.status === "scheduled" && g.date >= today && !isPossibleGame(g),
    )
    .sort(byDateAsc);
  const possibleUpcoming = games
    .filter((g) => g.date >= today && isPossibleGame(g))
    .sort(byDateAsc);

  const featured =
    live[0] ??
    confirmedUpcoming[0] ??
    recent[0] ??
    possibleUpcoming[0] ??
    games[0] ??
    null;
  const withoutFeatured = (game: GameDisplay) => game.id !== featured?.id;

  return {
    featured,
    live: live.filter(withoutFeatured),
    recent: recent.filter(withoutFeatured).slice(0, 3),
    confirmedUpcoming: confirmedUpcoming.filter(withoutFeatured).slice(0, 5),
    possibleUpcoming: possibleUpcoming.filter(withoutFeatured).slice(0, 5),
  };
}

function Section({
  title,
  description,
  games,
}: {
  title: string;
  description?: string;
  games: GameDisplay[];
}) {
  if (games.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xs font-black text-ui-muted uppercase tracking-widest">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs text-ui-muted">{description}</p>
          )}
        </div>
      </div>
      <div className="grid gap-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

function NextUp({ game }: { game: GameDisplay }) {
  return (
    <section>
      <div className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-black text-fiesta-teal uppercase tracking-widest">
            {gameSpotlightLabel(game)}
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

export default async function Home() {
  let games: GameDisplay[] = [];
  let error = false;

  try {
    const all = await getSeasonSchedule();
    games = all.filter(
      (g) =>
        g.homeTeam.alias === SPURS_ALIAS || g.awayTeam.alias === SPURS_ALIAS,
    );
  } catch (err) {
    console.error("[Home] getSeasonSchedule failed:", err);
    error = true;
  }

  const sections = sectionGames(games);

  return (
    <Layout>
      {error ? (
        <div className="surface-panel p-6 text-center">
          <div className="text-2xl mb-2">⏱</div>
          <div className="font-black text-white text-sm mb-1">
            Schedule unavailable
          </div>
          <div className="text-xs text-ui-muted">
            Could not reach the Sportradar API.
            <br />
            Refresh in a moment — once loaded, results are cached for the
            season.
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {sections.featured ? (
            <>
              <NextUp game={sections.featured} />

              <Section
                title="Live Updates"
                description="Games in progress right now."
                games={sections.live}
              />

              <Section
                title="Recent Results"
                description="Latest completed games."
                games={sections.recent}
              />

              <Section
                title="Upcoming games"
                description="Next scheduled matchups."
                games={sections.confirmedUpcoming}
              />

              <Section
                title="Possible Games"
                description="Conditional playoff dates."
                games={sections.possibleUpcoming}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-ui-muted">No games found for this season.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
