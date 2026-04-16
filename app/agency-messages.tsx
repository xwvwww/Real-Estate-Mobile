import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplicationMessages, fetchApplications, fetchListingById } from '@/lib/api';

type AgencyChatListItem = {
  id: string;
  applicationId: string;
  name: string;
  object: string;
  preview: string;
  time: string;
  unread: number;
  avatarLetter: string;
};

function formatTime(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function AgencyMessagesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [chats, setChats] = useState<AgencyChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setChats([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт агентства, чтобы увидеть сообщения');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    fetchApplications(session.token)
      .then(async (applications) => {
        const chatsPayload = await Promise.all(
          applications.map(async (application) => {
            const [listing, recentMessages] = await Promise.all([
              fetchListingById(application.listing_id, session.token).catch(() => null),
              fetchApplicationMessages(application.id, session.token, { limit: 1 }).catch(() => []),
            ]);

            const lastMessage = recentMessages[recentMessages.length - 1] ?? null;

            return {
              id: String(application.id),
              applicationId: String(application.id),
              name: application.full_name,
              object: listing?.title || `Объект #${application.listing_id}`,
              preview: lastMessage?.body || application.comment?.trim() || 'Откройте диалог по заявке',
              time: formatTime(lastMessage?.created_at || application.updated_at),
              unread: 0,
              avatarLetter: application.full_name.trim().charAt(0).toUpperCase() || 'К',
            } satisfies AgencyChatListItem;
          })
        );

        if (!cancelled) {
          setChats(chatsPayload);
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сообщения</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
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
            description="Диалоги с клиентами будут отображаться в этом разделе"
          />
        ) : null}

        {chats.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: '/agency-message/[id]', params: { id: item.id } })
            }>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatarLetter}</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.object}>{item.object}</Text>
              <Text style={styles.preview}>{item.preview}</Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unread ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <AgencyBottomBar active="messages" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
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
    minHeight: 98,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    lineHeight: 23,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  object: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#3A3A3A',
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  time: {
    fontSize: 11,
    lineHeight: 17,
    color: '#939393',
  },
  unreadBadge: {
    marginTop: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
