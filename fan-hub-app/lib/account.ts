export type FavoritePlayer = {
  id: string;
  firstName: string;
  lastName: string;
  reference: string;
  position: string;
  reason: string;
  alertsEnabled: boolean;
};

export type GameAlert = {
  id: string;
  label: string;
  detail: string;
  enabled: boolean;
};

export type Ticket = {
  id: string;
  opponent: string;
  date: string;
  seat: string;
  status: 'Ready' | 'Upcoming';
};

export type MockAccount = {
  name: string;
  email: string;
  membership: string;
  rewardBalance: number;
  favoritePlayers: FavoritePlayer[];
  alerts: GameAlert[];
  tickets: Ticket[];
};

export const MOCK_ACCOUNT: MockAccount = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  membership: 'Spurs Insider',
  rewardBalance: 1240,
  favoritePlayers: [
    {
      id: 'wemby',
      firstName: 'Victor',
      lastName: 'Wembanyama',
      reference: '1641705',
      position: 'C',
      reason: 'Blocks, milestones, and postgame clips',
      alertsEnabled: true,
    },
    {
      id: 'castle',
      firstName: 'Stephon',
      lastName: 'Castle',
      reference: '1642264',
      position: 'G',
      reason: 'Starting lineup and assist leader alerts',
      alertsEnabled: true,
    },
    {
      id: 'vassell',
      firstName: 'Devin',
      lastName: 'Vassell',
      reference: '1630170',
      position: 'G',
      reason: 'Three-point streaks and scoring runs',
      alertsEnabled: false,
    },
  ],
  alerts: [
    {
      id: 'lineups',
      label: 'Starting lineups',
      detail: 'Send 30 minutes before tipoff',
      enabled: true,
    },
    {
      id: 'close-game',
      label: 'Close game',
      detail: 'Alert when margin is 5 or less in the 4th',
      enabled: true,
    },
    {
      id: 'player-runs',
      label: 'Favorite player runs',
      detail: 'Notify for big scoring bursts and milestones',
      enabled: true,
    },
    {
      id: 'shop',
      label: 'Fan shop offers',
      detail: 'Mock coupons after games and Dot Race wins',
      enabled: false,
    },
  ],
  tickets: [
    {
      id: 'nyk-finals-g5',
      opponent: 'Knicks',
      date: 'Tonight - 7:30 PM',
      seat: 'Section 114, Row 7, Seats 5-6',
      status: 'Ready',
    },
    {
      id: 'lal-home',
      opponent: 'Lakers',
      date: 'June 12 - 6:30 PM',
      seat: 'Section 221, Row 3, Seats 9-10',
      status: 'Upcoming',
    },
  ],
};

export const LEGAL_COPY = {
  terms: {
    title: 'Terms & Conditions',
    updated: 'Updated June 7, 2026',
    sections: [
      'This mock app is a portfolio implementation. Account creation, ticketing, purchases, coupons, and notifications are simulated locally for development and review.',
      'Do not enter real payment credentials or sensitive personal information in mock builds. Production integrations would require secure authentication, payment processing, and official partner agreements.',
      'Team marks, player data, and merchandise concepts are used here only to demonstrate product design and application architecture.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Updated June 7, 2026',
    sections: [
      'Mock mode stores app state in memory only during the session. No profile data is sent to a server from this React Native demo.',
      'A production version should disclose analytics, notification tokens, account data retention, and any commerce or ticketing partners before release.',
      'Personalized alerts and favorite-player preferences in this build are local examples used to validate product flows.',
    ],
  },
} as const;
