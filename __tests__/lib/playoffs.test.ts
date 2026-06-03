import {
  spursOpponent,
  spursPlayoffStageByOpponent,
  spursPlayoffStageForGame,
  spursSeriesLabel,
} from '@/lib/playoffs';
import type { GameDisplay } from '@/lib/types';

const team = (alias: string) => ({
  id: 'id',
  alias,
  name: 'Team',
  market: 'City',
});

function makeGame(
  homeAlias: string,
  awayAlias: string,
  overrides: Partial<GameDisplay> = {},
): GameDisplay {
  return {
    id: 'g1',
    date: '2026-05-30',
    time: '7:30 pm CT',
    status: 'scheduled',
    homeTeam: team(homeAlias),
    awayTeam: team(awayAlias),
    homeTeamScore: 0,
    awayTeamScore: 0,
    preview: { headline: '', keyMatchup: '' },
    ...overrides,
  };
}

// ─── spursOpponent ────────────────────────────────────────────────────────────

describe('spursOpponent', () => {
  it('returns the away team when Spurs are home', () => {
    expect(spursOpponent(makeGame('SAS', 'NYK')).alias).toBe('NYK');
  });

  it('returns the home team when Spurs are away', () => {
    expect(spursOpponent(makeGame('NYK', 'SAS')).alias).toBe('NYK');
  });
});

// ─── spursPlayoffStageByOpponent ─────────────────────────────────────────────

describe('spursPlayoffStageByOpponent', () => {
  it.each([
    ['POR', 'Round 1'],
    ['MIN', 'WCSF'],
    ['OKC', 'WCF'],
    ['NYK', 'Finals'],
  ])('returns the correct stage for %s', (alias, expected) => {
    expect(spursPlayoffStageByOpponent(alias)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(spursPlayoffStageByOpponent('nyk')).toBe('Finals');
    expect(spursPlayoffStageByOpponent('Min')).toBe('WCSF');
  });

  it('returns undefined for a non-playoff opponent', () => {
    expect(spursPlayoffStageByOpponent('LAL')).toBeUndefined();
  });
});

// ─── spursPlayoffStageForGame ─────────────────────────────────────────────────

describe('spursPlayoffStageForGame', () => {
  it('uses the explicit playoffStage prop when provided', () => {
    const game = makeGame('SAS', 'MIN', { playoffStage: 'WCSF' });
    expect(spursPlayoffStageForGame(game)).toBe('WCSF');
  });

  it('prefers the explicit prop over the opponent lookup', () => {
    // NYK would map to "Finals" via lookup, but explicit prop overrides it
    const game = makeGame('SAS', 'NYK', { playoffStage: 'Custom Stage' });
    expect(spursPlayoffStageForGame(game)).toBe('Custom Stage');
  });

  it('falls back to opponent lookup when no explicit stage is set', () => {
    expect(spursPlayoffStageForGame(makeGame('SAS', 'NYK'))).toBe('Finals');
    expect(spursPlayoffStageForGame(makeGame('OKC', 'SAS'))).toBe('WCF');
  });

  it('returns undefined for a regular-season opponent', () => {
    expect(spursPlayoffStageForGame(makeGame('SAS', 'LAL'))).toBeUndefined();
  });
});

// ─── spursSeriesLabel ─────────────────────────────────────────────────────────

describe('spursSeriesLabel', () => {
  it('formats the known stage and opponent alias', () => {
    expect(spursSeriesLabel(makeGame('SAS', 'NYK'))).toBe('Finals: vs NYK');
    expect(spursSeriesLabel(makeGame('MIN', 'SAS'))).toBe('WCSF: vs MIN');
  });

  it('falls back to "Postseason" for an unknown opponent', () => {
    expect(spursSeriesLabel(makeGame('SAS', 'LAL'))).toBe('Postseason: vs LAL');
  });
});
