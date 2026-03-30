import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';
import { USER_LISTINGS } from '@/constants/userListings';
import { fetchFavorites, fetchListings } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  mapApiFavoriteToCatalogListing,
  mapApiListingToCatalogListing,
  mapUserListingToCatalogListing,
  type CatalogListing,
} from '@/lib/listings';
import { useFavoriteIds } from '@/stores/favoritesStore';

const LOCAL_FAVORITE_CATALOG = USER_LISTINGS.map((item, index) => mapUserListingToCatalogListing(item, index));

export default function FavoritesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const favoriteIds = useFavoriteIds(session);
  const [catalogItems, setCatalogItems] = useState<CatalogListing[]>(LOCAL_FAVORITE_CATALOG);

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      const [favoriteItems, buyItems, rentItems] = await Promise.all([
        session?.token ? fetchFavorites(session.token) : Promise.resolve([]),
        fetchListings({ dealType: 'buy' }),
        fetchListings({ dealType: 'rent' }),
      ]);

      if (cancelled) {
        return;
      }

      const mergedById = new Map<string, CatalogListing>();

      LOCAL_FAVORITE_CATALOG.forEach((item) => {
        mergedById.set(item.id, item);
      });

      favoriteItems.forEach((item, index) => {
        const mapped = mapApiFavoriteToCatalogListing(item, index);
        mergedById.set(mapped.id, mapped);
      });

      [...buyItems, ...rentItems].forEach((item, index) => {
        const mapped = mapApiListingToCatalogListing(item, index);
        mergedById.set(mapped.id, mapped);
      });

      setCatalogItems(Array.from(mergedById.values()));
    };

    loadFavorites()
      .then(() => {
        if (cancelled) {
          return;
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setCatalogItems(LOCAL_FAVORITE_CATALOG);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const favoriteItems = useMemo(
    () => catalogItems.filter((item) => favoriteIds.includes(item.id)),
    [catalogItems, favoriteIds]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Избранное</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never">
        {favoriteItems.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="Пока нет избранных объектов"
            description="Добавьте объекты в избранное из каталога или карточки объекта"
          />
        ) : null}

        {favoriteItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: item.id } })}>
            <Image source={item.image} style={styles.image} contentFit="cover" />
            <View style={styles.cardBody}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
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
    paddingBottom: 12,
    gap: 12,
  },
  card: {
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...ELEVATED_CARD_SHADOW,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  city: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: '#939393',
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#70A0FF',
  },
});
