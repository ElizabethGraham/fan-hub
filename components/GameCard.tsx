import Image from 'next/image';
import Link from 'next/link';
import type { GameDisplay } from '@/lib/types';
import { teamLogoUrl } from '@/lib/nba';
import DateBadge from '@/components/DateBadge';
import { isSpursHome as isSpursHomeGame, gameDisplayLabel } from '@/lib/gameDisplay';
import { spursPlayoffStageForGame } from '@/lib/playoffs';
import { CENTRAL_TIMEZONE_LABEL } from '@/lib/constants';

type Props = {
  game: GameDisplay;
  isClickable?: boolean;
};

type BadgeConfig = {
  label: string;
  className: string;
  dot?: string;
};

type StatusBadgeConfig = Partial<Record<GameDisplay['status'], BadgeConfig>> & {
  default: BadgeConfig;
};

const STATUS_BADGE: StatusBadgeConfig = {
  live: {
    label: 'Live',
    className:
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-900/40 text-emerald-400 border border-emerald-800/50',
    dot: 'bg-emerald-400 animate-pulse',
  },

  final: {
    label: 'Final',
    className:
      'px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-ui-muted border border-zinc-700',
  },

  'if-necessary': {
    label: 'If Necessary',
    className:
      'px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-ui-muted border border-zinc-700',
  },

  default: {
    label: 'Upcoming',
    className:
      'px-2 py-0.5 rounded-full text-xs font-bold bg-fiesta-teal/10 text-fiesta-teal border border-fiesta-teal/20',
  },
};

