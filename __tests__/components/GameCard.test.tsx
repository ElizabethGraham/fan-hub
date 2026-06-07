import { render, screen } from '@testing-library/react';
import GameCard from '@/components/GameCard';
import type { GameDisplay } from '@/lib/types';

// next/image and next/link are mocked globally in vitest.setup.ts

const base: GameDisplay = {
  id: '583eca2f-fb46-11e1-82cb-f4ce4684ea4c',
  date: '2026-05-30',
  time: '7:30 pm CT',
  status: 'scheduled',
  homeTeam: {
    id: '583ecd4f-fb46-11e1-82cb-f4ce4684ea4c',
    alias: 'SAS',
    name: 'Spurs',
    market: 'San Antonio',
  },
  awayTeam: {
    id: '583ec70d-fb46-11e1-82cb-f4ce4684ea4c',
    alias: 'NYK',
    name: 'Knicks',
    market: 'New York',
  },
  homeTeamScore: 0,
  awayTeamScore: 0,
  preview: {
    headline: 'San Antonio Spurs vs New York Knicks - Upcoming',
    keyMatchup: 'San Antonio Spurs hosts New York Knicks in regular season action',
  },
};

// ─── Upcoming game ─────────────────────────────────────────────────────────────

describe('GameCard — upcoming', () => {
  beforeEach(() => render(<GameCard game={base} />));

  it('shows both team short names on mobile spans', () => {
    // shortName spans are rendered alongside full-name spans; getAllBy handles multiples
    expect(screen.getAllByText('Spurs').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Knicks').length).toBeGreaterThan(0);
  });

  it('shows "vs" centre divider instead of scores', () => {
    expect(screen.getByText('vs')).toBeInTheDocument();
  });

  it('shows "Upcoming" status badge', () => {
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('shows the day number from the date badge', () => {
    // DateBadge renders the day ("30") and month ("MAY") separately — no ISO string
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows tip-off time in the footer (uppercased PM)', () => {
    // fmtTime() normalises "7:30 pm CT" -> "7:30 PM CT"; rendered in the footer row
    expect(screen.getByText('7:30 PM CT')).toBeInTheDocument();
  });

  it('links to the correct game detail URL', () => {
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/game/583eca2f-fb46-11e1-82cb-f4ce4684ea4c');
  });

  it('shows team abbreviations', () => {
    expect(screen.getByText('SAS')).toBeInTheDocument();
    expect(screen.getByText('NYK')).toBeInTheDocument();
  });
});

describe('GameCard — playoff label', () => {
  it('centres the playoff stage and game title', () => {
    render(<GameCard game={{ ...base, title: 'Game 1', playoffStage: 'Finals' }} />);

    expect(screen.getByText('Finals: Game 1')).toBeInTheDocument();
  });
});

// ─── Final game ───────────────────────────────────────────────────────────────

describe('GameCard — final', () => {
  const finalGame: GameDisplay = {
    ...base,
    status: 'final',
    homeTeamScore: 112,
    awayTeamScore: 108,
    preview: { ...base.preview, headline: 'Spurs vs Knicks - Final' },
  };

  beforeEach(() => render(<GameCard game={finalGame} />));

  it('shows "Final" status badge', () => {
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  it('shows both scores', () => {
    expect(screen.getByText('112')).toBeInTheDocument();
    expect(screen.getByText('108')).toBeInTheDocument();
  });

  it('does not show vs divider', () => {
    expect(screen.queryByText('vs')).not.toBeInTheDocument();
  });

  it('shows a Spurs-focused result blurb', () => {
    expect(screen.getByText(/Spurs owned the closing possessions/)).toBeInTheDocument();
  });
});

// ─── Live game ────────────────────────────────────────────────────────────────

describe('GameCard — live', () => {
  const liveGame: GameDisplay = {
    ...base,
    status: 'live',
    homeTeamScore: 58,
    awayTeamScore: 55,
    preview: { ...base.preview, headline: 'Spurs vs Knicks - Live (Q2)' },
  };

  beforeEach(() => render(<GameCard game={liveGame} />));

  it('shows "Live" status badge', () => {
    const badge = screen.getByText('Live');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-red-300', 'animate-pulse');
  });

  it('shows current scores', () => {
    expect(screen.getByText('58')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('does not show vs divider', () => {
    expect(screen.queryByText('vs')).not.toBeInTheDocument();
  });
});

// ─── No time (date-only game) ─────────────────────────────────────────────────

describe('GameCard — no tip-off time', () => {
  it('renders without the time segment when time is null', () => {
    render(<GameCard game={{ ...base, time: null }} />);
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });
});

// ─── If-necessary game ────────────────────────────────────────────────────────

describe('GameCard — if-necessary', () => {
  it('shows the standard upcoming blurb, not a conditional-date message', () => {
    render(<GameCard game={{ ...base, status: 'if-necessary' }} />);

    // Should show the home/away context copy
    expect(screen.getByText(/Spurs (host|visit)/i)).toBeInTheDocument();

    // The old "Conditional date" copy must be gone
    expect(screen.queryByText(/conditional date/i)).not.toBeInTheDocument();
  });

  it('shows the "If Necessary" status badge', () => {
    render(<GameCard game={{ ...base, status: 'if-necessary' }} />);
    expect(screen.getByText('If Necessary')).toBeInTheDocument();
  });
});

// ─── isClickable prop ─────────────────────────────────────────────────────────

describe('GameCard — isClickable', () => {
  it('renders a link by default', () => {
    render(<GameCard game={base} />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders a div (no link) when isClickable is false', () => {
    render(<GameCard game={base} isClickable={false} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
