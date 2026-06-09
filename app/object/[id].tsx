import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import UserMapCard from '@/components/UserMapCard';
import { useAuth } from '@/contexts/AuthContext';
import { fetchListingById } from '@/lib/api';
import { fetchNearbyPlaces, type NearbyPlace } from '@/lib/geo';
import {
  mapApiListingToCatalogListing,
  mapUserListingToCatalogListing,
  type CatalogListing,
} from '@/lib/listings';
import { getListingById } from '@/constants/userListings';
import { toggleFavorite, useIsFavorite } from '@/stores/favoritesStore';

export default function ObjectDetailsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const localListing = useMemo(() => {
    const item = getListingById(id);
    return item ? mapUserListingToCatalogListing(item) : null;
  }, [id]);
  const isRemoteListingId = Boolean(id && /^\d+$/.test(id));
  const [remoteListing, setRemoteListing] = useState<CatalogListing | null>(null);
  const [loading, setLoading] = useState(isRemoteListingId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeSlide] = useState(0);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isRemoteListingId || !id) {
      setRemoteListing(null);
      setLoadError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    fetchListingById(id)
      .then((item) => {
        if (cancelled) {
          return;
        }
        setRemoteListing(mapApiListingToCatalogListing(item));
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setRemoteListing(null);
        setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить объект');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, isRemoteListingId]);

  const listing = remoteListing ?? localListing;
  const isFavorite = useIsFavorite(listing?.id ?? '', session);

  useEffect(() => {
    let cancelled = false;

    if (typeof listing?.latitude !== 'number' || typeof listing.longitude !== 'number') {
      setNearbyPlaces([]);
      setNearbyError(null);
      setNearbyLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setNearbyLoading(true);
    setNearbyError(null);

    fetchNearbyPlaces(listing.latitude, listing.longitude)
      .then((places) => {
        if (!cancelled) {
          setNearbyPlaces(places);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNearbyPlaces([]);
          setNearbyError('Не удалось загрузить объекты рядом');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setNearbyLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [listing?.latitude, listing?.longitude]);

  const listingImages = useMemo(() => {
    if (!listing) {
      return [];
    }

    return listing.images.length > 0 ? listing.images : [listing.image];
  }, [listing]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="home-outline"
            title="Загружаем объект"
            description="Подождите, мы получаем данные из каталога"
            elevated={false}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="home-outline"
            title="Объект не найден"
            description={loadError || 'Вернитесь назад и выберите объявление из списка'}
            actionLabel="Вернуться назад"
            onAction={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const onShare = async () => {
    try {
      await Share.share({
        message: `${listing.title}\n${listing.price}\n${listing.address}`,
      });
    } catch {
      // ignore share dismiss errors
    }
  };

  const onToggleFavorite = async () => {
    if (!listing) {
      return;
    }

    try {
      await toggleFavorite(listing.id, session);
    } catch (error) {
      Alert.alert(
        'Не удалось обновить избранное',
        error instanceof Error ? error.message : 'Попробуйте ещё раз.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.heroWrap}>
        <Image source={listingImages[activeSlide] ?? listing.image} style={styles.heroImage} contentFit="cover" />

        <Pressable style={styles.topLeftBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3A3A3A" />
        </Pressable>

        <View style={styles.topRightButtons}>
          <Pressable style={styles.roundBtn} onPress={onShare}>
            <Ionicons name="share-social-outline" size={20} color="#3A3A3A" />
          </Pressable>
          <Pressable style={styles.roundBtn} onPress={onToggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? '#F25C7B' : '#3A3A3A'} />
          </Pressable>
        </View>

        <View style={styles.badgeType}>
          <Text style={styles.badgeTypeText}>{listing.propertyType}</Text>
        </View>
        <View style={styles.badgeCounter}>
          <Text style={styles.badgeCounterText}>{activeSlide + 1} / {Math.max(listingImages.length, 1)}</Text>
        </View>
      </View>

      <View style={styles.sliderDots}>
        <View style={styles.dotActive} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.title}>{listing.title}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color="#939393" />
          <Text style={styles.address}>{listing.address}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="bed-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>{listing.roomsLabel}</Text>
            <Text style={styles.statLabel}>комнат</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="resize-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>{listing.areaLabel.replace(' м²', '')}</Text>
            <Text style={styles.statLabel}>м²</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="business-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>{listing.floorLabel.replace(' этаж', '')}</Text>
            <Text style={styles.statLabel}>этаж</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.sectionText}>{listing.description}</Text>

        <Text style={styles.sectionTitle}>Особенности</Text>
        <View style={styles.featureWrap}>
          {listing.features.map((feature) => (
            <View key={feature} style={styles.featureTag}>
              <Text style={styles.featureTagText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.nearbyHeader}>
          <Text style={styles.sectionTitle}>Что рядом</Text>
          {nearbyLoading ? <ActivityIndicator size="small" color="#70A0FF" /> : null}
        </View>
        {nearbyError ? <Text style={styles.nearbyError}>{nearbyError}</Text> : null}
        {!nearbyLoading && !nearbyError && nearbyPlaces.length === 0 ? (
          <Text style={styles.sectionText}>Поблизости пока ничего не найдено.</Text>
        ) : null}
        {nearbyPlaces.length > 0 ? (
          <View style={styles.nearbyGrid}>
            {nearbyPlaces.map((place) => (
              <View key={place.id} style={styles.nearbyCard}>
                <Ionicons name="location-outline" size={16} color="#70A0FF" />
                <View style={styles.nearbyTextWrap}>
                  <Text style={styles.nearbyName} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <Text style={styles.nearbyMeta}>
                    {place.type} · {place.distanceMeters} м
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Расположение</Text>
        <UserMapCard
          height={260}
          markers={[
            {
              id: `m-${listing.id}`,
              lat: listing.latitude ?? 0,
              lng: listing.longitude ?? 0,
              price: listing.price,
              listingId: listing.id,
            },
          ]}
          initialRegion={{
            latitude: listing.latitude ?? 48.0196,
            longitude: listing.longitude ?? 66.9237,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          cityTitle={listing.city}
          citySubtitle={listing.address}
          showListButton={false}
          showScopeButton={false}
        />

        <View style={styles.agencyCard}>
          <View style={styles.agencyHeader}>
            <View style={styles.agencyAvatar}>
              <Text style={styles.agencyAvatarText}>AH</Text>
            </View>
            <View>
              <Text style={styles.agencyName}>{listing.companyName || 'Агентство недвижимости'}</Text>
              <Text style={styles.agencyStatus}>{listing.status === 'active' ? 'Опубликовано' : 'Проверено'}</Text>
            </View>
          </View>
          <Text style={styles.agencyText}>Профессиональная помощь в подборе и оформлении недвижимости</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryAction}>
            <Ionicons name="call-outline" size={18} color="#70A0FF" />
            <Text style={styles.secondaryActionText}>Позвонить</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction}>
            <Ionicons name="chatbubble-outline" size={18} color="#70A0FF" />
            <Text style={styles.secondaryActionText}>Написать</Text>
          </Pressable>
        </View>
        <Pressable style={styles.primaryAction} onPress={() => router.push({ pathname: '/object-application', params: { id } })}>
          <Text style={styles.primaryActionText}>Оставить заявку</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  emptyWrap: { flex: 1, justifyContent: 'center', padding: 16 },
  heroWrap: { height: 280, position: 'relative', backgroundColor: '#111' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  topLeftBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightButtons: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeType: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  badgeTypeText: { fontSize: 13, lineHeight: 20, color: '#3A3A3A', fontWeight: '500' },
  badgeCounter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  badgeCounterText: { fontSize: 13, lineHeight: 20, color: '#FFFFFF', fontWeight: '500' },
  sliderDots: {
    height: 31,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dotActive: { width: 24, height: 6, borderRadius: 999, backgroundColor: '#70A0FF' },
  content: { padding: 16, paddingBottom: 164 },
  price: { fontSize: 38, lineHeight: 42, color: '#3A3A3A', fontWeight: '600' },
  title: { marginTop: 8, fontSize: 18, lineHeight: 27, color: '#3A3A3A' },
  addressRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  address: { fontSize: 14, lineHeight: 21, color: '#939393' },
  statsGrid: { marginTop: 20, flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  statValue: { fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '600' },
  statLabel: { fontSize: 12, lineHeight: 18, color: '#939393' },
  sectionTitle: { marginTop: 24, fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '600' },
  sectionText: { marginTop: 8, fontSize: 14, lineHeight: 22, color: '#737373' },
  featureWrap: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureTag: {
    height: 32,
    borderRadius: 999,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  featureTagText: { fontSize: 13, lineHeight: 20, color: '#70A0FF' },
  nearbyHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nearbyGrid: {
    marginTop: 12,
    gap: 8,
  },
  nearbyCard: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nearbyTextWrap: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  nearbyMeta: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  nearbyError: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#D9534F',
  },
  agencyCard: {
    marginTop: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 16,
  },
  agencyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  agencyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agencyAvatarText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  agencyName: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '600' },
  agencyStatus: { fontSize: 12, lineHeight: 18, color: '#939393' },
  agencyText: { marginTop: 12, fontSize: 13, lineHeight: 20, color: '#737373' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 133,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  actionRow: { flexDirection: 'row', gap: 12 },
  secondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionText: { fontSize: 15, lineHeight: 22, color: '#70A0FF', fontWeight: '500' },
  primaryAction: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontWeight: '500' },
});