function StatusBadge({ status }: { status: GameDisplay['status'] }) {
  const cfg = STATUS_BADGE[status] ?? STATUS_BADGE.default;

  return (
    <span className={cfg.className}>
      {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
}

// "7:30 pm CT" -> "7:30 PM CT"
function fmtTime(t: string) {
  return t.replace(/\bpm\b/i, 'PM').replace(/\bam\b/i, 'AM');
}

function fullName(team: GameDisplay['homeTeam']): string {
  return [team.market, team.name].filter(Boolean).join(' ');
}

function spursContext(game: GameDisplay) {
  const isSpursHome = isSpursHomeGame(game);
  const spurs = isSpursHome ? game.homeTeam : game.awayTeam;
  const opponent = isSpursHome ? game.awayTeam : game.homeTeam;
  const spursScore = isSpursHome ? game.homeTeamScore : game.awayTeamScore;
  const opponentScore = isSpursHome ? game.awayTeamScore : game.homeTeamScore;
  return { isSpursHome, spurs, opponent, spursScore, opponentScore };
}

function marginBlurb(margin: number, win: boolean, opponentName: string): string {
  if (win) {
    if (margin <= 5) return `Spurs owned the closing possessions in a one-score-pressure finish.`;
    if (margin <= 12)
      return `Spurs created just enough separation and kept ${opponentName} chasing late.`;
    return `Spurs controlled the shape of this one and turned it into a statement result.`;
  }
  if (margin <= 5)
    return `Spurs were one late swing away; the detail page shows where the margins tightened.`;
  if (margin <= 12)
    return `Spurs stayed close enough for useful takeaways, especially in the possession details.`;
  return `Spurs will look for the response point after ${opponentName} stretched the margin.`;
}

function cardBlurb(game: GameDisplay): string {
  const { isSpursHome, opponent, spursScore, opponentScore } = spursContext(game);
  const opponentName = fullName(opponent);
  const margin = Math.abs(spursScore - opponentScore);
  const stage = spursPlayoffStageForGame(game);

  if (game.status === 'live') {
    if (spursScore === opponentScore) {
      return `Spurs are level with ${opponentName}; the next clean stretch can tilt this ${stage ?? 'game'}.`;
    }
    if (spursScore > opponentScore) {
      return `Spurs have the edge right now; the story is whether they can keep the pace controlled.`;
    }
    return `Spurs are within ${margin}; the next run is the story.`;
  }

  if (game.status === 'final') {
    return marginBlurb(margin, spursScore > opponentScore, opponentName);
  }

  return isSpursHome
    ? `Spurs host the ${opponentName}; game preview, projected lineups, matchup notes, and key storylines.`
    : `Spurs visit the ${opponentName}; game preview, projected lineups, matchup notes, and key storylines.`;
}

export default function GameCard({ game, isClickable = true }: Props) {
  const isFinal = game.status === 'final';
  const showScore = game.status === 'live' || isFinal;
  const homeWon = isFinal && game.homeTeamScore > game.awayTeamScore;
  const awayWon = isFinal && !homeWon;
  const label = gameDisplayLabel(game);

  const cardContent = (
    <>
      {label && (
        <div className="mb-3 text-center">
          <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white transition group-hover:text-fiesta-orange">
            {label}
          </div>
          <div className="mx-auto mt-2 h-px w-20 bg-linear-to-r from-transparent via-white/40 to-transparent" />
        </div>
      )}

      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
        {/* Home team */}
        <div className="flex items-center gap-2 min-w-0">
          <Image
            src={teamLogoUrl(game.homeTeam.alias)}
            alt={`${game.homeTeam.name} logo`}
            width={48}
            height={48}
            className="object-contain shrink-0 w-8 h-8 sm:w-11 sm:h-11"
          />
          <div className="min-w-0">
            <div
              className={`font-bold text-xs sm:text-sm leading-tight truncate transition ${
                homeWon ? 'text-white' : awayWon ? 'text-ui-muted' : 'text-white'
              }`}
            >
              <span className="sm:hidden">{game.homeTeam.name}</span>
              <span className="hidden sm:inline">
                {[game.homeTeam.market, game.homeTeam.name].filter(Boolean).join(' ')}
              </span>
            </div>
            <div className="text-[10px] text-ui-muted font-medium uppercase tracking-wider mt-0.5">
              {game.homeTeam.alias}
            </div>
          </div>
        </div>

        {/* Center — score or vs */}
        <div className="flex flex-col items-center px-2 sm:px-3">
          {showScore ? (
            <div className="flex items-baseline gap-1">
              <span
                className={`text-lg sm:text-2xl font-black tabular-nums ${homeWon ? 'text-white' : 'text-ui-muted'}`}
              >
                {game.homeTeamScore}
              </span>
              <span className="text-xs text-ui-muted font-bold mx-0.5">—</span>
              <span
                className={`text-lg sm:text-2xl font-black tabular-nums ${awayWon ? 'text-white' : 'text-ui-muted'}`}
              >
                {game.awayTeamScore}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-black text-ui-muted uppercase tracking-widest">
              vs
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 justify-end min-w-0">
          <div className="min-w-0 text-right">
            <div
              className={`font-bold text-xs sm:text-sm leading-tight truncate transition ${
                awayWon ? 'text-white' : homeWon ? 'text-ui-muted' : 'text-white'
              }`}
            >
              <span className="sm:hidden">{game.awayTeam.name}</span>
              <span className="hidden sm:inline">
                {[game.awayTeam.market, game.awayTeam.name].filter(Boolean).join(' ')}
              </span>
            </div>
            <div className="text-[10px] text-ui-muted font-medium uppercase tracking-wider mt-0.5">
              {game.awayTeam.alias}
            </div>
          </div>
          <Image
            src={teamLogoUrl(game.awayTeam.alias)}
            alt={`${game.awayTeam.name} logo`}
            width={48}
            height={48}
            className="object-contain shrink-0 w-8 h-8 sm:w-11 sm:h-11"
          />
        </div>
      </div>

      {/* Footer — date · time (centred) · status */}
      <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <DateBadge date={game.date} />
        <span className="text-center text-xs sm:text-sm font-black text-ui-muted whitespace-nowrap tabular-nums">
          {game.time
            ? fmtTime(game.time)
            : game.status === 'scheduled'
              ? 'TBD'
              : `7:00 PM ${CENTRAL_TIMEZONE_LABEL}`}
        </span>
        <StatusBadge status={game.status} />
      </div>

      <p className="mt-3 text-xs sm:text-sm text-ui-muted group-hover:text-ui-muted transition leading-relaxed line-clamp-2">
        {cardBlurb(game)}
      </p>
    </>
  );

  const baseClass =
    'block border border-zinc-800 rounded-2xl p-4 sm:p-5 bg-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';
  const hoverClass =
    'hover:border-fiesta-teal/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_28px_rgba(0,178,169,0.1)] transition-all duration-300 group';

  if (isClickable) {
    return (
      <Link href={`/game/${game.id}`} className={`${baseClass} ${hoverClass}`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClass}>{cardContent}</div>;
}
