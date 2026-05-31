import GameCard from "@/components/GameCard";
import Layout from "@/components/Layout";
import { getSeasonSchedule } from "@/lib/schedule";
import { CENTRAL_TIMEZONE, DATE_KEY_LOCALE, SPURS_ALIAS } from "@/lib/constants";
import type { GameDisplay } from "@/lib/types";

function centralToday(): string {
  return new Intl.DateTimeFormat(DATE_KEY_LOCALE, {
    timeZone: CENTRAL_TIMEZONE,
  }).format(new Date());
}

function sortGamesByDate(games: GameDisplay[]): GameDisplay[] {
  const today = centralToday();

  const future = games
    .filter((g) => g.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const current = games
    .filter((g) => g.date === today || g.status === "live")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = games
    .filter((g) => g.date < today && g.status !== "live")
    .sort((a, b) => b.date.localeCompare(a.date));

  return [...past, ...current, ...future];
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

  const sortedGames = sortGamesByDate(games);

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
      ) : games.length > 0 ? (
        <ol className="grid gap-3">
          {sortedGames.map((game, index) => (
            <li key={game.id}>
              <GameCard game={game} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-12">
          <p className="text-ui-muted">No games found for this season.</p>
        </div>
      )}
    </Layout>
  );
}
