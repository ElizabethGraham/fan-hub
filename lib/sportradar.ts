import 'server-only';
import {
  SR_DEPTH_CHART_REVALIDATE_SECONDS,
  SR_GAME_SUMMARY_REVALIDATE_SECONDS,
  SR_SEASON_SCHEDULE_REVALIDATE_SECONDS,
  SR_TEAM_PROFILE_REVALIDATE_SECONDS,
  SR_TEAM_SEASON_STATS_REVALIDATE_SECONDS,
} from './constants';
import { logServerError } from './serverLogger';

const SR_API = 'https://api.sportradar.com/nba';
const ACCESS = process.env.SPORTRADAR_ACCESS_LEVEL ?? 'trial';
const BASE = `${SR_API}/${ACCESS}/v8/en`;

function apiKey() {
  const key = process.env.SPORTRADAR_API_KEY;
  if (!key || key === 'your_sportradar_api_key_here') {
    throw new Error('SPORTRADAR_API_KEY not configured');
  }
  return key;
}

type SRFetchCacheMode =
  | { mode: 'revalidate'; revalidate: number }
  | { mode: 'no-store' };

async function srFetch(path: string, cacheMode: SRFetchCacheMode) {
  const url = `${BASE}${path}`;
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: { 'x-api-key': apiKey() },
  };
  if (cacheMode.mode === 'no-store') {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate: cacheMode.revalidate };
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`Sportradar ${path} -> ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    logServerError('sportradar.request_failed', error, {
      access: ACCESS,
      path,
      cacheMode: cacheMode.mode,
      revalidate: cacheMode.mode === 'revalidate' ? cacheMode.revalidate : null,
      hasApiKey: Boolean(process.env.SPORTRADAR_API_KEY),
    });
    throw error;
  }
}

// Full roster + player profiles for a team. Cache for 24 h.
export async function fetchSRTeamProfile(srTeamId: string): Promise<SRTeamProfile> {
  return srFetch(`/teams/${srTeamId}/profile.json`, {
    mode: 'revalidate',
    revalidate: SR_TEAM_PROFILE_REVALIDATE_SECONDS,
  });
}

// Box scores + per-player stats. For this assessment, cache for 2 hours to
// reduce API pressure; a production live game hub would lower this sharply
// during active games.
export async function fetchSRGameSummary(srGameId: string): Promise<SRGameSummary> {
  return srFetch(`/games/${srGameId}/summary.json`, {
    mode: 'revalidate',
    revalidate: SR_GAME_SUMMARY_REVALIDATE_SECONDS,
  });
}

// In-progress games need the current score/stats, so this bypasses the Next
// Data Cache. Completed games should keep using fetchSRGameSummary.
export async function fetchSRLiveGameSummary(srGameId: string): Promise<SRGameSummary> {
  return srFetch(`/games/${srGameId}/summary.json`, { mode: 'no-store' });
}

// Depth chart for a team. Cache for 12 h (changes only after trades/injuries).
export async function fetchSRDepthChart(srTeamId: string): Promise<SRDepthChart> {
  return srFetch(`/teams/${srTeamId}/depth_chart.json`, {
    mode: 'revalidate',
    revalidate: SR_DEPTH_CHART_REVALIDATE_SECONDS,
  });
}

// Full NBA season schedule (~1 200 games). Treated as immutable for the season;
// the fetch cache holds it for 24 h and unstable_cache in lib/schedule.ts
// caches the mapped result indefinitely (revalidate: false) in Vercel Data Cache.
export async function fetchSRSeasonSchedule(
  seasonYear: number,
  seasonType: 'REG' | 'PST' = 'REG',
): Promise<SRSeasonSchedule> {
  return srFetch(
    `/games/${seasonYear}/${seasonType}/schedule.json`,
    {
      mode: 'revalidate',
      revalidate: SR_SEASON_SCHEDULE_REVALIDATE_SECONDS,
    },
  );
}

// Per-player season averages for a team. REG = regular season. Cache for 6 h.
export async function fetchSRTeamSeasonStats(
  srTeamId: string,
  seasonYear: number,
): Promise<SRTeamSeasonStats> {
  return srFetch(
    `/seasons/${seasonYear}/REG/teams/${srTeamId}/statistics.json`,
    {
      mode: 'revalidate',
      revalidate: SR_TEAM_SEASON_STATS_REVALIDATE_SECONDS,
    },
  );
}

// ─── Sportradar response shape types ─────────────────────────────────────────

export type SRTeamRef = {
  id: string;
  alias: string;
  market: string;
  name: string;
};

export type SRPlayerRef = {
  id: string;
  reference?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  primary_position?: string;
  jersey_number?: string;
  height?: number; // inches
  weight?: number; // lbs
};

export type SRTeamProfile = {
  id: string;
  alias?: string;
  market?: string;
  name?: string;
  players?: SRPlayerRef[];
};

// There are more statuses in the API, but we'll treat any non-"scheduled" game as active for the purposes of this app.
export type SRGameRef = {
  id: string;
  status?: string; // "scheduled" | "inprogress" | "closed" | "if-necessary" | etc.
  title?: string; // ex. Game 3
  scheduled?: string; // ISO-8601 UTC, e.g. "2025-10-22T00:30:00+00:00"
  home_points?: number;
  away_points?: number;
  home: SRTeamRef;
  away: SRTeamRef;
};

// Full-season schedule returned by /seasons/{year}/REG/schedule.json.
// SR nests games under league.season.games; the optional fallback paths guard
// against minor version differences in the response shape.
export type SRSeasonSchedule = {
  league?: { season?: { games?: SRGameRef[] } };
  season?: { games?: SRGameRef[] };
  games?: SRGameRef[];
};

export type SRPlayerStats = {
  id: string;
  reference?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  primary_position?: string;
  jersey_number?: string;
  starter?: boolean;
  on_court?: boolean;
  active?: boolean;
  played?: boolean;
  statistics?: {
    minutes?: string;
    field_goals_made?: number;
    field_goals_att?: number;
    three_points_made?: number;
    three_points_att?: number;
    free_throws_made?: number;
    free_throws_att?: number;
    offensive_rebounds?: number;
    defensive_rebounds?: number;
    rebounds?: number;
    assists?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
    personal_fouls?: number;
    points?: number;
    plus_minus?: number;
  };
};

export type SRTeamGameStatistics = {
  points?: number;
  field_goals_made?: number;
  field_goals_att?: number;
  field_goals_pct?: number;
  three_points_made?: number;
  three_points_att?: number;
  three_points_pct?: number;
  offensive_rebounds?: number;
  defensive_rebounds?: number;
  total_rebounds?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  total_turnovers?: number;
  turnovers?: number;
  player_turnovers?: number;
};

export type SRTeamSummary = {
  id: string;
  alias?: string;
  market?: string;
  name?: string;
  points?: number;
  scoring?: Array<{
    type?: string;
    number?: number;
    sequence?: number;
    points?: number;
    field_goals_made?: number;
    field_goals_att?: number;
    field_goals_pct?: number;
    three_points_made?: number;
    three_points_att?: number;
    three_points_pct?: number;
    offensive_rebounds?: number;
    defensive_rebounds?: number;
    total_rebounds?: number;
    rebounds?: number;
    assists?: number;
    steals?: number;
    total_turnovers?: number;
    turnovers?: number;
    player_turnovers?: number;
  }>;
  statistics?: SRTeamGameStatistics;
  players?: SRPlayerStats[];
};

export type SRGameSummary = {
  id?: string;
  status?: string;
  home?: SRTeamSummary;
  away?: SRTeamSummary;
};

export type SRDepthChart = {
  team?: {
    id?: string;
    depth_chart?: Array<{
      position?: string;
      players?: Array<{
        player?: { id?: string; full_name?: string };
        order?: number;
      }>;
    }>;
  };
};

export type SRTeamSeasonStats = {
  id?: string;
  own_record?: {
    total?: {
      field_goals_made?: number;
      field_goals_att?: number;
      field_goals_pct?: number;
      three_points_made?: number;
      three_points_att?: number;
      three_points_pct?: number;
    };
    average?: {
      rebounds?: number;
      assists?: number;
      steals?: number;
      turnovers?: number;
      field_goals_made?: number;
      field_goals_att?: number;
      three_points_made?: number;
      three_points_att?: number;
    };
  };
  players?: Array<{
    id?: string;
    full_name?: string;
    total?: {
      plus?: number;
      minus?: number;
      efficiency?: number;
      points?: number;
      field_goals_made?: number;
      field_goals_att?: number;
      field_goals_pct?: number;
      three_points_made?: number;
      three_points_att?: number;
      three_points_pct?: number;
    };
    average?: {
      points?: number;
      rebounds?: number;
      assists?: number;
      steals?: number;
      turnovers?: number;
      field_goals_made?: number;
      field_goals_att?: number;
      three_points_made?: number;
      three_points_att?: number;
      efficiency?: number;
    };
  }>;
};
