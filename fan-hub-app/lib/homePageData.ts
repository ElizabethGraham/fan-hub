import { homeFixture } from './fixtures';
import type { PlayoffSnapshotData } from '../components/PlayoffSnapshot';
import type { GameDisplay } from './types';

export type HomeGameSections = {
  featured: GameDisplay | null;
  live: GameDisplay[];
  recent: GameDisplay[];
  confirmedUpcoming: GameDisplay[];
  possibleUpcoming: GameDisplay[];
};

export type HomePageData = {
  sections: HomeGameSections;
  playoffSnapshot: PlayoffSnapshotData | null;
};

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
const MOCK_API = process.env.EXPO_PUBLIC_MOCK_API === '1';

export async function getHomePageData(): Promise<HomePageData> {
  if (MOCK_API || !API_BASE) return homeFixture;
  const res = await fetch(`${API_BASE}/api/mobile/home`);
  if (!res.ok) throw new Error(`Home data failed: ${res.status}`);
  return res.json();
}
