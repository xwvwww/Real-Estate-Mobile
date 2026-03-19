import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { activateUserToken } from '@/lib/api';

export default function ConfirmScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Проверяем ссылку подтверждения...');

  useEffect(() => {
    const rawToken = Array.isArray(token) ? token[0] : token;

    if (!rawToken) {
      setStatus('error');
      setMessage('Токен подтверждения не найден.');
      return;
    }

    let isMounted = true;

    const activate = async () => {
      try {
        await activateUserToken(rawToken);

        if (!isMounted) {
          return;
        }

        setStatus('success');
        setMessage('Аккаунт подтверждён. Сейчас перенаправим на вход.');

        setTimeout(() => {
          if (isMounted) {
            router.replace('/login');
          }
        }, 1400);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Не удалось подтвердить аккаунт.');
      }
    };

    activate();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          {status === 'loading' ? <ActivityIndicator size="large" color="#70A0FF" /> : null}
          <Text style={styles.title}>{status === 'error' ? 'Не получилось' : 'Подтверждение'}</Text>
          <Text style={styles.message}>{message}</Text>

          {status === 'error' ? (
            <Pressable style={styles.button} onPress={() => router.replace('/login')}>
              <Text style={styles.buttonText}>Вернуться ко входу</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    height: 48,
    alignSelf: 'stretch',
    borderRadius: 12,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
});