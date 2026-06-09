import { Image } from 'expo-image';
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
import { fetchListings, type ApiListing } from '@/lib/api';
import { filterCompanyListings, formatListingDate, getListingStatusMeta } from '@/lib/companyListings';
import { mapApiListingToCatalogListing } from '@/lib/listings';

export default function AgencyListingsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setLoadError(null);

    Promise.all([fetchListings({ dealType: 'buy' }), fetchListings({ dealType: 'rent' })])
      .then(([saleListings, rentListings]) => {
        if (!cancelled) {
          setListings(filterCompanyListings([...saleListings, ...rentListings], session?.user.company_id));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setListings([]);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить объявления');
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
  }, [session?.user.company_id]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/agency-dashboard')}>
          <Ionicons name="chevron-back" size={20} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Объявления</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      overScrollMode="never">
        <View style={styles.listingList}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#70A0FF" />
              <Text style={styles.loadingText}>Загружаем объявления...</Text>
            </View>
          ) : null}

          {!loading && loadError ? (
            <EmptyState icon="cloud-offline-outline" title="Не удалось загрузить объявления" description={loadError} />
          ) : null}

          {!loading && !loadError && listings.length === 0 ? (
            <EmptyState icon="newspaper-outline" title="Пока нет объявлений" description="Создайте первое объявление, чтобы оно появилось в списке" />
          ) : null}

          {listings.map((listing, index) => {
            const card = mapApiListingToCatalogListing(listing, index);
            const status = getListingStatusMeta(listing.status);
            return (
            <Pressable key={listing.id} style={styles.listingCard} onPress={() => router.push(`/agency-listing-view/${listing.id}` as any)}>
              <Image source={card.image} contentFit="cover" style={styles.listingImage} />

              <View style={styles.listingBody}>
                <Text style={styles.listingTitle}>{card.title}</Text>
                <Text style={styles.listingType}>{card.propertyType}</Text>

                <View style={styles.listingMetaRow}>
                  <StatusBadge label={status.label} backgroundColor={status.bg} textColor={status.color} />
                  <Text style={styles.listingDate}>{formatListingDate(listing.created_at)}</Text>
                </View>

                <Pressable
                  style={styles.editButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    router.push(`/agency-edit-listing/${listing.id}` as any);
                  }}>
                  <Text style={styles.editButtonText}>Редактировать</Text>
                </Pressable>
              </View>
            </Pressable>
          )})}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/agency-create-listing')}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      <AgencyBottomBar active="listings" />
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 118,
  },
  listingList: {
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
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    ...LIGHT_CARD_SHADOW,
  },
  listingImage: {
    width: '100%',
    height: 180,
  },
  listingBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  listingTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  listingType: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  listingMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingDate: {
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  editButton: {
    marginTop: 12,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#70A0FF',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
