import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

type Mode = 'signin' | 'create';

export default function AuthScreen({ onDone, mockMode = false }: { onDone: () => void; mockMode?: boolean }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.logo} />
            <Text style={styles.appName}>SPURS FAN HUB</Text>
            <Text style={styles.subtitle}>
              {mode === 'signin' ? 'Welcome back, Spurs fan.' : 'Create your fan account.'}
            </Text>
            {mockMode && (
              <View style={styles.mockPill}>
                <Text style={styles.mockPillText}>MOCK AUTH - LOCAL ONLY</Text>
              </View>
            )}
            {/* Fiesta stripe */}
            <View style={styles.fiestaRow}>
              <View style={[styles.fiestaChip, { backgroundColor: colors.teal }]} />
              <View style={[styles.fiestaChip, { backgroundColor: colors.pink }]} />
              <View style={[styles.fiestaChip, { backgroundColor: colors.orange }]} />
            </View>
          </View>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <Pressable
              style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
              onPress={() => setMode('signin')}
            >
              <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mode === 'create' && styles.toggleBtnActive]}
              onPress={() => setMode('create')}
            >
              <Text style={[styles.toggleText, mode === 'create' && styles.toggleTextActive]}>
                Create Account
              </Text>
            </Pressable>
          </View>

          {/* Social buttons */}
          <View style={styles.socialGroup}>
            <Pressable style={styles.appleBtn} onPress={onDone}>
              <AppleIcon />
              <Text style={styles.appleBtnText}>
                {mode === 'signin' ? 'Continue with Apple' : 'Sign up with Apple'}
              </Text>
            </Pressable>

            <Pressable style={styles.googleBtn} onPress={onDone}>
              <GoogleIcon />
              <Text style={styles.googleBtnText}>
                {mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'create' && (
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.faint}
                value={name}
                onChangeText={setName}
                autoComplete="name"
                textContentType="name"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.faint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.faint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType={mode === 'create' ? 'newPassword' : 'password'}
            />
            {mode === 'signin' && (
              <Pressable style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            )}
          </View>

          {/* Submit */}
          <Pressable style={styles.cta} onPress={onDone}>
            <Text style={styles.ctaText}>
              {mockMode ? 'CONTINUE WITH MOCK ACCOUNT' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </Text>
          </Pressable>

          {/* Guest */}
          <Pressable style={styles.guestBtn} onPress={onDone}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </Pressable>

          {/* Legal */}
          <Text style={styles.legal}>
            By continuing you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AppleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
      <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080c10' },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Header
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 28 },
  logo: { width: 64, height: 64, resizeMode: 'contain', marginBottom: 12 },
  appName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
  },
  mockPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(245,130,32,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,130,32,0.36)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 16,
  },
  mockPillText: { color: colors.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  fiestaRow: { flexDirection: 'row', gap: 6 },
  fiestaChip: { width: 28, height: 3, borderRadius: 2 },

  // Mode toggle
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 3,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: colors.teal },
  toggleText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  toggleTextActive: { color: '#ffffff' },

  // Social
  socialGroup: { gap: 12, marginBottom: 20 },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  appleBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
  },
  googleBtnText: { color: '#1f1f1f', fontSize: 15, fontWeight: '600' },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#27272a' },
  dividerText: { color: colors.faint, fontSize: 12, fontWeight: '700', letterSpacing: 1 },

  // Form
  form: { gap: 12, marginBottom: 20 },
  input: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 15,
  },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { color: colors.teal, fontSize: 13, fontWeight: '600' },

  // CTA
  cta: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaText: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 1.3 },

  // Guest
  guestBtn: { alignItems: 'center', paddingVertical: 12 },
  guestText: { color: colors.muted, fontSize: 14, fontWeight: '600' },

  // Legal
  legal: {
    color: colors.faint,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
  legalLink: { color: colors.teal },
});
