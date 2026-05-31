export const SPURS_ALIAS = "SAS";

// Date keys and tipoff times are shown in the Spurs/San Antonio context.
export const CENTRAL_TIMEZONE = "America/Chicago";
export const CENTRAL_TIMEZONE_LABEL = "CT";
export const DATE_KEY_LOCALE = "en-CA";

// Sportradar cache windows. These are intentionally conservative for the
// technical assessment; production live-game views would revalidate faster.
export const SR_TEAM_PROFILE_REVALIDATE_SECONDS = 24 * 60 * 60;
export const SR_GAME_SUMMARY_REVALIDATE_SECONDS = 2 * 60 * 60;
export const SR_DEPTH_CHART_REVALIDATE_SECONDS = 12 * 60 * 60;
export const SR_SEASON_SCHEDULE_REVALIDATE_SECONDS = 24 * 60 * 60;
export const SR_TEAM_SEASON_STATS_REVALIDATE_SECONDS = 6 * 60 * 60;
