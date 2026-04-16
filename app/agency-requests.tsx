import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { CARD_RADIUS, LIGHT_CARD_SHADOW } from '@/constants/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplications, fetchListingById } from '@/lib/api';
import { mapApplicationToCompanyRequest, type CompanyRequestViewModel } from '@/lib/applications';

export default function AgencyRequestsScreen() {
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
      setLoadError('Войдите в аккаунт агентства, чтобы увидеть заявки');
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
            icon="document-text-outline"
            title="Пока нет заявок"
            description="Когда пользователи начнут откликаться, заявки появятся здесь"
          />
        ) : null}

        {requests.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: '/agency-request-view/[id]', params: { id: item.id } })
            }>
            <Text style={styles.objectTitle}>{item.title}</Text>
            <Text style={styles.applicantName}>{item.applicantName}</Text>
            <Text style={styles.summary} numberOfLines={2}>
              {item.summary}
            </Text>

            <View style={styles.bottomRow}>
              <StatusBadge
                label={item.status}
                backgroundColor={item.bg}
                textColor={item.color}
              />
              <Ionicons name="chevron-forward" size={18} color="#B6B6B6" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <AgencyBottomBar active="requests" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    ...LIGHT_CARD_SHADOW,
  },
  objectTitle: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  applicantName: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  summary: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
