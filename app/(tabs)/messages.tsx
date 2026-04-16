import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchChats } from '@/lib/api';
import { mapApiChatToListItem, type UserChatListItem } from '@/lib/messages';

export default function UserMessagesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [chats, setChats] = useState<UserChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setChats([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт, чтобы увидеть сообщения');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    fetchChats(session.token)
      .then((items) => {
        if (!cancelled) {
          setChats(items.map(mapApiChatToListItem));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setChats([]);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить сообщения');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadTick, session?.token]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сообщения</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Загружаем сообщения...</Text>
          </View>
        ) : null}

        {!loading && loadError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Не удалось загрузить сообщения"
            description={loadError}
            actionLabel="Повторить"
            onAction={() => setReloadTick((value) => value + 1)}
          />
        ) : null}

        {!loading && !loadError && chats.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="Пока нет сообщений"
            description="Когда появятся диалоги по заявкам, они будут здесь"
          />
        ) : null}

        {chats.map((chat) => (
          <Pressable
            key={chat.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/message/[id]', params: { id: chat.id } })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{chat.avatarLetter}</Text></View>
            <View style={styles.body}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.object}>{chat.object}</Text>
              <Text style={styles.text}>{chat.preview}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.time}>{chat.time}</Text>
              {chat.unread > 0 ? (
                <View style={styles.badge}><Text style={styles.badgeText}>{chat.unread}</Text></View>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  scroll: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 12 },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#737373',
  },
  card: {
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    ...ELEVATED_CARD_SHADOW,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, lineHeight: 24 },
  body: { flex: 1 },
  name: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  object: { fontSize: 12, lineHeight: 18, color: '#939393' },
  text: { marginTop: 4, fontSize: 13, lineHeight: 20, color: '#3A3A3A' },
  meta: { alignItems: 'flex-end', minHeight: 48, justifyContent: 'space-between' },
  time: { fontSize: 11, lineHeight: 17, color: '#939393' },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontSize: 10, lineHeight: 15, color: '#FFFFFF', fontWeight: '600' },
});
