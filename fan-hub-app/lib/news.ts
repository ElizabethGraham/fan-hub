export type NewsItem = {
  id: string;
  tag: string;
  title: string;
  time: string;
  dek: string;
  body: string[];
  bullets?: string[];
  relatedGameId?: string;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'overtime-thriller',
    tag: 'GAME RECAP',
    title: 'Spurs hold off Knicks in overtime thriller, 118-114',
    time: '2h ago',
    dek: 'San Antonio closed with stops, pace, and a late Wembanyama run to protect home court.',
    relatedGameId: 'fixture-live',
    body: [
      'The Spurs leaned into their late-game identity: get the ball moving early, force the defense into rotation, and trust the length behind the play. The final five minutes looked like a team comfortable playing through pressure.',
      'Victor Wembanyama anchored the closing stretch with rim protection on one end and quick decisions on the other. Stephon Castle controlled tempo after halftime, while Devin Vassell supplied the spacing that kept New York from loading up in the lane.',
      'The next test is recovery. San Antonio has another national-window matchup on the schedule, so the staff will keep an eye on minutes, travel, and how the rotation carries this finish into the next game.',
    ],
    bullets: ['Wembanyama: 31 PTS, 13 REB, 5 BLK', 'Castle: 18 PTS, 8 AST', 'Spurs bench: +14 scoring margin'],
  },
  {
    id: 'wemby-all-rookie',
    tag: 'ROSTER',
    title: 'Wembanyama named unanimous All-Rookie First Team selection',
    time: '5h ago',
    dek: 'The league-wide vote matched what Spurs fans watched all season: a franchise cornerstone arriving ahead of schedule.',
    body: [
      'The honor lands as another marker in a season that changed the expectations around San Antonio. Wembanyama did not just produce highlight moments; he altered the structure of the game on both ends.',
      'Team officials have continued to emphasize development over shortcuts, but the internal standard has moved. The Spurs now have a defensive centerpiece, a late-clock option, and a recruiting signal all in one player.',
    ],
    bullets: ['Top-five block rate', 'Career-high scoring after the All-Star break', 'Multiple 30-point, 10-rebound, 5-block games'],
  },
  {
    id: 'lottery-position',
    tag: 'DRAFT',
    title: 'Spurs hold top-five lottery odds heading into June draft',
    time: '1d ago',
    dek: 'San Antonio enters draft season with optionality: add another young piece or use the pick as trade leverage.',
    body: [
      'The front office has several paths available. A high pick could bring another long-term starter into the program, but the Spurs also have enough roster clarity to evaluate veteran upgrades.',
      'League executives expect San Antonio to keep conversations open through draft week. The priority remains the same: find players who fit the Wembanyama timeline without forcing the build too early.',
    ],
  },
  {
    id: 'wemby-numbers',
    tag: 'FEATURE',
    title: "Inside Wemby's first season: what the numbers really say",
    time: '2d ago',
    dek: 'The box score is loud, but the lineup data may be even louder.',
    body: [
      'San Antonio’s defensive profile changed dramatically when Wembanyama was on the floor. Opponents attacked the rim less often, settled for more late-clock jumpers, and saw second-chance looks disappear.',
      'The offensive growth was more subtle. His passing reads sharpened month by month, especially when teams sent early help. That progression is what makes the next version of the Spurs offense so interesting.',
    ],
  },
  {
    id: 'keldon-status',
    tag: 'INJURY',
    title: 'Keldon Johnson listed as questionable for Thursday matchup',
    time: '2d ago',
    dek: 'The team will update Johnson after shootaround as San Antonio manages the short turnaround.',
    body: [
      'Johnson remains part of the second-unit scoring plan, so his status affects more than one rotation slot. If he sits, expect more minutes for bigger wing groups and additional on-ball reps for Castle.',
      'The Spurs have been cautious with short-turnaround injuries in mock mode, so this status should be treated as a game-day watch item.',
    ],
  },
];

export function getNewsItem(id: string) {
  return NEWS_ITEMS.find((item) => item.id === id);
}
