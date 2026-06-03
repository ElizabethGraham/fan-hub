import { render, screen } from '@testing-library/react';
import PlayersToWatch from '@/components/PlayersToWatch';
import type { GameDisplay, NBAPlayer, NBAPlayerStats } from '@/lib/types';

const game: GameDisplay = {
  id: 'game-1',
  date: '2026-06-10',
  time: '8:00 PM CT',
  status: 'if-necessary',
  title: 'Game 7',
  playoffStage: 'Finals',
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

function player(
  id: number,
  first: string,
  last: string,
  jersey: string,
  depth?: number,
  ppg = 10,
  rpg = 5,
  apg = 3,
): NBAPlayer {
  return {
    id,
    srId: `player-${id}`,
    reference: `16${String(id).padStart(5, '0')}`,
    first_name: first,
    last_name: last,
    position: 'G',
    jersey_number: jersey,
    height: '',
    weight: '',
    depthChartRank: depth,
    seasonPpg: ppg,
    seasonRpg: rpg,
    seasonApg: apg,
  };
}

function statStarter(id: number, first: string, last: string, jersey: string): NBAPlayerStats {
  return {
    player: {
      id,
      srId: `player-${id}`,
      reference: `16${String(id).padStart(5, '0')}`,
      first_name: first,
      last_name: last,
      position: 'G',
      jersey_number: jersey,
      starter: true,
    },
    min: '32:00',
    fgm: 0,
    fga: 0,
    fg_pct: 0,
    fg3m: 0,
    fg3a: 0,
    fg3_pct: 0,
    ftm: 0,
    fta: 0,
    ft_pct: 0,
    oreb: 0,
    dreb: 0,
    reb: 4,
    ast: 5,
    stl: 0,
    blk: 0,
    turnover: 1,
    pf: 2,
    pts: 12,
    plus_minus: null,
  };
}

describe('PlayersToWatch', () => {
  it('renders Spurs players to watch from season scoring when no game stats are available', () => {
    render(
      <PlayersToWatch
        game={game}
        homePlayers={[
          player(1, 'Devin', 'Vassell', '24', undefined, 18),
          player(2, 'Victor', 'Wembanyama', '1', undefined, 25),
          player(3, 'Stephon', 'Castle', '5', undefined, 14),
          player(4, 'Keldon', 'Johnson', '3', undefined, 12),
          player(5, 'Jeremy', 'Sochan', '10', undefined, 11),
        ]}
        awayPlayers={[
          player(6, 'Jalen', 'Brunson', '11', 1),
          player(7, 'Mikal', 'Bridges', '25', 2),
          player(8, 'Josh', 'Hart', '3', 3),
          player(9, 'OG', 'Anunoby', '8', 4),
          player(10, 'Karl-Anthony', 'Towns', '32', 5),
        ]}
      />,
    );

    expect(screen.getByText('Spurs Players to Watch')).toBeInTheDocument();
    expect(screen.queryByText('Starting Lineups')).not.toBeInTheDocument();
    expect(screen.getByText('Victor Wembanyama')).toBeInTheDocument();
    expect(screen.getByText('25.0 ppg')).toBeInTheDocument();
    expect(screen.getByText('Devin Vassell')).toBeInTheDocument();
    expect(screen.getByText('#24')).toBeInTheDocument();
  });

  it('renders Spurs standouts from box-score data after a final game', () => {
    render(
      <PlayersToWatch
        game={{ ...game, status: 'final' }}
        homePlayers={[player(1, 'Victor', 'Wembanyama', '1'), player(2, 'Devin', 'Vassell', '24')]}
        awayPlayers={[player(6, 'Jalen', 'Brunson', '11')]}
        homeStats={[
          statStarter(1, 'Victor', 'Wembanyama', '1'),
          statStarter(2, 'Devin', 'Vassell', '24'),
        ]}
        awayStats={[statStarter(6, 'Jalen', 'Brunson', '11')]}
      />,
    );

    expect(screen.getByText('Spurs Standouts')).toBeInTheDocument();
    expect(screen.queryByText('Starting Lineups')).not.toBeInTheDocument();
    expect(screen.getByText('Victor Wembanyama')).toBeInTheDocument();
    expect(screen.getByText('Devin Vassell')).toBeInTheDocument();
    expect(screen.getAllByText('12')).toHaveLength(2);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });
});
