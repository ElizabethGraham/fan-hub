import type { GameDisplay, NBAGameChartData, NBAPlayer, NBAPlayerStats } from './types';
import type { GameDetailPageData } from './gameDetailData';
import type { HomePageData } from './homePageData';

export const games: GameDisplay[] = [
  {
    id: 'fixture-live',
    date: '2026-06-07',
    time: '7:30 PM CT',
    status: 'live',
    homeTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'nyk', alias: 'NYK', name: 'Knicks', market: 'New York' },
    homeTeamScore: 58,
    awayTeamScore: 55,
    preview: {
      headline: 'San Antonio Spurs vs New York Knicks - Live',
      keyMatchup:
        'Spurs host the Knicks; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-next',
    date: '2026-06-10',
    time: '8:00 PM CT',
    status: 'scheduled',
    homeTeam: { id: 'okc', alias: 'OKC', name: 'Thunder', market: 'Oklahoma City' },
    awayTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: {
      headline: 'Oklahoma City Thunder vs San Antonio Spurs - Upcoming',
      keyMatchup:
        'Spurs visit the Oklahoma City Thunder; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-next-2',
    date: '2026-06-12',
    time: '6:30 PM CT',
    status: 'scheduled',
    homeTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'lal', alias: 'LAL', name: 'Lakers', market: 'Los Angeles' },
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: {
      headline: 'San Antonio Spurs vs Los Angeles Lakers - Upcoming',
      keyMatchup:
        'Spurs host the Lakers; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-next-3',
    date: '2026-06-15',
    time: '9:00 PM CT',
    status: 'scheduled',
    homeTeam: { id: 'den', alias: 'DEN', name: 'Nuggets', market: 'Denver' },
    awayTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: {
      headline: 'Denver Nuggets vs San Antonio Spurs - Upcoming',
      keyMatchup:
        'Spurs visit the Nuggets; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-final',
    date: '2026-06-01',
    time: null,
    status: 'final',
    homeTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'min', alias: 'MIN', name: 'Timberwolves', market: 'Minnesota' },
    homeTeamScore: 112,
    awayTeamScore: 108,
    preview: {
      headline: 'San Antonio Spurs vs Minnesota Timberwolves - Final',
      keyMatchup:
        'Spurs host the Minnesota Timberwolves; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-final-2',
    date: '2026-05-29',
    time: null,
    status: 'final',
    homeTeam: { id: 'okc', alias: 'OKC', name: 'Thunder', market: 'Oklahoma City' },
    awayTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    homeTeamScore: 101,
    awayTeamScore: 109,
    preview: {
      headline: 'Oklahoma City Thunder vs San Antonio Spurs - Final',
      keyMatchup:
        'Spurs visit the Thunder; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
  {
    id: 'fixture-possible',
    date: '2026-06-18',
    time: null,
    status: 'if-necessary',
    title: 'Game 7 (if necessary)',
    homeTeam: { id: 'sas', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
    awayTeam: { id: 'nyk', alias: 'NYK', name: 'Knicks', market: 'New York' },
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: {
      headline: 'San Antonio Spurs vs New York Knicks - If Necessary',
      keyMatchup:
        'Spurs host the Knicks if necessary; game preview, projected lineups, matchup notes, and key storylines.',
    },
  },
];

const chartData: NBAGameChartData = {
  homeStats: { fgPct: 48.2, fg3Pct: 36.5, reb: 44, ast: 28, stl: 8, tov: 12 },
  awayStats: { fgPct: 45.1, fg3Pct: 34.2, reb: 41, ast: 24, stl: 7, tov: 14 },
  periods: [
    {
      label: 'Q1',
      home: 28,
      away: 24,
      homeStats: { fgPct: 50.0, fg3Pct: 37.5, reb: 12, ast: 8, stl: 3, tov: 4 },
      awayStats: { fgPct: 44.0, fg3Pct: 33.3, reb: 10, ast: 6, stl: 2, tov: 5 },
    },
    {
      label: 'Q2',
      home: 30,
      away: 31,
      homeStats: { fgPct: 46.4, fg3Pct: 35.7, reb: 11, ast: 7, stl: 2, tov: 3 },
      awayStats: { fgPct: 46.2, fg3Pct: 35.0, reb: 12, ast: 8, stl: 3, tov: 4 },
    },
  ],
};

const players: NBAPlayer[] = [
  {
    id: 1,
    srId: 'victor',
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
  },
  {
    id: 2,
    srId: 'castle',
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
  },
  {
    id: 3,
    srId: 'vassell',
    reference: '1630170',
    first_name: 'Devin',
    last_name: 'Vassell',
    position: 'G',
    jersey_number: '24',
    height: '6-5',
    weight: '200',
    depthChartRank: 3,
    seasonPpg: 17.5,
    seasonRpg: 4.0,
    seasonApg: 3.2,
  },
  {
    id: 4,
    srId: 'sochan',
    reference: '1631110',
    first_name: 'Jeremy',
    last_name: 'Sochan',
    position: 'F',
    jersey_number: '10',
    height: '6-8',
    weight: '230',
    depthChartRank: 4,
    seasonPpg: 11.2,
    seasonRpg: 6.4,
    seasonApg: 2.9,
  },
  {
    id: 5,
    srId: 'johnson',
    reference: '1629640',
    first_name: 'Keldon',
    last_name: 'Johnson',
    position: 'F',
    jersey_number: '3',
    height: '6-5',
    weight: '220',
    depthChartRank: 5,
    seasonPpg: 12.8,
    seasonRpg: 5.1,
    seasonApg: 1.7,
  },
  {
    id: 6,
    srId: 'champagnie',
    reference: '1630577',
    first_name: 'Julian',
    last_name: 'Champagnie',
    position: 'F',
    jersey_number: '30',
    height: '6-7',
    weight: '220',
    depthChartRank: 6,
    seasonPpg: 9.4,
    seasonRpg: 3.9,
    seasonApg: 1.3,
  },
];

const stats: NBAPlayerStats[] = players.map((player, index) => ({
  player: { ...player, starter: index < 5 },
  min: ['18:22', '15:05', '16:41', '13:52', '12:34', '8:16'][index] ?? '7:00',
  fgm: [7, 4, 5, 3, 2, 1][index] ?? 1,
  fga: [12, 8, 9, 5, 6, 3][index] ?? 3,
  fg_pct: [7 / 12, 4 / 8, 5 / 9, 3 / 5, 2 / 6, 1 / 3][index] ?? 0,
  fg3m: [1, 2, 2, 0, 1, 1][index] ?? 0,
  fg3a: [3, 4, 4, 1, 3, 2][index] ?? 1,
  fg3_pct: 0,
  ftm: 2,
  fta: 2,
  ft_pct: 1,
  oreb: 1,
  dreb: [7, 3, 2, 5, 3, 2][index] ?? 1,
  reb: [8, 4, 3, 6, 4, 3][index] ?? 2,
  ast: [3, 5, 2, 2, 1, 1][index] ?? 1,
  stl: [1, 1, 0, 2, 1, 0][index] ?? 0,
  blk: [3, 0, 0, 1, 0, 0][index] ?? 0,
  turnover: [2, 2, 1, 1, 1, 0][index] ?? 1,
  pf: 1,
  pts: [17, 12, 14, 8, 7, 5][index] ?? 2,
  plus_minus: [6, 3, 5, 2, -1, 1][index] ?? 0,
}));

export const homeFixture: HomePageData = {
  sections: {
    featured: gameById('fixture-live'),
    live: [],
    recent: gamesById(['fixture-final', 'fixture-final-2']),
    confirmedUpcoming: gamesById(['fixture-next', 'fixture-next-2', 'fixture-next-3']),
    possibleUpcoming: gamesById(['fixture-possible']),
  },
  playoffSnapshot: {
    wins: 3,
    losses: 1,
    avgPoints: 114.8,
    avgAllowed: 107.2,
    avgMargin: 7.6,
    fgPct: 48.2,
    fg3Pct: 36.5,
    rebounds: 44,
    assists: 28,
    turnovers: 12,
    trend: [
      {
        id: 'pulse-1',
        label: 'Game 1',
        roundLabel: 'Finals',
        seriesLabel: 'Finals: vs NYK',
        opponentAlias: 'NYK',
        spursPoints: 109,
        opponentPoints: 101,
        result: 'W',
        fgPct: 47.8,
        reb: 43,
        ast: 27,
        leaders: [
          { key: 'victor-g1', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', reference: '1641705', pts: 31, reb: 14, ast: 5 },
          { key: 'castle-g1', name: 'Stephon Castle', firstName: 'Stephon', lastName: 'Castle', reference: '1642264', pts: 18, reb: 5, ast: 7 },
          { key: 'vassell-g1', name: 'Devin Vassell', firstName: 'Devin', lastName: 'Vassell', reference: '1630170', pts: 17, reb: 3, ast: 4 },
        ],
      },
      {
        id: 'pulse-2',
        label: 'Game 2',
        roundLabel: 'Finals',
        seriesLabel: 'Finals: vs NYK',
        opponentAlias: 'NYK',
        spursPoints: 106,
        opponentPoints: 112,
        result: 'L',
        fgPct: 44.1,
        reb: 39,
        ast: 22,
        leaders: [
          { key: 'victor-g2', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', reference: '1641705', pts: 27, reb: 11, ast: 4 },
          { key: 'johnson-g2', name: 'Keldon Johnson', firstName: 'Keldon', lastName: 'Johnson', reference: '1629640', pts: 16, reb: 5, ast: 2 },
          { key: 'castle-g2', name: 'Stephon Castle', firstName: 'Stephon', lastName: 'Castle', reference: '1642264', pts: 15, reb: 4, ast: 8 },
        ],
      },
      {
        id: 'pulse-3',
        label: 'Game 3',
        roundLabel: 'Finals',
        seriesLabel: 'Finals: vs NYK',
        opponentAlias: 'NYK',
        spursPoints: 112,
        opponentPoints: 108,
        result: 'W',
        fgPct: 48.2,
        reb: 44,
        ast: 28,
        leaders: [
          { key: 'victor-g3', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', reference: '1641705', pts: 29, reb: 13, ast: 5 },
          { key: 'vassell-g3', name: 'Devin Vassell', firstName: 'Devin', lastName: 'Vassell', reference: '1630170', pts: 21, reb: 4, ast: 3 },
          { key: 'castle-g3', name: 'Stephon Castle', firstName: 'Stephon', lastName: 'Castle', reference: '1642264', pts: 18, reb: 6, ast: 7 },
        ],
      },
      {
        id: 'pulse-4',
        label: 'Game 4',
        roundLabel: 'Finals',
        seriesLabel: 'Finals: vs NYK',
        opponentAlias: 'NYK',
        spursPoints: 132,
        opponentPoints: 108,
        result: 'W',
        fgPct: 52.0,
        reb: 50,
        ast: 35,
        leaders: [
          { key: 'victor-g4', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', reference: '1641705', pts: 35, reb: 15, ast: 6 },
          { key: 'castle-g4', name: 'Stephon Castle', firstName: 'Stephon', lastName: 'Castle', reference: '1642264', pts: 22, reb: 7, ast: 9 },
          { key: 'vassell-g4', name: 'Devin Vassell', firstName: 'Devin', lastName: 'Vassell', reference: '1630170', pts: 19, reb: 5, ast: 4 },
        ],
      },
    ],
    leaders: [
      {
        key: 'victor',
        name: 'Victor Wembanyama',
        firstName: 'Victor',
        lastName: 'Wembanyama',
        reference: '1641705',
        ppg: 27.4,
        rpg: 12.1,
        apg: 4.8,
      },
      {
        key: 'castle',
        name: 'Stephon Castle',
        firstName: 'Stephon',
        lastName: 'Castle',
        reference: '1642264',
        ppg: 18.2,
        rpg: 5.2,
        apg: 6.1,
      },
      {
        key: 'vassell',
        name: 'Devin Vassell',
        firstName: 'Devin',
        lastName: 'Vassell',
        reference: '1630170',
        ppg: 17.5,
        rpg: 4.0,
        apg: 3.2,
      },
    ],
  },
};

function gameById(id: string): GameDisplay | null {
  return games.find((game) => game.id === id) ?? null;
}

function gamesById(ids: string[]): GameDisplay[] {
  return ids.flatMap((id) => {
    const game = gameById(id);
    return game ? [game] : [];
  });
}

export function detailFixture(id: string): GameDetailPageData | null {
  const game = gameById(id);
  if (!game) return null;
  return {
    game,
    showDotRace: game.status === 'live',
    homeWL: ['W', 'L', 'W', 'W', 'L'],
    awayWL: ['L', 'W', 'L', 'W', 'W'],
    homePlayers: players,
    awayPlayers: players.map((player) => ({
      ...player,
      id: player.id + 10,
      srId: `${player.srId}-away`,
    })),
    homeStats: game.status === 'scheduled' ? [] : stats,
    awayStats: game.status === 'scheduled' ? [] : stats,
    chartData,
  };
}
