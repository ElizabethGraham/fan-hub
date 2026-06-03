import { describe, expect, it } from 'vitest';
import { sectionGames } from '@/lib/homePageData';
import type { GameDisplay } from '@/lib/types';

const team = (alias: string) => ({
  id: alias,
  alias,
  name: alias,
  market: 'City',
});

function game(
  id: string,
  status: GameDisplay['status'],
  date: string,
  title?: string,
): GameDisplay {
  return {
    id,
    date,
    time: '7:00 PM CT',
    status,
    title,
    homeTeam: team('SAS'),
    awayTeam: team('NYK'),
    homeTeamScore: status === 'final' ? 112 : 0,
    awayTeamScore: status === 'final' ? 104 : 0,
    preview: {
      headline: '',
      keyMatchup: title?.includes('if necessary') ? 'if necessary' : '',
    },
  };
}

describe('sectionGames', () => {
  it('prioritizes live games for featured and separates possible games', () => {
    const live = game('live', 'live', '2090-01-01');
    const confirmed = game('confirmed', 'scheduled', '2090-06-02');
    const possible = game('possible', 'scheduled', '209-06-30', 'Game 7 (if necessary)');
    const recent = game('recent', 'final', '2026-06-01');
    const sections = sectionGames([possible, recent, confirmed, live]);

    expect(sections.featured?.id).toBe('live');
    expect(sections.live).toHaveLength(0);
    expect(sections.confirmedUpcoming.map((item) => item.id)).toEqual(['confirmed']);
    expect(sections.possibleUpcoming.map((item) => item.id)).toEqual(['possible']);
    expect(sections.recent.map((item) => item.id)).toEqual(['recent']);
  });

  it('uses confirmed upcoming before recent or possible games when there is no live game', () => {
    const confirmed = game('confirmed', 'scheduled', '2090-06-20');
    const possible = game('possible', 'scheduled', '2090-06-30', 'Game 7 (if necessary)');
    const recent = game('recent', 'final', '2026-06-01');

    expect(sectionGames([possible, recent, confirmed]).featured?.id).toBe('confirmed');
  });
});
