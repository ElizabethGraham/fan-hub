import type { HomePageData } from '@/lib/homePageData';
import type { GameDetailPageData } from '@/lib/gameDetailData';
import type {
  GameDisplay,
  NBAGameChartData,
  NBAPlayer,
  NBAPlayerStats,
} from '@/lib/types';

export function isMockApiMode(): boolean {
  if (process.env.NODE_ENV === 'test') return false;
  return process.env.MOCK_API === '1' || process.env.MOCK_API === 'true';
}

function centralToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
  }).format(new Date());
}

const today = centralToday();

const chartData: NBAGameChartData = {
  homeStats: { fgPct: 48.2, fg3Pct: 36.5, reb: 44, ast: 28, stl: 8, tov: 12 },
  awayStats: { fgPct: 45.1, fg3Pct: 34.2, reb: 41, ast: 24, stl: 7, tov: 14 },
  periods: [
    {
      label: 'Q1',
      home: 28,
      away: 24,
      homeStats: { fgPct: 50, fg3Pct: 40, reb: 12, ast: 7, stl: 2, tov: 3 },
      awayStats: { fgPct: 43, fg3Pct: 32, reb: 10, ast: 5, stl: 1, tov: 4 },
    },
    {
      label: 'Q2',
      home: 30,
      away: 31,
      homeStats: { fgPct: 47, fg3Pct: 34, reb: 11, ast: 8, stl: 2, tov: 4 },
      awayStats: { fgPct: 48, fg3Pct: 38, reb: 12, ast: 7, stl: 2, tov: 3 },
    },
  ],
};

