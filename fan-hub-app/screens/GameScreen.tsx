import DotRaces from '../components/DotRaces';
import { FanShopCarousel } from '../components/FanShop';
import GameCharts from '../components/GameCharts';
import KeyMatchup from '../components/KeyMatchup';
import PlayersToWatch from '../components/PlayersToWatch';
import StartingLineups from '../components/StartingLineups';
import TeamComparison from '../components/TeamComparison';
import type { DotRaceOutcome } from '../components/DevPanel';
import type { GameDetailPageData } from '../lib/gameDetailData';

export default function GameScreen({
  data,
  dotRaceOutcome,
  onShopOpen,
}: {
  data: GameDetailPageData;
  dotRaceOutcome: DotRaceOutcome;
  onShopOpen: (itemId: string) => void;
}) {
  return (
    <>
      <KeyMatchup game={data.game} chartData={data.chartData} />
      <TeamComparison game={data.game} homeWL={data.homeWL} awayWL={data.awayWL} />
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
      <GameCharts game={data.game} chartData={data.chartData} />
      <FanShopCarousel onOpen={onShopOpen} />
      {data.showDotRace && <DotRaces forcedOutcome={dotRaceOutcome} />}
    </>
  );
}
