import { SPURS_ALIAS } from "./constants";
import type { GameDisplay, TeamDisplay } from "./types";

export const SPURS_PLAYOFF_STAGE_BY_OPPONENT: Record<string, string> = {
  POR: "Round 1",
  MIN: "WCSF",
  OKC: "WCF",
  NYK: "Finals",
};

export function spursOpponent(game: GameDisplay): TeamDisplay {
  return game.homeTeam.alias === SPURS_ALIAS ? game.awayTeam : game.homeTeam;
}

export function spursPlayoffStageByOpponent(alias: string): string | undefined {
  return SPURS_PLAYOFF_STAGE_BY_OPPONENT[alias.toUpperCase()];
}

export function spursPlayoffStageForTeams(
  homeTeam: TeamDisplay,
  awayTeam: TeamDisplay,
): string | undefined {
  if (homeTeam.alias === SPURS_ALIAS) {
    return spursPlayoffStageByOpponent(awayTeam.alias);
  }
  if (awayTeam.alias === SPURS_ALIAS) {
    return spursPlayoffStageByOpponent(homeTeam.alias);
  }
  return undefined;
}

export function spursPlayoffStageForGame(game: GameDisplay): string | undefined {
  return game.playoffStage ?? spursPlayoffStageByOpponent(spursOpponent(game).alias);
}

export function spursSeriesLabel(game: GameDisplay): string {
  const opponent = spursOpponent(game);
  return `${spursPlayoffStageForGame(game) ?? "Postseason"}: vs ${opponent.alias}`;
}