const games: GameDisplay[] = [
  {
    id: 'mock-live',
    date: today,
    time: '7:30 PM CT',
    status: 'live',
    homeTeam: { id: 'sas-team', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'nyk-team', alias: 'NYK', name: 'Knicks', market: 'New York' },
    homeTeamScore: 58,
    awayTeamScore: 55,
    preview: {
      headline: 'San Antonio Spurs vs New York Knicks - Live',
      keyMatchup:
        'Spurs host the Knicks; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'mock-upcoming',
    date: '2090-06-10',
    time: '8:00 PM CT',
    status: 'scheduled',
    homeTeam: { id: 'okc-team', alias: 'OKC', name: 'Thunder', market: 'Oklahoma City' },
    awayTeam: { id: 'sas-team', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: {
      headline: 'Oklahoma City Thunder vs San Antonio Spurs - Upcoming',
      keyMatchup:
        'Spurs visit the Oklahoma City Thunder; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'mock-final',
    date: '2026-06-01',
    time: null,
    status: 'final',
    homeTeam: { id: 'sas-team', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'min-team', alias: 'MIN', name: 'Timberwolves', market: 'Minnesota' },
    homeTeamScore: 112,
    awayTeamScore: 108,
    preview: {
      headline: 'San Antonio Spurs vs Minnesota Timberwolves - Final',
      keyMatchup:
        'Spurs host the Minnesota Timberwolves; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
];

const homePlayers: NBAPlayer[] = [
  {
    id: 1,
    srId: 'mock-victor',
    reference: '1641705',
    first_name: 'Victor',
    last_name: 'Wembanyama',
    position: 'C',
    jersey_number: '1',
    height: '7-4',
    weight: '235',
    depthChartRank: 1,
    seasonPpg: 25.4,
    seasonRpg: 11.8,
    seasonApg: 4.2,
    seasonSpg: 1.2,
    seasonTov: 3.0,
    seasonFgPct: 49.1,
    seasonFg3Pct: 35.8,
  },
  {
    id: 2,
    srId: 'mock-castle',
    reference: '1642264',
    first_name: 'Stephon',
    last_name: 'Castle',
    position: 'G',
    jersey_number: '5',
    height: '6-6',
    weight: '215',
    depthChartRank: 2,
    seasonPpg: 16.1,
    seasonRpg: 4.8,
    seasonApg: 5.4,
    seasonSpg: 1.1,
    seasonTov: 2.1,
    seasonFgPct: 45.2,
    seasonFg3Pct: 34.4,
  },
];

const awayPlayers: NBAPlayer[] = [
  {
    id: 11,
    srId: 'mock-brunson',
    reference: '1628973',
    first_name: 'Jalen',
    last_name: 'Brunson',
    position: 'G',
    jersey_number: '11',
    height: '6-2',
    weight: '190',
    depthChartRank: 1,
    seasonPpg: 27.8,
    seasonRpg: 3.5,
    seasonApg: 6.4,
  },
  {
    id: 12,
    srId: 'mock-towns',
    reference: '1626157',
    first_name: 'Karl-Anthony',
    last_name: 'Towns',
    position: 'C',
    jersey_number: '32',
    height: '7-0',
    weight: '248',
    depthChartRank: 2,
    seasonPpg: 24.1,
    seasonRpg: 10.2,
    seasonApg: 3.1,
  },
];

function statsFor(players: NBAPlayer[], home: boolean): NBAPlayerStats[] {
  return players.map((player, index) => ({
    player: {
      id: player.id,
      srId: player.srId,
      reference: player.reference,
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      jersey_number: player.jersey_number,
      starter: true,
    },
    min: index === 0 ? '18:22' : '15:05',
    fgm: home ? 7 - index : 6 - index,
    fga: home ? 12 - index : 13 - index,
    fg_pct: 0,
    fg3m: index === 0 ? 1 : 2,
    fg3a: index === 0 ? 3 : 4,
    fg3_pct: 0,
    ftm: 2,
    fta: 2,
    ft_pct: 1,
    oreb: 1,
    dreb: index === 0 ? 7 : 3,
    reb: index === 0 ? 8 : 4,
    ast: index === 0 ? 3 : 5,
    stl: 1,
    blk: home && index === 0 ? 3 : 0,
    turnover: 2,
    pf: 1,
    pts: home ? 17 - index * 5 : 15 - index * 4,
    plus_minus: home ? 6 : -3,
  }));
}

const homeStats = statsFor(homePlayers, true);
const awayStats = statsFor(awayPlayers, false);

export function getMockSeasonSchedule(): GameDisplay[] {
  return games;
}

export function getMockHomePageData(): HomePageData {
  return {
    sections: {
      featured: games[0],
      live: [],
      recent: [games[2]],
      confirmedUpcoming: [games[1]],
      possibleUpcoming: [],
    },
    playoffSnapshot: {
      wins: 1,
      losses: 0,
      avgPoints: 112,
      avgAllowed: 108,
      avgMargin: 4,
      fgPct: 48.2,
      fg3Pct: 36.5,
      rebounds: 44,
      assists: 28,
      turnovers: 12,
      trend: [
        {
          id: 'mock-final',
          label: 'Game 1',
          seriesLabel: 'Finals: vs NYK',
          opponentAlias: 'NYK',
          spursPoints: 112,
          opponentPoints: 108,
          result: 'W',
          fgPct: 48.2,
          reb: 44,
          ast: 28,
          leaders: [
            {
              key: 'mock-victor',
              name: 'Victor Wembanyama',
              firstName: 'Victor',
              lastName: 'Wembanyama',
              reference: '1641705',
              pts: 27,
              reb: 12,
              ast: 5,
            },
          ],
        },
      ],
      leaders: [
        {
          key: 'mock-victor',
          name: 'Victor Wembanyama',
          firstName: 'Victor',
          lastName: 'Wembanyama',
          reference: '1641705',
          ppg: 27,
          rpg: 12,
          apg: 5,
        },
      ],
    },
  };
}

export function getMockGameDetailPageData(id: string): GameDetailPageData | null {
  const game = games.find((item) => item.id === id);
  if (!game) return null;

  const liveOrFinal = game.status === 'live' || game.status === 'final';
  return {
    game,
    showDotRace: game.status === 'live',
    homeWL: ['W', 'L', 'W', 'W', 'L'],
    awayWL: ['L', 'W', 'L', 'W', 'W'],
    homePlayers,
    awayPlayers,
    homeStats: liveOrFinal ? homeStats : [],
    awayStats: liveOrFinal ? awayStats : [],
    chartData,
  };
}
