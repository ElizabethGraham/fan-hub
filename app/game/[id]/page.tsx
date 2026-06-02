import type { Metadata } from "next";
import GameCharts from "@/components/GameCharts";
import JerseyShop from "@/components/JerseyShop";
import KeyMatchup from "@/components/KeyMatchup";
import Layout from "@/components/Layout";
import PlayersToWatch from "@/components/PlayersToWatch";
import StartingLineups from "@/components/StartingLineups";
import TeamComparison from "@/components/TeamComparison";
import {
  getGameDetailMetadata,
  getGameDetailPageData,
} from "@/lib/gameDetailData";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return getGameDetailMetadata(id);
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getGameDetailPageData(id);
  if (!data) return notFound();

  return (
    <Layout>
      <KeyMatchup game={data.game} chartData={data.chartData} />

      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4">
        <TeamComparison
          game={data.game}
          homeWL={data.homeWL}
          awayWL={data.awayWL}
        />

        <StartingLineups
          game={data.game}
          homePlayers={data.homePlayers}
          awayPlayers={data.awayPlayers}
          homeStats={data.homeStats}
          awayStats={data.awayStats}
        />

        <PlayersToWatch
          game={data.game}
          homePlayers={data.homePlayers}
          awayPlayers={data.awayPlayers}
          homeStats={data.homeStats}
          awayStats={data.awayStats}
        />

        <GameCharts
          game={data.game}
          homeStats={data.homeStats}
          awayStats={data.awayStats}
          chartData={data.chartData}
        />

        <JerseyShop />
      </div>
    </Layout>
  );
}
