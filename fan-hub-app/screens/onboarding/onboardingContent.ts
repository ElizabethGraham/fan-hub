import { colors } from '../../lib/theme';

export const ONBOARDING_PAGES = [
  {
    id: 'welcome',
    accentColor: colors.teal,
    title: 'YOUR GAME\nDAY HUB',
    body: 'Live scores, stats, highlights, and exclusive fan content — built for Spurs fans.',
    cta: 'Get Started',
    skip: null,
  },
  {
    id: 'notifications',
    accentColor: colors.orange,
    title: 'NEVER MISS\nA MOMENT',
    body: 'Get alerts for tip-off, big plays, trades, and breaking Spurs news the second it drops.',
    cta: 'Allow Notifications',
    skip: 'Maybe later',
  },
  {
    id: 'location',
    accentColor: colors.pink,
    title: 'FIND YOUR\nWAY IN',
    body: 'Enable location for Frost Bank Center directions, parking, and nearby game-day events.',
    cta: 'Allow Location',
    skip: 'Not now',
  },
  {
    id: 'setup',
    accentColor: colors.teal,
    title: 'READY FOR\nTIPOFF',
    body: 'Pick favorite players, turn on game alerts, and keep tickets, rewards, and pickup orders in your wallet.',
    cta: 'Finish Setup',
    skip: null,
  },
] as const;

export type OnboardingPageId = (typeof ONBOARDING_PAGES)[number]['id'];
