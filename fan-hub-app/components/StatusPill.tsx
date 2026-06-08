import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

export default function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'teal' | 'green' | 'orange' | 'pink';
}) {
  const toneStyle = styles[tone];
  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={[styles.text, tone !== 'neutral' && styles.textActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  text: { color: colors.faint, fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  textActive: { color: colors.text },
  teal: { borderColor: 'rgba(0,178,169,0.42)', backgroundColor: 'rgba(0,178,169,0.14)' },
  green: { borderColor: 'rgba(0,178,169,0.42)', backgroundColor: 'rgba(0,178,169,0.14)' },
  orange: { borderColor: 'rgba(245,130,32,0.42)', backgroundColor: 'rgba(245,130,32,0.14)' },
  pink: { borderColor: 'rgba(232,51,138,0.42)', backgroundColor: 'rgba(232,51,138,0.14)' },
  neutral: {},
});
