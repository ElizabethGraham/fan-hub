import { unstable_cache } from 'next/cache';
import { fetchSRSeasonSchedule } from './sportradar';
import { srScheduleToGameDisplays } from './sportradarMapper';
import { getNBASeasonYear, getNBASeasonPhase } from './nba';
import { getMockSeasonSchedule, isMockApiMode } from './mockData';
import type { GameDisplay } from './types';

// For this assessment, treat published schedule data as effectively static.
// In production, schedule changes could be handled via revalidation or
// explicit cache invalidation.
// Bust with revalidateTag("season-schedule-reg") on a new deployment if needed.
const getREGSchedule = unstable_cache(
  async (): Promise<GameDisplay[]> => {
    const schedule = await fetchSRSeasonSchedule(getNBASeasonYear(), 'REG');
    return srScheduleToGameDisplays(schedule);
  },
  ['sr-season-schedule-reg'],
  { revalidate: false, tags: ['season-schedule', 'season-schedule-reg'] },
);

// Treat postseason schedule data as static for the assessment.
// Bust with revalidateTag("season-schedule-pst") between rounds if needed.
const getPSTSchedule = unstable_cache(
  async (): Promise<GameDisplay[]> => {
    const schedule = await fetchSRSeasonSchedule(getNBASeasonYear(), 'PST');
    return srScheduleToGameDisplays(schedule);
  },
  ['sr-season-schedule-pst'],
  { revalidate: false, tags: ['season-schedule', 'season-schedule-pst'] },
);

// Returns the appropriate schedule(s) for the current time of year:
//   regular season  → REG only
//   postseason      → PST only (Finals = no need for 1 240 REG games)
//   off-season      → last REG for historical reference
export async function getSeasonSchedule(): Promise<GameDisplay[]> {
  if (isMockApiMode()) return getMockSeasonSchedule();

  const phase = getNBASeasonPhase();
  if (phase === 'postseason') return getPSTSchedule();
  return getREGSchedule();
}
