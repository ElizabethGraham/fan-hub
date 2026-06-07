import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0f0f12',
  panel: '#18181b',
  panelSoft: '#111113',
  border: '#27272a',
  muted: '#a1a1aa',
  faint: '#71717a',
  text: '#ffffff',
  teal: '#00b2a9',
  pink: '#e8338a',
  orange: '#f58220',
  red: '#f87171',
  redBg: 'rgba(127,29,29,0.5)',
  redBorder: 'rgba(185,28,28,0.6)',
};

export const shared = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(24,24,27,0.94)',
    borderColor: 'rgba(196,206,212,0.13)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
