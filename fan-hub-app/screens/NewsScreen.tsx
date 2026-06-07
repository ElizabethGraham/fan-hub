import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NEWS_ITEMS } from '../lib/news';
import { colors, shared } from '../lib/theme';

export default function NewsScreen({ onOpenArticle }: { onOpenArticle: (id: string) => void }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={shared.eyebrow}>Latest</Text>
      <Text style={[shared.title, styles.title]}>Spurs News</Text>
      {NEWS_ITEMS.map((item) => (
        <Pressable key={item.id} onPress={() => onOpenArticle(item.id)} style={({ pressed }) => [styles.newsCard, pressed && styles.pressed]}>
          <View style={styles.newsTag}>
            <Text style={styles.newsTagText}>{item.tag}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDek} numberOfLines={2}>{item.dek}</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: { gap: 0 },
  title: { marginTop: 4, marginBottom: 16 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
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
  newsDek: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  newsTime: { color: colors.faint, fontSize: 11 },
});
