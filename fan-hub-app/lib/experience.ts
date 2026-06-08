export type PassKind = 'ticket' | 'order' | 'reward' | 'coupon';
export type PassStatus = 'Ready' | 'Upcoming' | 'Saved' | 'Preparing' | 'Expired';

export type WalletPass = {
  id: string;
  kind: PassKind;
  title: string;
  subtitle: string;
  detail: string;
  status: PassStatus;
  accent: string;
  code: string;
  primaryAction: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'Game' | 'Player' | 'Wallet' | 'Shop';
  unread: boolean;
};

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  time: string;
};

export type SetupStep = {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
};

export const WALLET_PASSES: WalletPass[] = [
  {
    id: 'ticket-nyk-finals-g5',
    kind: 'ticket',
    title: 'Spurs vs Knicks',
    subtitle: 'Tonight - 7:30 PM',
    detail: 'Section 114, Row 7, Seats 5-6',
    status: 'Ready',
    accent: '#00b2a9',
    code: 'SAS-NYK-114-0705',
    primaryAction: 'Open ticket',
  },
  {
    id: 'order-bexar-hoodie',
    kind: 'order',
    title: 'Bexar Goods Origins Hoodie',
    subtitle: 'Pickup order',
    detail: 'Fan Shop - Section 221',
    status: 'Preparing',
    accent: '#f58220',
    code: 'SHOP-221-87420',
    primaryAction: 'View pickup pass',
  },
  {
    id: 'reward-dot-race',
    kind: 'reward',
    title: 'Dot Race Reward',
    subtitle: 'Saved coupon',
    detail: '5% off one arena pickup item',
    status: 'Saved',
    accent: '#e8338a',
    code: 'DOTRACE15',
    primaryAction: 'Use reward',
  },
  {
    id: 'ticket-lal',
    kind: 'ticket',
    title: 'Spurs vs Lakers',
    subtitle: 'June 12 - 6:30 PM',
    detail: 'Section 221, Row 3, Seats 9-10',
    status: 'Upcoming',
    accent: '#f58220',
    code: 'SAS-LAL-221-0309',
    primaryAction: 'Add to wallet',
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'lineups-ready',
    title: 'Starting lineups are in',
    body: 'Wembanyama, Castle, Vassell, Barnes, and Sochan are listed as starters.',
    time: '12m ago',
    category: 'Game',
    unread: true,
  },
  {
    id: 'order-preparing',
    title: 'Pickup order is preparing',
    body: 'Your Bexar Goods Origins Hoodie is being staged at the Section 221 fan shop.',
    time: '18m ago',
    category: 'Wallet',
    unread: true,
  },
  {
    id: 'wemby-milestone',
    title: 'Wembanyama watch',
    body: 'Victor is 2 blocks away from another 5-block game.',
    time: '31m ago',
    category: 'Player',
    unread: false,
  },
  {
    id: 'reward-saved',
    title: 'Reward saved',
    body: 'DOTRACE15 has been added to your wallet for tonight.',
    time: '1h ago',
    category: 'Shop',
    unread: false,
  },
];

export const ACTIVITY: ActivityItem[] = [
  {
    id: 'auth',
    label: 'Mock account refreshed',
    detail: 'Profile and wallet state restored locally.',
    time: 'Today',
  },
  {
    id: 'ticket',
    label: 'Ticket ready',
    detail: 'Spurs vs Knicks pass moved to Ready.',
    time: 'Today',
  },
  {
    id: 'reward',
    label: 'Coupon saved',
    detail: 'Dot Race reward added to wallet.',
    time: 'Yesterday',
  },
  {
    id: 'favorite',
    label: 'Player alerts updated',
    detail: 'Castle assists and Wemby milestones enabled.',
    time: 'Yesterday',
  },
];

export const SETUP_STEPS: SetupStep[] = [
  {
    id: 'players',
    label: 'Pick favorite players',
    detail: 'Personalize stats, alerts, and home modules.',
    complete: true,
  },
  {
    id: 'alerts',
    label: 'Enable game alerts',
    detail: 'Lineups, close games, milestones, and wallet updates.',
    complete: true,
  },
  {
    id: 'wallet',
    label: 'Add wallet passes',
    detail: 'Tickets, rewards, and pickup orders in one place.',
    complete: true,
  },
];
