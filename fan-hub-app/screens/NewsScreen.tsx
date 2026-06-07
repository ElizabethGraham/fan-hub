import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shared } from '../lib/theme';

const MOCK_NEWS = [
  { tag: 'GAME RECAP', title: 'Spurs hold off Thunder in overtime thriller, 118-114', time: '2h ago' },
  { tag: 'ROSTER', title: 'Wembanyama named All-Rookie First Team - unanimous selection', time: '5h ago' },
  { tag: 'DRAFT', title: 'Spurs hold top-5 lottery odds heading into June draft', time: '1d ago' },
  { tag: 'FEATURE', title: "Inside Wemby's first season: what the numbers really say", time: '2d ago' },
  { tag: 'INJURY', title: 'Keldon Johnson listed as questionable for Thursday matchup', time: '2d ago' },
];

export default function NewsScreen() {
  return (
    <View style={styles.sectionWrap}>
      <Text style={shared.eyebrow}>Latest</Text>
      <Text style={[shared.title, styles.title]}>Spurs News</Text>
      {MOCK_NEWS.map((item) => (
        <Pressable key={`${item.tag}-${item.title}`} style={styles.newsCard}>
          <View style={styles.newsTag}>
            <Text style={styles.newsTagText}>{item.tag}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: { gap: 0 },
  title: { marginTop: 4, marginBottom: 16 },
  newsCard: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  newsTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,178,169,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newsTagText: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  newsTitle: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 21 },
  newsTime: { color: colors.faint, fontSize: 11 },
});
