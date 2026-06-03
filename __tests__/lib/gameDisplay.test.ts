import { describe, expect, it } from 'vitest';
import type { GameDisplay } from '@/lib/types';
import {
  cleanGameTitle,
  gameDisplayLabel,
  gameSpotlightLabel,
  isPossibleGame,
  isPregameGame,
} from '@/lib/gameDisplay';

const baseGame: GameDisplay = {
  id: 'game-1',
  date: '2026-06-10',
  time: '8:00 PM CT',
  status: 'scheduled',
  title: 'Game 7 (if necessary)',
  playoffStage: 'Finals',
  homeTeam: {
    id: 'sas',
    alias: 'SAS',
    name: 'Spurs',
    market: 'San Antonio',
  },
  awayTeam: {
    id: 'nyk',
    alias: 'NYK',
    name: 'Knicks',
    market: 'New York',
  },
  homeTeamScore: 0,
  awayTeamScore: 0,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Upcoming',
    keyMatchup: 'Spurs host the Knicks; game preview.',
  },
};

describe('gameDisplay helpers', () => {
  it('detects pregame statuses', () => {
    expect(isPregameGame('scheduled')).toBe(true);
    expect(isPregameGame('if-necessary')).toBe(true);
    expect(isPregameGame('final')).toBe(false);
    expect(isPregameGame('live')).toBe(false);
  });

  it('recognizes possible games and produces spotlight labels', () => {
    expect(isPossibleGame(baseGame)).toBe(true);
    expect(gameSpotlightLabel(baseGame)).toBe('Possible Game');
  });

  it('builds a playoff label and cleans if-necessary titles', () => {
    expect(cleanGameTitle('Game 7 (if necessary)')).toBe('Game 7');
    expect(gameDisplayLabel(baseGame)).toBe('Finals: Game 7');
  });
});
