export type NBAPlayer = {
  id: number;
  srId?: string;
  reference?: string;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: string | null;
  height: string;
  weight: string;
  depthChartRank?: number;
  seasonPpg?: number;
  seasonRpg?: number;
  seasonApg?: number;
  seasonSpg?: number;
  seasonTov?: number;
  seasonFgPct?: number;
  seasonFg3Pct?: number;
};

// Simplified for the scope of this assessment.
// The upstream API exposes additional statuses, but many can be
// mapped to these four states for the UI requirements here.
export type NBAGameStatus = 'scheduled' | 'live' | 'final' | 'if-necessary';

export type NBAPlayerStats = {
  player: {
    id: number;
    srId?: string;
    reference?: string;
    first_name: string;
    last_name: string;
    position: string;
    jersey_number?: string | null;
    starter?: boolean;
    onCourt?: boolean;
  };
  min: string;
  fgm: number;
  fga: number;
  fg_pct: number;
  fg3m: number;
  fg3a: number;
  fg3_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  pf: number;
  pts: number;
  plus_minus: number | null;
};

export type NBATeamChartStats = {
  fgPct: number;
  fg3Pct: number;
  reb: number;
  ast: number;
  stl: number;
  tov: number;
};

export type NBAQuarterScore = {
  label: string;
  home: number;
  away: number;
  homeStats?: NBATeamChartStats;
  awayStats?: NBATeamChartStats;
};

export type NBAGameChartData = {
  homeStats: NBATeamChartStats;
  awayStats: NBATeamChartStats;
  periods: NBAQuarterScore[];
};

// Mirrors SR's team shape: id (GUID), alias ("SAS"), name ("Spurs"), market ("San Antonio").
export type TeamDisplay = {
  id: string;
  alias: string;
  name: string;
  market?: string;
  stats?: {
    ppg?: number;
  };
};

export type GameDisplay = {
  id: string; // SR game GUID — used for routing and fetchSRGameSummary
  date: string;
  time: string | null;
  status: NBAGameStatus;
  title?: string; // Optional custom title (e.g. "Game 7", "2026 Rising Stars Semifinal 2"), falls back to "{home} vs {away} - {status}"
  playoffStage?: string;
  homeTeam: TeamDisplay;
  awayTeam: TeamDisplay;
  homeTeamScore: number;
  awayTeamScore: number;
  preview: {
    headline: string;
    keyMatchup: string;
  };
};

export type GamesDisplayResponse = {
  games: GameDisplay[];
};
