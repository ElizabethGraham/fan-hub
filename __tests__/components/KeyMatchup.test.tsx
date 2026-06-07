import { render, screen } from '@testing-library/react';
import KeyMatchup from '@/components/KeyMatchup';
import type { GameDisplay } from '@/lib/types';

const game: GameDisplay = {
  id: 'game-1',
  date: '2026-05-30',
  time: '7:30 PM CT',
  status: 'live',
  homeTeam: {
    id: 'sas-team',
    alias: 'SAS',
    name: 'Spurs',
    market: 'San Antonio',
  },
  awayTeam: {
    id: 'nyk-team',
    alias: 'NYK',
    name: 'Knicks',
    market: 'New York',
  },
  homeTeamScore: 58,
  awayTeamScore: 55,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Live',
    keyMatchup: 'Spurs host the Knicks.',
  },
};

describe('KeyMatchup', () => {
  it('uses the same red pulsing live badge as GameCard', () => {
    render(<KeyMatchup game={game} />);

    const badge = screen.getByText('Live');
    expect(badge).toHaveClass('text-red-300', 'bg-red-950/50', 'animate-pulse');
    expect(badge.querySelector('.bg-red-400.animate-pulse')).not.toBeNull();
  });
});
