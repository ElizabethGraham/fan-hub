import { render, screen } from '@testing-library/react';
import TeamComparison from '@/components/TeamComparison';
import type { GameDisplay } from '@/lib/types';

const game: GameDisplay = {
  id: 'game-1',
  date: '2026-06-10',
  time: '8:00 PM CT',
  status: 'scheduled',
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
  homeTeamScore: 112,
  awayTeamScore: 104,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Upcoming',
    keyMatchup: 'Spurs host the Knicks.',
  },
};

describe('TeamComparison', () => {
  it('renders team names, logos, and recent form', () => {
    render(<TeamComparison game={game} homeWL={['W', 'L', 'W']} awayWL={['L', 'L', 'W']} />);

    expect(screen.getByText('Team Comparison')).toBeInTheDocument();
    expect(screen.getByText('San Antonio Spurs')).toBeInTheDocument();
    expect(screen.getByText('New York Knicks')).toBeInTheDocument();
    expect(screen.getByAltText('San Antonio Spurs logo')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 3 games: 2 wins and 1 losses')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 3 games: 1 wins and 2 losses')).toBeInTheDocument();
  });

  it('hides scores for pregame matchups and shows them once final', () => {
    const { rerender } = render(<TeamComparison game={game} homeWL={[]} awayWL={[]} />);

    expect(screen.queryByText('112')).not.toBeInTheDocument();
    expect(screen.queryByText('104')).not.toBeInTheDocument();

    rerender(<TeamComparison game={{ ...game, status: 'final' }} homeWL={[]} awayWL={[]} />);

    expect(screen.getByText('112')).toBeInTheDocument();
    expect(screen.getByText('104')).toBeInTheDocument();
  });
});
