import { detailFixture } from './fixtures';
import type {
  GameDisplay,
  NBAGameChartData,
  NBAPlayer,
  NBAPlayerStats,
} from './types';

type WLResult = 'W' | 'L';

export type GameDetailPageData = {
  game: GameDisplay;
  showDotRace: boolean;
  homeWL: WLResult[];
  awayWL: WLResult[];
  homePlayers: NBAPlayer[];
  awayPlayers: NBAPlayer[];
  homeStats: NBAPlayerStats[];
  awayStats: NBAPlayerStats[];
  chartData: NBAGameChartData | null;
};

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
const MOCK_API = process.env.EXPO_PUBLIC_MOCK_API === '1';

export async function getGameDetailPageData(id: string): Promise<GameDetailPageData | null> {
  if (MOCK_API || !API_BASE) return detailFixture(id);
  const res = await fetch(`${API_BASE}/api/mobile/games/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Game detail failed: ${res.status}`);
  return res.json();
}
