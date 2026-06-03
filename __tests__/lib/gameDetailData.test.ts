import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameDisplay } from '@/lib/types';

vi.mock('@/lib/schedule', () => ({
  getSeasonSchedule: vi.fn(),
}));

vi.mock('@/lib/nba', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/nba')>()),
  getNBASeasonYear: vi.fn(() => 2025),
}));

vi.mock('@/lib/sportradar', () => ({
  fetchSRDepthChart: vi.fn(),
  fetchSRGameSummary: vi.fn(),
  fetchSRTeamProfile: vi.fn(),
  fetchSRTeamSeasonStats: vi.fn(),
}));

import { getSeasonSchedule } from '@/lib/schedule';
import {
  fetchSRDepthChart,
  fetchSRGameSummary,
  fetchSRTeamProfile,
  fetchSRTeamSeasonStats,
} from '@/lib/sportradar';
import { getGameDetailPageData } from '@/lib/gameDetailData';

const mockSchedule = vi.mocked(getSeasonSchedule);
const mockProfile = vi.mocked(fetchSRTeamProfile);
const mockDepth = vi.mocked(fetchSRDepthChart);
const mockSummary = vi.mocked(fetchSRGameSummary);
const mockSeasonStats = vi.mocked(fetchSRTeamSeasonStats);

const game: GameDisplay = {
  id: 'game-1',
  date: '2090-06-10',
  time: '8:00 PM CT',
  status: 'scheduled',
  homeTeam: {
    id: 'sas-team',
    alias: 'SAS',
    name: 'Spurs',
    market: 'San Antonio',
  },
  awayTeam: {
    id: 'nyk-team',
    alias: 'NYK',
    name: 'Knicks',
    market: 'New York',
  },
  homeTeamScore: 0,
  awayTeamScore: 0,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Upcoming',
    keyMatchup: 'Spurs host the Knicks.',
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getGameDetailPageData', () => {
  it('builds pregame chart data from team season averages', async () => {
    mockSchedule.mockResolvedValue([game]);
    mockProfile.mockImplementation(async (teamId) => ({
      id: teamId,
      players: [
        {
          id: `${teamId}-player`,
          full_name: teamId === 'sas-team' ? 'Victor Wembanyama' : 'Jalen Brunson',
          first_name: teamId === 'sas-team' ? 'Victor' : 'Jalen',
          last_name: teamId === 'sas-team' ? 'Wembanyama' : 'Brunson',
          primary_position: 'G',
          jersey_number: teamId === 'sas-team' ? '1' : '11',
        },
      ],
    }));
    mockDepth.mockResolvedValue({ team: { depth_chart: [] } });
    mockSeasonStats.mockImplementation(async (teamId) => ({
      id: teamId,
      own_record: {
        total: {
          field_goals_pct: teamId === 'sas-team' ? 0.483 : 0.45,
          three_points_pct: teamId === 'sas-team' ? 0.359 : 0.37,
        },
        average: {
          rebounds: teamId === 'sas-team' ? 47 : 43,
          assists: teamId === 'sas-team' ? 28 : 24,
          steals: teamId === 'sas-team' ? 8 : 7,
          turnovers: teamId === 'sas-team' ? 13 : 12,
        },
      },
      players: [
        {
          id: `${teamId}-player`,
          total: { field_goals_pct: 0.5, three_points_pct: 0.35 },
          average: {
            points: teamId === 'sas-team' ? 25 : 28,
            rebounds: 5,
            assists: 5,
            steals: 1,
            turnovers: 2,
          },
        },
      ],
    }));

    const data = await getGameDetailPageData(game.id);

    expect(data?.chartData).toEqual({
      homeStats: {
        fgPct: 48.3,
        fg3Pct: 35.9,
        reb: 47,
        ast: 28,
        stl: 8,
        tov: 13,
      },
      awayStats: {
        fgPct: 45,
        fg3Pct: 37,
        reb: 43,
        ast: 24,
        stl: 7,
        tov: 12,
      },
      periods: [],
    });
    expect(data?.homePlayers[0]).toMatchObject({
      seasonPpg: 25,
      seasonFgPct: 50,
      seasonFg3Pct: 35,
    });
    expect(data?.showDotRace).toBe(true);
    expect(mockSummary).not.toHaveBeenCalled();
  });

  it('does not show dot race for a non-featured completed game', async () => {
    const finalGame: GameDisplay = {
      ...game,
      id: 'final-game',
      date: '2026-06-01',
      status: 'final',
      homeTeamScore: 110,
      awayTeamScore: 104,
    };
    mockSchedule.mockResolvedValue([game, finalGame]);
    mockProfile.mockResolvedValue({ id: 'team', players: [] });
    mockSummary.mockRejectedValue(new Error('summary unavailable'));

    const data = await getGameDetailPageData(finalGame.id);

    expect(data?.showDotRace).toBe(false);
  });

  it('returns null when the game id is not in the schedule', async () => {
    mockSchedule.mockResolvedValue([game]);

    await expect(getGameDetailPageData('missing-game')).resolves.toBeNull();
  });
});
