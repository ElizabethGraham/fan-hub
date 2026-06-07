export function getNBASeasonYear(): number {
  const now = new Date();
  return now.getMonth() + 1 >= 10 ? now.getFullYear() : now.getFullYear() - 1;
}

// NBA calendar phases based on month/day:
//   Oct 1  – Apr 14 : regular season
//   Apr 15 – Jun 22 : postseason (play-in + playoffs + Finals)
//   Jun 23 – Sep 30 : off-season (show last completed regular season for reference)
export type SeasonPhase = 'regular' | 'postseason' | 'offseason';

export function getNBASeasonPhase(now = new Date()): SeasonPhase {
  const m = now.getMonth() + 1; // 1-indexed
  const d = now.getDate();

  if (m >= 10) return 'regular'; // Oct – Dec
  if (m <= 3) return 'regular'; // Jan – Mar
  if (m === 4 && d <= 14) return 'regular'; // Apr 1–14
  if (m === 4 || m === 5 || (m === 6 && d <= 22)) return 'postseason'; // Apr 15 – Jun 22
  return 'offseason'; // Jun 23 – Sep
}

// ESPN logo URLs use a few non-standard NBA slugs.
const ESPN_ABBR: Record<string, string> = {
  ATL: 'atl',
  BOS: 'bos',
  BKN: 'bkn',
  CHA: 'cha',
  CHI: 'chi',
  CLE: 'cle',
  DAL: 'dal',
  DEN: 'den',
  DET: 'det',
  GSW: 'gs',
  HOU: 'hou',
  IND: 'ind',
  LAC: 'lac',
  LAL: 'lal',
  MEM: 'mem',
  MIA: 'mia',
  MIL: 'mil',
  MIN: 'min',
  NOP: 'no',
  NYK: 'ny',
  OKC: 'okc',
  ORL: 'orl',
  PHI: 'phi',
  PHX: 'phx',
  POR: 'por',
  SAC: 'sac',
  SAS: 'sa',
  TOR: 'tor',
  UTA: 'utah',
  WAS: 'wsh',
};

export function teamLogoUrl(abbreviation: string): string {
  const espn = ESPN_ABBR[abbreviation] ?? abbreviation.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/nba/500/${espn}.png`;
}
