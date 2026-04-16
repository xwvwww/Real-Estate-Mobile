import { useMemo, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { confirmPasswordReset } from '@/lib/api';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function normalizeToken(value: string) {
  return value.trim();
}

function isValidPassword(value: string) {
  return PASSWORD_REGEX.test(value);
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const initialToken = useMemo(() => {
    const rawToken = Array.isArray(params.token) ? params.token[0] : params.token;
    return typeof rawToken === 'string' ? normalizeToken(rawToken) : '';
  }, [params.token]);

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [tokenTouched, setTokenTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tokenValid = token.length > 0;
  const passwordValid = isValidPassword(password);
  const confirmationValid = passwordConfirmation.length > 0 && password === passwordConfirmation;
  const canSubmit = tokenValid && passwordValid && confirmationValid && !submitting;

  const onSubmit = async () => {
    setTokenTouched(true);
    setPasswordTouched(true);
    setConfirmationTouched(true);

    if (!canSubmit) {
      return;
    }

    try {
      setSubmitting(true);
      await confirmPasswordReset({
        token: normalizeToken(token),
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccessMessage('Пароль обновлён. Теперь можно войти с новым паролем.');
    } catch (error) {
      Alert.alert(
        'Не удалось сбросить пароль',
        error instanceof Error ? error.message : 'Попробуйте ещё раз.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.backButton} onPress={() => router.replace('/login')}>
            <Ionicons name="chevron-back" size={20} color="#2F2F2F" />
            <Text style={styles.backText}>Назад</Text>
          </Pressable>

          <View style={styles.card}>
            <Text style={styles.title}>Новый пароль</Text>
            <Text style={styles.subtitle}>
              Вставьте токен из письма и задайте новый пароль для аккаунта.
            </Text>

            <Text style={styles.label}>Токен</Text>
            <TextInput
              style={styles.input}
              placeholder="Вставьте токен"
              placeholderTextColor={PLACEHOLDER_COLOR}
              autoCapitalize="none"
              autoCorrect={false}
              value={token}
              onChangeText={(value) => {
                setTokenTouched(true);
                setToken(normalizeToken(value));
                if (successMessage) {
                  setSuccessMessage(null);
                }
              }}
            />
            {tokenTouched && !tokenValid ? (
              <Text style={styles.errorText}>Токен обязателен</Text>
            ) : null}

            <Text style={styles.label}>Новый пароль</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={(value) => {
                  setPasswordTouched(true);
                  setPassword(value);
                  if (successMessage) {
                    setSuccessMessage(null);
                  }
                }}
              />
              <Pressable
                onPress={() => setPasswordVisible((current) => !current)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>
            {passwordTouched && !passwordValid ? (
              <Text style={styles.errorText}>
                Минимум 8 символов, строчная, заглавная, цифра и спецсимвол.
              </Text>
            ) : null}

            <Text style={styles.label}>Повторите пароль</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry={!confirmationVisible}
                value={passwordConfirmation}
                onChangeText={(value) => {
                  setConfirmationTouched(true);
                  setPasswordConfirmation(value);
                  if (successMessage) {
                    setSuccessMessage(null);
                  }
                }}
              />
              <Pressable
                onPress={() => setConfirmationVisible((current) => !current)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={confirmationVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8D8D8D"
                />
              </Pressable>
            </View>
            {confirmationTouched && !confirmationValid ? (
              <Text style={styles.errorText}>Пароли должны совпадать</Text>
            ) : null}

            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <Pressable
              style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
              disabled={!canSubmit}
              onPress={onSubmit}
            >
              <Text
                style={[styles.primaryButtonText, !canSubmit && styles.primaryButtonTextDisabled]}
              >
                {submitting ? 'Сохраняем...' : 'Сохранить новый пароль'}
              </Text>
            </Pressable>

            {successMessage ? (
              <Pressable style={styles.secondaryButton} onPress={() => router.replace('/login')}>
                <Text style={styles.secondaryButtonText}>Перейти ко входу</Text>
              </Pressable>
            ) : null}
          </View>
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
    paddingTop: 18,
    paddingBottom: 34,
  },
  backButton: {
    height: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    marginBottom: 24,
    gap: 2,
  },
  backText: {
    fontSize: 15,
    color: '#2F2F2F',
  },
  card: {
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#787878',
    marginBottom: 22,
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
    fontSize: 16,
    color: '#2A2A2A',
    marginBottom: 16,
  },
  passwordWrap: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDEDED',
    paddingLeft: 16,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#2A2A2A',
  },
  eyeButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 0,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 18,
    color: '#D14F4F',
  },
  successText: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 20,
    color: '#3D7A42',
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E8F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#5A80D6',
    fontSize: 16,
    fontWeight: '500',
  },
});

const PLACEHOLDER_COLOR = '#9B9B9B';
