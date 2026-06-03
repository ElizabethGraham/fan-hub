import { SPURS_ALIAS } from './constants';
import { spursPlayoffStageForGame } from './playoffs';
import type { GameDisplay, NBAGameStatus } from './types';

export function isPregameGame(status: NBAGameStatus): boolean {
  return status === 'scheduled' || status === 'if-necessary';
}

export function isPossibleGame(game: GameDisplay): boolean {
  const title = game.title?.toLowerCase() ?? '';
  const matchup = game.preview.keyMatchup.toLowerCase();
  return (
    game.status === 'if-necessary' ||
    title.includes('if necessary') ||
    title.includes('if-necessary') ||
    matchup.includes('if necessary')
  );
}

export function cleanGameTitle(title?: string): string | undefined {
  return title?.replace(/\s*\(if necessary\)/i, '').trim();
}

export function gameDisplayLabel(game: GameDisplay): string | null {
  const title = cleanGameTitle(game.title);
  const stage = spursPlayoffStageForGame(game);
  if (!title && !stage) return null;
  if (title && stage) return `${stage}: ${title}`;
  return stage ?? title ?? null;
}

export function gameSpotlightLabel(game: GameDisplay): string {
  if (game.status === 'live') return 'Live Now';
  if (game.status === 'final') return 'Latest Result';
  if (isPossibleGame(game)) return 'Possible Game';
  return 'Next Up';
}

export function isSpursHome(game: GameDisplay): boolean {
  return game.homeTeam.alias === SPURS_ALIAS;
}
