import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplications, fetchListingById } from '@/lib/api';
import { mapApplicationToCompanyRequest, type CompanyRequestViewModel } from '@/lib/applications';

export default function DeveloperRequestsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [requests, setRequests] = useState<CompanyRequestViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setRequests([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт застройщика, чтобы увидеть заявки');
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
              const listing = await fetchListingById(item.listing_id, session.token);
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
        setRequests(
          items.map((item) =>
            mapApplicationToCompanyRequest(item, listingMap.get(String(item.listing_id)) ?? null)
          )
        );
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Заявки</Text>
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
            icon="mail-unread-outline"
            title="Пока нет заявок"
            description="Заявки от пользователей появятся здесь"
          />
        ) : null}

        {requests.map((request) => (
          <Pressable
            key={request.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: '/developer-request-view/[id]', params: { id: request.id } })
            }>
            <Text style={styles.title}>{request.title}</Text>
            <Text style={styles.applicant}>{request.applicantName}</Text>
            <Text style={styles.note} numberOfLines={2}>
              {request.summary}
            </Text>
            <StatusBadge
              label={request.status}
              backgroundColor={request.bg}
              textColor={request.color}
            />
          </Pressable>
        ))}
      </ScrollView>

      <DeveloperBottomBar active="requests" />
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
  backButton: {
    position: 'absolute',
    left: 12,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
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
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    ...ELEVATED_CARD_SHADOW,
  },
  title: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  applicant: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  note: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
});
