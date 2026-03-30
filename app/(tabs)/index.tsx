import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USER_LISTINGS } from '@/constants/userListings';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDashboardOverview } from '@/lib/api';
import {
  mapDashboardApplicationToRequestItem,
  mapDashboardFavoriteToRecentListing,
  type DashboardRequestItem,
} from '@/lib/dashboard';
import { mapUserListingToCatalogListing } from '@/lib/listings';
import { useFavoriteIds } from '@/stores/favoritesStore';

const FALLBACK_REQUEST_ITEMS: DashboardRequestItem[] = [
  {
    id: 'q1',
    title: '2-комнатная квартира',
    agency: 'Агентство недвижимости "Гарант"',
    date: '15 февраля 2026',
    status: 'Новая',
    statusColor: '#2A7FE3',
    statusBg: '#DCEEFF',
  },
  {
    id: 'q2',
    title: '3-комнатная квартира',
    agency: 'ЖК "Comfort Town"',
    date: '12 февраля 2026',
    status: 'В обработке',
    statusColor: '#F08A00',
    statusBg: '#FFEED9',
  },
  {
    id: 'q3',
    title: 'Коттедж с участком',
    agency: 'Элитная недвижимость',
    date: '10 февраля 2026',
    status: 'Получен ответ',
    statusColor: '#2E8C3C',
    statusBg: '#E3F5E7',
  },
];

const FALLBACK_RECENT_ITEMS = USER_LISTINGS.slice(0, 3).map((item, index) =>
  mapUserListingToCatalogListing(item, index)
);

