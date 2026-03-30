import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplications, fetchListingById } from '@/lib/api';
import { mapApplicationToUserRequest, type UserRequestViewModel } from '@/lib/applications';

export default function UserRequestsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [requests, setRequests] = useState<UserRequestViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setRequests([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт, чтобы увидеть свои заявки');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    fetchApplications(session.token)
      .then(async (items) => {
        const listingEntries = await Promise.all(
          items.map(async (item) => {
            try {
              const listing = await fetchListingById(item.listing_id);
              return [String(item.listing_id), listing] as const;
            } catch {
              return [String(item.listing_id), null] as const;
            }
          })
        );

        if (cancelled) {
          return;
        }

        const listingMap = new Map(listingEntries);
        setRequests(items.map((item) => mapApplicationToUserRequest(item, listingMap.get(String(item.listing_id)) ?? null)));
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRequests([]);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить заявки');
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
        <Text style={styles.headerTitle}>Мои заявки</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Загружаем заявки...</Text>
          </View>
        ) : null}

        {!loading && loadError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Не удалось загрузить заявки"
            description={loadError}
            actionLabel="Повторить"
            onAction={() => setReloadTick((value) => value + 1)}
          />
        ) : null}

        {!loading && !loadError && requests.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="Пока нет заявок"
            description="Ваши отправленные заявки на объекты будут показаны здесь"
          />
        ) : null}

        {requests.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/request/[id]', params: { id: item.id } })}>
            <View style={styles.topRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            </View>
            <Text style={styles.company}>{item.company}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.date}>{item.date}</Text>
              <StatusBadge label={item.status} backgroundColor={item.bg} textColor={item.color} />
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
    gap: 8,
    ...ELEVATED_CARD_SHADOW,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  company: { fontSize: 13, lineHeight: 20, color: '#939393' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: 12, lineHeight: 18, color: '#939393' },
});
