import { useState } from 'react';
import {
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const canSubmit = email.trim().length > 0;

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
            <Text style={styles.title}>Восстановление пароля</Text>
            <Text style={styles.subtitle}>
              Введите email, и мы отправим ссылку для сброса пароля.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="user@example.com"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Pressable
              style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
              disabled={!canSubmit}
            >
              <Text
                style={[styles.primaryButtonText, !canSubmit && styles.primaryButtonTextDisabled]}
              >
                Отправить ссылку
              </Text>
            </Pressable>
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
    fontSize: 17,
    color: '#2A2A2A',
    marginBottom: 22,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6F9BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
});

const PLACEHOLDER_COLOR = '#9B9B9B';