export default function UserDashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const favoriteIds = useFavoriteIds(session);
  const [activeApplicationsCount, setActiveApplicationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [recentItems, setRecentItems] = useState(FALLBACK_RECENT_ITEMS);
  const [recentApplications, setRecentApplications] = useState(FALLBACK_REQUEST_ITEMS);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const catalogScale = useRef(new Animated.Value(1)).current;
  const transitionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setActiveApplicationsCount(0);
      setUnreadMessagesCount(0);
      setRecentItems(FALLBACK_RECENT_ITEMS);
      setRecentApplications(FALLBACK_REQUEST_ITEMS);
      setLoadingOverview(false);
      setOverviewError('Войдите в аккаунт, чтобы увидеть актуальную статистику');
      return () => {
        cancelled = true;
      };
    }

    setLoadingOverview(true);
    setOverviewError(null);

    fetchDashboardOverview(session.token)
      .then((overview) => {
        if (cancelled) {
          return;
        }

        setActiveApplicationsCount(overview.active_applications_count);
        setUnreadMessagesCount(overview.unread_messages_count);
        setRecentApplications(
          overview.recent_applications.length > 0
            ? overview.recent_applications.map(mapDashboardApplicationToRequestItem)
            : FALLBACK_REQUEST_ITEMS
        );
        setRecentItems(
          overview.recent_listings.length > 0
            ? overview.recent_listings.map((item, index) =>
                mapDashboardFavoriteToRecentListing(item, FALLBACK_RECENT_ITEMS[index] ?? null)
              )
            : FALLBACK_RECENT_ITEMS
        );
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setActiveApplicationsCount(0);
          setUnreadMessagesCount(0);
          setRecentItems(FALLBACK_RECENT_ITEMS);
          setRecentApplications(FALLBACK_REQUEST_ITEMS);
          setOverviewError(error instanceof Error ? error.message : 'Не удалось загрузить dashboard');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingOverview(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const openCatalog = () => {
    Animated.parallel([
      Animated.timing(catalogScale, {
        toValue: 0.98,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(transitionOpacity, {
        toValue: 0.07,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(tabs)/projects');
      catalogScale.setValue(1);
      transitionOpacity.setValue(0);
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Личный кабинет</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never">
        <View style={styles.metricsGrid}>
          <Pressable
            style={[styles.metricCard, styles.metricCardHalf]}
            onPress={() => router.push('/(tabs)/favorites')}>
            <View style={styles.metricIconBg}>
              <Ionicons name="heart-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>{favoriteIds.length}</Text>
            <Text style={styles.metricLabel}>Избранное</Text>
          </Pressable>

          <Pressable
            style={[styles.metricCard, styles.metricCardHalf]}
            onPress={() => router.push('/(tabs)/requests')}>
            <View style={styles.metricIconBg}>
              <Ionicons name="document-text-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>{activeApplicationsCount}</Text>
            <Text style={styles.metricLabel}>Активные заявки</Text>
          </Pressable>

          <Pressable
            style={[styles.metricCard, styles.metricCardHalf]}
            onPress={() => router.push('/(tabs)/messages')}>
            <View style={styles.metricIconBg}>
              <Ionicons name="chatbubble-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>{unreadMessagesCount}</Text>
            <Text style={styles.metricLabel}>Сообщения</Text>
          </Pressable>

          <Animated.View style={{ width: '48.1%', transform: [{ scale: catalogScale }] }}>
            <Pressable style={[styles.metricCard, styles.catalogCard, styles.catalogCardFill]} onPress={openCatalog}>
              <Ionicons name="search-outline" size={34} color="#FFFFFF" />
              <Text style={styles.catalogLabel}>Каталог</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Недавно просмотренные</Text>
          <Pressable onPress={() => router.push('/(tabs)/projects')}>
            <Text style={styles.sectionAction}>Все</Text>
          </Pressable>
        </View>

        {loadingOverview ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Обновляем dashboard...</Text>
          </View>
        ) : null}

        {!loadingOverview && overviewError ? (
          <EmptyState
            icon="cloud-offline-outline"
            title="Данные dashboard частично недоступны"
            description={overviewError}
            elevated={false}
            style={styles.stateBlock}
          />
        ) : null}

        {recentItems.map((item, index) => (
          <Pressable
            key={item.id}
            style={styles.recentCard}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: item.id } })}>
            <Image source={item.image} style={styles.recentImage} contentFit="cover" />
            <View style={styles.recentBody}>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentCity}>{item.city}</Text>
              <Text style={styles.recentPrice}>{item.price}</Text>
              <View style={styles.recentSeenRow}>
                <Ionicons name="time-outline" size={14} color="#8F8F8F" />
                <Text style={styles.recentSeenText}>{index + 2} дня назад</Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={[styles.sectionHeader, styles.requestsHeader]}>
          <Text style={styles.sectionTitle}>Последние заявки</Text>
          <Pressable onPress={() => router.push('/(tabs)/requests')}>
            <Text style={styles.sectionAction}>Все</Text>
          </Pressable>
        </View>

        {recentApplications.map((item) => (
          <Pressable key={item.id} style={styles.requestCard} onPress={() => router.push('/(tabs)/requests')}>
            <View style={styles.requestTop}>
              <Text style={styles.requestTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            </View>
            <Text style={styles.requestAgency}>{item.agency}</Text>
            <View style={styles.requestBottom}>
              <Text style={styles.requestDate}>{item.date}</Text>
              <StatusBadge label={item.status} backgroundColor={item.statusBg} textColor={item.statusColor} />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Animated.View pointerEvents="none" style={[styles.transitionOverlay, { opacity: transitionOpacity }]} />
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
  headerTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#333333' },
  content: { padding: 16, paddingBottom: 12, backgroundColor: '#F8F8F8' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    padding: 16,
    minHeight: 159,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  metricCardHalf: { width: '48.1%' },
  metricIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: { fontSize: 34, lineHeight: 40, fontWeight: '600', color: '#3A3A3A' },
  metricLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  catalogCard: {
    backgroundColor: '#70A0FF',
    borderColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  catalogCardFill: { width: '100%' },
  catalogLabel: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontWeight: '500' },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 18, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
  sectionAction: { fontSize: 14, lineHeight: 21, color: '#70A0FF', fontWeight: '500' },
  loadingBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#737373',
  },
  stateBlock: {
    marginBottom: 4,
  },
  recentCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginBottom: 12,
    minHeight: 124,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  recentImage: { width: 100, height: 100, borderRadius: 0 },
  recentBody: { flex: 1, marginLeft: 12, justifyContent: 'space-between', paddingVertical: 12, paddingRight: 12 },
  recentTitle: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  recentCity: { fontSize: 13, lineHeight: 20, color: '#939393' },
  recentPrice: { fontSize: 16, lineHeight: 24, color: '#70A0FF', fontWeight: '600' },
  recentSeenRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recentSeenText: { fontSize: 12, lineHeight: 18, color: '#939393' },
  requestsHeader: { marginTop: 16 },
  requestCard: {
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    gap: 8,
    minHeight: 116,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  requestTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  requestTitle: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  requestAgency: { fontSize: 13, lineHeight: 20, color: '#939393' },
  requestBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  requestDate: { fontSize: 12, lineHeight: 18, color: '#939393' },
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111827',
  },
});
