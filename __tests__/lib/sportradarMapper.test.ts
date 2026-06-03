import {
  applySeasonStats,
  srSummaryToSplitStats,
  teamSeasonChartStats,
} from '@/lib/sportradarMapper';
import type { NBAPlayer } from '@/lib/types';
import type { SRGameSummary, SRTeamSeasonStats } from '@/lib/sportradar';

describe('srSummaryToSplitStats', () => {
  it('maps SportRadar team totals and quarter scoring for GameCharts', () => {
    const summary: SRGameSummary = {
      home: {
        id: '583ecae2-fb46-11e1-82cb-f4ce4684ea4c',
        alias: 'LAL',
        scoring: [
          {
            type: 'quarter',
            number: 1,
            sequence: 1,
            points: 28,
            three_points_pct: 58.3,
            total_rebounds: 14,
            assists: 6,
            steals: 2,
            total_turnovers: 2,
          },
          {
            type: 'quarter',
            number: 2,
            sequence: 2,
            points: 20,
            three_points_pct: 14.3,
            total_rebounds: 8,
            assists: 2,
            steals: 1,
            total_turnovers: 3,
          },
          { type: 'quarter', number: 3, sequence: 3, points: 30 },
          { type: 'quarter', number: 4, sequence: 4, points: 17 },
        ],
        statistics: {
          field_goals_made: 33,
          field_goals_att: 83,
          field_goals_pct: 39.8,
          three_points_made: 15,
          three_points_att: 41,
          three_points_pct: 36.6,
          offensive_rebounds: 13,
          defensive_rebounds: 25,
          total_rebounds: 46,
          assists: 15,
          steals: 5,
          total_turnovers: 13,
        },
      },
      away: {
        id: '583eca2f-fb46-11e1-82cb-f4ce4684ea4c',
        alias: 'MIN',
        scoring: [
          {
            type: 'quarter',
            number: 1,
            sequence: 1,
            points: 21,
            three_points_pct: 25,
            total_rebounds: 11,
            assists: 3,
            steals: 0,
            total_turnovers: 4,
          },
          {
            type: 'quarter',
            number: 2,
            sequence: 2,
            points: 38,
            three_points_pct: 60,
            total_rebounds: 15,
            assists: 10,
            steals: 2,
            total_turnovers: 1,
          },
          { type: 'quarter', number: 3, sequence: 3, points: 35 },
          { type: 'quarter', number: 4, sequence: 4, points: 23 },
        ],
        statistics: {
          field_goals_made: 44,
          field_goals_att: 86,
          field_goals_pct: 51.2,
          three_points_made: 21,
          three_points_att: 42,
          three_points_pct: 50,
          offensive_rebounds: 11,
          defensive_rebounds: 33,
          total_rebounds: 50,
          assists: 29,
          steals: 8,
          total_turnovers: 10,
        },
      },
    };

    const result = srSummaryToSplitStats(summary);

    expect(result.chartData).toEqual({
      homeStats: {
        fgPct: 39.8,
        fg3Pct: 36.6,
        reb: 46,
        ast: 15,
        stl: 5,
        tov: 13,
      },
      awayStats: {
        fgPct: 51.2,
        fg3Pct: 50,
        reb: 50,
        ast: 29,
        stl: 8,
        tov: 10,
      },
      periods: [
        {
          label: 'Q1',
          home: 28,
          away: 21,
          homeStats: { fgPct: 0, fg3Pct: 58.3, reb: 14, ast: 6, stl: 2, tov: 2 },
          awayStats: { fgPct: 0, fg3Pct: 25, reb: 11, ast: 3, stl: 0, tov: 4 },
        },
        {
          label: 'Q2',
          home: 20,
          away: 38,
          homeStats: { fgPct: 0, fg3Pct: 14.3, reb: 8, ast: 2, stl: 1, tov: 3 },
          awayStats: { fgPct: 0, fg3Pct: 60, reb: 15, ast: 10, stl: 2, tov: 1 },
        },
        { label: 'Q3', home: 30, away: 35 },
        { label: 'Q4', home: 17, away: 23 },
      ],
    });
  });
});

describe('season stat mapping', () => {
  const seasonStats: SRTeamSeasonStats = {
    own_record: {
      total: {
        field_goals_pct: 0.483,
        three_points_pct: 0.359,
      },
      average: {
        rebounds: 47.02,
        assists: 28.1,
        steals: 7.52,
        turnovers: 12.65,
      },
    },
    players: [
      {
        id: 'wemby',
        full_name: 'Victor Wembanyama',
        total: {
          field_goals_pct: 0.512,
          three_points_pct: 0.349,
        },
        average: {
          points: 25,
          rebounds: 11.5,
          assists: 3.1,
          steals: 1.03,
          turnovers: 2.42,
        },
      },
    ],
  };

  it('maps team season chart stats from own_record averages and decimal percentages', () => {
    expect(teamSeasonChartStats(seasonStats)).toEqual({
      fgPct: 48.3,
      fg3Pct: 35.9,
      reb: 47.02,
      ast: 28.1,
      stl: 7.52,
      tov: 12.65,
    });
  });

  it('maps player season percentages from total decimal percentages', () => {
    const players: NBAPlayer[] = [
      {
        id: 1,
        srId: 'wemby',
        first_name: 'Victor',
        last_name: 'Wembanyama',
        position: 'C',
        jersey_number: '1',
        height: '7-4',
        weight: '235',
      },
    ];

    expect(applySeasonStats(players, seasonStats)[0]).toMatchObject({
      seasonPpg: 25,
      seasonRpg: 11.5,
      seasonApg: 3.1,
      seasonSpg: 1.03,
      seasonTov: 2.42,
      seasonFgPct: 51.2,
      seasonFg3Pct: 34.9,
    });
  });
});
