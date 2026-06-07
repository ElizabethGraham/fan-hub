import { detailFixture } from './fixtures';
import { fetchJson } from './apiClient';
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
  try {
    return await fetchJson<GameDetailPageData>(`${API_BASE}/api/mobile/games/${id}`);
  } catch (err) {
    if (err instanceof Error && err.message === 'Request failed: 404') return null;
    throw err;
  }
}
