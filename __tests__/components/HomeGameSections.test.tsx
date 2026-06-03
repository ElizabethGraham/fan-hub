import { render, screen } from '@testing-library/react';
import FeaturedGame from '@/components/FeaturedGame';
import GameSection from '@/components/GameSection';
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
  homeTeamScore: 0,
  awayTeamScore: 0,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Upcoming',
    keyMatchup: 'Spurs host the Knicks.',
  },
};

describe('home game sections', () => {
  it('renders the featured game card', () => {
    render(<FeaturedGame game={game} />);

    expect(screen.getByText('Next Up')).toBeInTheDocument();
    expect(
      screen.getByText('Start here: the most relevant Spurs game for fans right now.'),
    ).toBeInTheDocument();
    expect(screen.getByText('San Antonio Spurs')).toBeInTheDocument();
  });

  it('renders game sections and hides empty sections', () => {
    const { rerender, container } = render(
      <GameSection title="Upcoming games" description="Next scheduled matchups." games={[game]} />,
    );

    expect(screen.getByText('Upcoming games')).toBeInTheDocument();
    expect(screen.getByText('Next scheduled matchups.')).toBeInTheDocument();
    expect(screen.getByText('San Antonio Spurs')).toBeInTheDocument();

    rerender(<GameSection title="Empty" games={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
