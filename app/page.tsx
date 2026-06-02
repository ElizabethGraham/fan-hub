import type { Metadata } from "next";
import { connection } from "next/server";
import FeaturedGame from "@/components/FeaturedGame";
import GameSection from "@/components/GameSection";
import Layout from "@/components/Layout";
import PlayoffSnapshot from "@/components/PlayoffSnapshot";
import { getHomePageData } from "@/lib/homePageData";
import { logServerError } from "@/lib/serverLogger";

export const metadata: Metadata = {
  title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
  description:
    "Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats.",
  openGraph: {
    title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
    description:
      "Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
    description:
      "Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats.",
  },
};

export default async function Home() {
  await connection();

  let data: Awaited<ReturnType<typeof getHomePageData>> | null = null;
  let error = false;

  try {
    data = await getHomePageData();
  } catch (err) {
    logServerError("home.page_data_failed", err);
    error = true;
  }

  return (
    <Layout>
      {error || !data ? (
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
          {data.sections.featured ? (
            <>
              <FeaturedGame game={data.sections.featured} />

              {data.playoffSnapshot && (
                <PlayoffSnapshot data={data.playoffSnapshot} />
              )}

              <GameSection
                title="Live Updates"
                description="Games in progress right now."
                games={data.sections.live}
              />

              <GameSection
                title="Recent Results"
                description="Latest completed games."
                games={data.sections.recent}
              />

              <GameSection
                title="Upcoming games"
                description="Next scheduled matchups."
                games={data.sections.confirmedUpcoming}
              />

              <GameSection
                title="Possible Games"
                description="Conditional playoff dates."
                games={data.sections.possibleUpcoming}
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
