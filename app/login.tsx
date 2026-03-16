import { useState } from 'react';
import {
  Alert,
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
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoginPageIcon from '@/assets/images/LoginPageIcon.svg';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  const onLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail === 'testuser@gmail.com' && normalizedPassword === '123456') {
      router.replace('/(tabs)');
      return;
    }

    if (normalizedEmail === 'testagency@gmail.com' && normalizedPassword === '123456') {
      router.replace('/agency-dashboard');
      return;
    }

    if (normalizedEmail === 'testdeveloper@gmail.com' && normalizedPassword === '123456') {
      router.replace('/developer-dashboard');
      return;
    }

    Alert.alert(
      'Неверные данные',
      'Тестовые аккаунты: testuser@gmail.com / 123456, testagency@gmail.com / 123456, testdeveloper@gmail.com / 123456'
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <View style={styles.logoBadge}>
              <LoginPageIcon width={34} height={34} />
            </View>
            <Text style={styles.platformTitle}>Платформа недвижимости</Text>
          </View>

          <Text style={styles.screenTitle}>Вход в систему</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="user@example.com"
            placeholderTextColor={PLACEHOLDER_COLOR}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Пароль</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={PLACEHOLDER_COLOR}
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setPasswordVisible((v) => !v)} style={styles.eyeButton}>
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#8D8D8D"
              />
            </Pressable>
          </View>

          <Link href="/forgot-password" asChild>
            <Pressable>
              <Text style={styles.forgotLink}>Забыли пароль?</Text>
            </Pressable>
          </Link>

          <Pressable
            style={[styles.primaryButton, !canLogin && styles.primaryButtonDisabled]}
            disabled={!canLogin}
            onPress={onLogin}
          >
            <Text style={[styles.primaryButtonText, !canLogin && styles.primaryButtonTextDisabled]}>
              Войти
            </Text>
          </Pressable>

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>или</Text>
            <View style={styles.separatorLine} />
          </View>

          <Link href="/register" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Зарегистрироваться</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 34,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoBadge: {
    width: 66,
    height: 66,
    borderRadius: 16,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  screenTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#2E2E2E',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#2A2A2A',
    marginBottom: 16,
  },
  passwordWrap: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 17,
    color: '#2A2A2A',
  },
  eyeButton: {
    padding: 4,
  },
  forgotLink: {
    marginTop: 12,
    marginBottom: 24,
    alignSelf: 'flex-end',
    color: '#5B7CFF',
    fontSize: 13,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },
  primaryButtonDisabled: {
    backgroundColor: '#C5D7FF',
  },
  primaryButtonTextDisabled: {
    color: '#5E79B8',
  },
  separatorRow: {
    marginTop: 30,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  separatorText: {
    color: '#8C8C8C',
    fontSize: 13,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 17,
    color: '#2F2F2F',
    fontWeight: '400',
  },
});

const PLACEHOLDER_COLOR = '#9B9B9B';
