import { teamLogoUrl } from '@/lib/nba';

// ─── teamLogoUrl ───────────────────────────────────────────────────────────────

describe('teamLogoUrl', () => {
  it('returns an ESPN CDN HTTPS URL', () => {
    expect(teamLogoUrl('SAS')).toMatch(/^https:\/\/a\.espncdn\.com\/i\/teamlogos\/nba\/500\//);
  });

  // ESPN abbreviation mappings
  it.each([
    ['SAS', 'sa'], // San Antonio → sa (not sas)
    ['GSW', 'gs'], // Golden State → gs (not gsw)
    ['NYK', 'ny'], // New York → ny (not nyk)
    ['NOP', 'no'], // New Orleans → no (not nop)
    ['LAC', 'lac'], // LA Clippers → lac (unchanged)
    ['LAL', 'lal'], // LA Lakers → lal (unchanged)
    ['UTA', 'utah'], // Utah → utah (not uta)
    ['WAS', 'wsh'], // Washington → wsh (not was)
  ])('maps %s → %s.png on ESPN CDN', (abbr, espn) => {
    expect(teamLogoUrl(abbr)).toContain(`/${espn}.png`);
  });

  it('falls back to lowercase for an unknown abbreviation', () => {
    expect(teamLogoUrl('XYZ')).toContain('/xyz.png');
  });
});
