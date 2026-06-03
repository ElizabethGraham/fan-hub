import { render, screen, fireEvent } from '@testing-library/react';
import GameCharts from '@/components/GameCharts';
import type { GameDisplay, NBAGameChartData } from '@/lib/types';

const game: GameDisplay = {
  id: 'g1',
  date: '2026-05-30',
  time: null,
  status: 'final',
  homeTeam: { id: 'h', alias: 'SAS', name: 'Spurs', market: 'San Antonio' },
  awayTeam: { id: 'a', alias: 'NYK', name: 'Knicks', market: 'New York' },
  homeTeamScore: 112,
  awayTeamScore: 108,
  preview: { headline: '', keyMatchup: '' },
};

const teamStats = {
  fgPct: 45.0,
  fg3Pct: 36.0,
  reb: 46,
  ast: 22,
  stl: 7,
  tov: 12,
};

// Periods carry only points — no per-quarter stat breakdowns.
const chartDataNoPerQuarterStats: NBAGameChartData = {
  homeStats: teamStats,
  awayStats: { ...teamStats, fgPct: 38.0, reb: 42 },
  periods: [
    { label: 'Q1', home: 28, away: 22 },
    { label: 'Q2', home: 25, away: 30 },
    { label: 'Q3', home: 30, away: 28 },
    { label: 'Q4', home: 29, away: 28 },
  ],
};

// Periods include per-quarter stat breakdowns.
const chartDataWithPerQuarterStats: NBAGameChartData = {
  homeStats: teamStats,
  awayStats: { ...teamStats, fgPct: 38.0, reb: 42 },
  periods: [
    {
      label: 'Q1',
      home: 28,
      away: 22,
      homeStats: { fgPct: 50, fg3Pct: 40, reb: 12, ast: 6, stl: 2, tov: 3 },
      awayStats: { fgPct: 35, fg3Pct: 25, reb: 10, ast: 4, stl: 1, tov: 4 },
    },
    {
      label: 'Q2',
      home: 25,
      away: 30,
      homeStats: { fgPct: 40, fg3Pct: 33, reb: 11, ast: 5, stl: 2, tov: 4 },
      awayStats: { fgPct: 48, fg3Pct: 50, reb: 13, ast: 8, stl: 3, tov: 2 },
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// StatBar buttons use <button aria-pressed="...">; QuarterChart groups use <g role="button">.
// Filter to only true HTML buttons so we don't accidentally click a quarter group.
function getStatButtons() {
  return screen.getAllByRole('button').filter((el) => el.tagName.toLowerCase() === 'button');
}

// ─── No stats available ───────────────────────────────────────────────────────

describe('GameCharts — no chartData', () => {
  it('renders the unavailable message when no stats can be derived', () => {
    render(<GameCharts game={game} />);
    expect(screen.getByText(/unavailable right now/i)).toBeInTheDocument();
  });
});

// ─── With team-level stats, no per-quarter breakdown ─────────────────────────

describe('GameCharts — team stats, no per-quarter data', () => {
  beforeEach(() => render(<GameCharts game={game} chartData={chartDataNoPerQuarterStats} />));

  it('shows the Game Stats section label', () => {
    expect(screen.getByText('Game Stats', { exact: false })).toBeInTheDocument();
  });

  it('shows all six stat labels', () => {
    for (const label of ['FG%', '3P%', 'REB', 'AST', 'STL', 'TOV']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('shows the "Points by Quarter" header for the quarter chart', () => {
    expect(screen.getByText('Points by Quarter')).toBeInTheDocument();
  });

  it('shows the placeholder blurb before any stat is selected', () => {
    expect(screen.getByText(/select a stat above/i)).toBeInTheDocument();
  });

  it('does not show the not-available note before a stat is selected', () => {
    expect(screen.queryByText(/quarter-level.*not available/i)).not.toBeInTheDocument();
  });

  it('updates the edge blurb when a stat is selected', () => {
    const [fgButton] = getStatButtons(); // FG% is first
    fireEvent.click(fgButton);

    // The "Select a stat" placeholder should be gone
    expect(screen.queryByText(/select a stat above/i)).not.toBeInTheDocument();

    // The edge blurb should name the winning team and the stat
    expect(screen.getByText(/has the (stronger|cleaner) fg% mark/i)).toBeInTheDocument();
  });

  it('shows the not-available note after selecting a stat (no per-quarter data)', () => {
    const [fgButton] = getStatButtons();
    fireEvent.click(fgButton);

    expect(screen.getByText(/quarter-level.*not available/i)).toBeInTheDocument();
  });

  it("keeps the quarter chart title as 'Points by Quarter' when no per-quarter data", () => {
    const [fgButton] = getStatButtons();
    fireEvent.click(fgButton);

    // Header should still say "Points by Quarter", not "FG% by Quarter"
    expect(screen.getByText('Points by Quarter')).toBeInTheDocument();
    expect(screen.queryByText('FG% by Quarter')).not.toBeInTheDocument();
  });

  it('deselects the stat when clicked a second time', () => {
    const [fgButton] = getStatButtons();
    fireEvent.click(fgButton);
    fireEvent.click(fgButton);

    expect(screen.getByText(/select a stat above/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/not available/i)).not.toBeInTheDocument();
  });
});

// ─── With per-quarter stat breakdowns available ───────────────────────────────

describe('GameCharts — per-quarter stats available', () => {
  beforeEach(() => render(<GameCharts game={game} chartData={chartDataWithPerQuarterStats} />));

  it('does NOT show the not-available note when per-quarter data is available', () => {
    const [fgButton] = getStatButtons();
    fireEvent.click(fgButton);

    expect(screen.queryByText(/quarter-level.*not available/i)).not.toBeInTheDocument();
  });

  it('shows "[Stat] by Quarter" title when a stat with per-quarter data is selected', () => {
    const [fgButton] = getStatButtons();
    fireEvent.click(fgButton);

    expect(screen.getByText('FG% by Quarter')).toBeInTheDocument();
  });
});
