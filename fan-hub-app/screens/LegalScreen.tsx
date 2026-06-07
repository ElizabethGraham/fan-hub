import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LEGAL_COPY } from '../lib/account';
import { colors, shared } from '../lib/theme';

export default function LegalScreen({ kind, onBack }: { kind: keyof typeof LEGAL_COPY; onBack: () => void }) {
  const copy = LEGAL_COPY[kind];

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>Legal</Text>
        <Text style={[shared.title, styles.title]}>{copy.title}</Text>
        <Text style={styles.updated}>{copy.updated}</Text>
        {copy.sections.map((section) => (
          <Text key={section} style={styles.paragraph}>{section}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  back: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.panel,
  },
  backText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  title: { marginTop: 4 },
  updated: { color: colors.faint, fontSize: 11, fontWeight: '800', marginTop: 6, marginBottom: 16 },
  paragraph: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 14 },
});
