import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import UserMapCard, { type MapRegion, type UserMapMarker } from '@/components/UserMapCard';
import { USER_LISTINGS, type UserListing } from '@/constants/userListings';
import { toggleFavorite, useIsFavorite } from '@/stores/favoritesStore';

type ObjectType = 'all' | 'Квартира' | 'Студия' | 'Пентхаус' | 'Дом' | 'Новостройка';

const DEFAULT_REGION: MapRegion = {
  latitude: 48.0196,
  longitude: 66.9237,
  latitudeDelta: 16,
  longitudeDelta: 16,
};

const CITY_REGIONS: Record<string, MapRegion> = Object.fromEntries(
  USER_LISTINGS.map((item) => [
    item.city,
    {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.45,
      longitudeDelta: 0.45,
    },
  ])
);

function isInBounds(item: UserListing, region: MapRegion) {
  const latMin = region.latitude - region.latitudeDelta / 2;
  const latMax = region.latitude + region.latitudeDelta / 2;
  const lngMin = region.longitude - region.longitudeDelta / 2;
  const lngMax = region.longitude + region.longitudeDelta / 2;
  return item.latitude >= latMin && item.latitude <= latMax && item.longitude >= lngMin && item.longitude <= lngMax;
}

function StatRow({ beds, area, floor }: { beds: string; area: string; floor: string }) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Ionicons name="bed-outline" size={14} color="#737373" />
        <Text style={styles.statText}>{beds}</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="resize-outline" size={14} color="#737373" />
        <Text style={styles.statText}>{area}</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="business-outline" size={14} color="#737373" />
        <Text style={styles.statText}>{floor}</Text>
      </View>
    </View>
  );
}

function ListingCard({
  listing,
  onPressDetails,
}: {
  listing: UserListing;
  onPressDetails: () => void;
}) {
  const isFavorite = useIsFavorite(listing.id);
  const heartScale = useRef(new Animated.Value(1)).current;

  const onToggleFavorite = () => {
    toggleFavorite(listing.id);
    heartScale.setValue(0.82);
    Animated.spring(heartScale, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable style={styles.card} onPress={onPressDetails}>
      <View style={styles.cardImage}>
        <Image source={listing.image} style={styles.cardPhoto} contentFit="cover" />
        <View style={styles.tag}>
          <Text style={styles.tagText}>{listing.type}</Text>
        </View>
        <Pressable
          style={styles.favoriteCircle}
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#F25C7B' : '#6C6C6C'}
            />
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.address}>{listing.address}</Text>
        <StatRow beds={listing.beds} area={listing.area} floor={listing.floor} />
        <Pressable
          style={styles.moreBtn}
          onPress={(event) => {
            event.stopPropagation();
            onPressDetails();
          }}>
          <Text style={styles.moreBtnText}>Подробнее</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function UserCatalogScreen() {
  const router = useRouter();
  const [dealType, setDealType] = useState<'buy' | 'rent'>('buy');
  const segmentAnim = useRef(new Animated.Value(0)).current;
  const [segmentWidth, setSegmentWidth] = useState(0);

  const [filterVisible, setFilterVisible] = useState(false);
  const [city, setCity] = useState('');
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [objectType, setObjectType] = useState<ObjectType>('all');

  const [region, setRegion] = useState<MapRegion>(DEFAULT_REGION);
  const [areaFilterRegion, setAreaFilterRegion] = useState<MapRegion | null>(null);
  const [showList, setShowList] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const cityOptions = useMemo(() => [...new Set(USER_LISTINGS.map((item) => item.city))], []);

  const onSelectDealType = (nextType: 'buy' | 'rent') => {
    setDealType(nextType);
    Animated.timing(segmentAnim, {
      toValue: nextType === 'buy' ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const sliderTranslateX = segmentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, segmentWidth > 0 ? segmentWidth / 2 : 0],
  });

  const filteredListings = useMemo(() => {
    return USER_LISTINGS.filter((item) => {
      if (item.dealType !== dealType) {
        return false;
      }
      if (city && item.city !== city) {
        return false;
      }
      if (objectType !== 'all' && item.type !== objectType) {
        return false;
      }
      const fromValue = Number(priceFrom.replace(/\s/g, ''));
      const toValue = Number(priceTo.replace(/\s/g, ''));
      if (Number.isFinite(fromValue) && fromValue > 0 && item.priceValue < fromValue) {
        return false;
      }
      if (Number.isFinite(toValue) && toValue > 0 && item.priceValue > toValue) {
        return false;
      }
      if (areaFilterRegion && !isInBounds(item, areaFilterRegion)) {
        return false;
      }
      return true;
    });
  }, [areaFilterRegion, city, dealType, objectType, priceFrom, priceTo]);

  const markers = useMemo<UserMapMarker[]>(
    () =>
      filteredListings.map((item) => ({
        id: `m-${item.id}`,
        lat: item.latitude,
        lng: item.longitude,
        price: item.price.replace(' 000 000', 'M').replace(' ₸', ' ₸'),
        listingId: item.id,
      })),
    [filteredListings]
  );

  const selectedListing = useMemo(() => {
    const marker = markers.find((item) => item.id === selectedMarkerId);
    if (!marker?.listingId) {
      return null;
    }
    return filteredListings.find((item) => item.id === marker.listingId) ?? null;
  }, [filteredListings, markers, selectedMarkerId]);

  const applyFilter = () => {
    if (city && CITY_REGIONS[city]) {
      setRegion(CITY_REGIONS[city]);
      setAreaFilterRegion(null);
      const firstCityListing = filteredListings.find((item) => item.city === city);
      setSelectedMarkerId(firstCityListing ? `m-${firstCityListing.id}` : null);
    } else if (!city && !areaFilterRegion) {
      setRegion(DEFAULT_REGION);
      setSelectedMarkerId(null);
    }
    setCityDropdownVisible(false);
    setFilterVisible(false);
  };

  const resetFilter = () => {
    setCity('');
    setCityDropdownVisible(false);
    setPriceFrom('');
    setPriceTo('');
    setObjectType('all');
    setAreaFilterRegion(null);
    setRegion(DEFAULT_REGION);
    setSelectedMarkerId(null);
    setFilterVisible(false);
  };

  const mapCityTitle = city || 'Казахстан';
  const mapSubtitle = areaFilterRegion
    ? 'Фильтр по области включен'
    : city
      ? `Объекты: ${city}`
      : 'Объекты по Казахстану';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerBtnPlaceholder} />
        <Text style={styles.headerTitle}>Каталог объектов</Text>
        <Pressable style={styles.headerBtn} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={20} color="#3A3A3A" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmented} onLayout={(e) => setSegmentWidth(e.nativeEvent.layout.width - 8)}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.segmentActivePill,
              { width: segmentWidth > 0 ? segmentWidth / 2 : '50%', transform: [{ translateX: sliderTranslateX }] },
            ]}
          />
          <Pressable style={styles.segment} onPress={() => onSelectDealType('buy')}>
            <Text style={[styles.segmentText, dealType === 'buy' && styles.segmentTextActive]}>Купить</Text>
          </Pressable>
          <Pressable style={styles.segment} onPress={() => onSelectDealType('rent')}>
            <Text style={[styles.segmentText, dealType === 'rent' && styles.segmentTextActive]}>Арендовать</Text>
          </Pressable>
        </View>

        <UserMapCard
          markers={markers}
          region={region}
          onRegionChange={setRegion}
          selectedMarkerId={selectedMarkerId}
          onMarkerPress={(marker) =>
            setSelectedMarkerId((current) => (current === marker.id ? null : marker.id))
          }
          onListPress={() => setShowList((prev) => !prev)}
          listLabel={showList ? 'Скрыть список' : 'Список'}
          onShowInAreaPress={() => setAreaFilterRegion(region)}
          cityTitle={mapCityTitle}
          citySubtitle={mapSubtitle}
        />

        {selectedListing ? (
          <Pressable
            style={styles.previewCard}
            onPress={() =>
              router.push({
                pathname: '/object/[id]',
                params: { id: selectedListing.id },
              })
            }>
            <Image source={selectedListing.image} style={styles.previewImage} contentFit="cover" />
            <View style={styles.previewBody}>
              <Text style={styles.previewTitle}>{selectedListing.title}</Text>
              <Text style={styles.previewPrice}>{selectedListing.price}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </Pressable>
        ) : null}

        <Text style={styles.foundText}>Найдено {filteredListings.length} объектов</Text>

        {showList
          ? filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPressDetails={() =>
                  router.push({ pathname: '/object/[id]', params: { id: listing.id } })
                }
              />
            ))
          : null}
      </ScrollView>

      <Modal visible={filterVisible} animationType="slide" transparent onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Фильтр</Text>
              <Pressable onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={22} color="#737373" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
              <Text style={styles.filterLabel}>Город</Text>
              <View style={styles.dropdownWrap}>
                <Pressable
                  style={[styles.filterInput, styles.dropdownTrigger]}
                  onPress={() => setCityDropdownVisible((prev) => !prev)}>
                  <Text style={city ? styles.dropdownValue : styles.dropdownPlaceholder}>
                    {city || 'Выберите город'}
                  </Text>
                  <Ionicons
                    name={cityDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#737373"
                  />
                </Pressable>

                {cityDropdownVisible ? (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                      <Pressable
                        style={[styles.dropdownItem, !city && styles.dropdownItemActive]}
                        onPress={() => {
                          setCity('');
                          setCityDropdownVisible(false);
                        }}>
                        <Text style={[styles.dropdownItemText, !city && styles.dropdownItemTextActive]}>
                          Все города
                        </Text>
                        {!city ? <Ionicons name="checkmark" size={18} color="#70A0FF" /> : null}
                      </Pressable>

                      {cityOptions.map((option) => (
                        <Pressable
                          key={option}
                          style={[styles.dropdownItem, city === option && styles.dropdownItemActive]}
                          onPress={() => {
                            setCity(option);
                            setCityDropdownVisible(false);
                          }}>
                          <Text
                            style={[
                              styles.dropdownItemText,
                              city === option && styles.dropdownItemTextActive,
                            ]}>
                            {option}
                          </Text>
                          {city === option ? <Ionicons name="checkmark" size={18} color="#70A0FF" /> : null}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </View>

              <Text style={styles.filterLabel}>Тип недвижимости</Text>
              <View style={styles.typeRow}>
                {(['all', 'Квартира', 'Студия', 'Пентхаус'] as ObjectType[]).map((type) => (
                  <Pressable
                    key={type}
                    style={[styles.typeChip, objectType === type && styles.typeChipActive]}
                    onPress={() => setObjectType(type)}>
                    <Text style={[styles.typeChipText, objectType === type && styles.typeChipTextActive]}>
                      {type === 'all' ? 'Все' : type}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterLabel}>Цена</Text>
              <View style={styles.priceRow}>
                <TextInput
                  value={priceFrom}
                  onChangeText={setPriceFrom}
                  keyboardType="number-pad"
                  placeholder="От"
                  placeholderTextColor="#939393"
                  style={[styles.filterInput, styles.priceInput]}
                />
                <TextInput
                  value={priceTo}
                  onChangeText={setPriceTo}
                  keyboardType="number-pad"
                  placeholder="До"
                  placeholderTextColor="#939393"
                  style={[styles.filterInput, styles.priceInput]}
                />
              </View>

              <Pressable style={styles.clearArea} onPress={() => setAreaFilterRegion(null)}>
                <Text style={styles.clearAreaText}>Сбросить фильтр по области карты</Text>
              </Pressable>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable style={styles.resetBtn} onPress={resetFilter}>
                <Text style={styles.resetBtnText}>Сбросить</Text>
              </Pressable>
              <Pressable style={styles.applyBtn} onPress={applyFilter}>
                <Text style={styles.applyBtnText}>Применить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtnPlaceholder: { width: 40, height: 40 },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 12 },
  segmented: {
    height: 40,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
    position: 'relative',
  },
  segmentActivePill: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 8,
    backgroundColor: '#70A0FF',
  },
  segment: { flex: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  segmentText: { fontSize: 14, lineHeight: 21, color: '#737373', fontWeight: '500' },
  segmentTextActive: { color: '#FFFFFF' },
  foundText: { fontSize: 14, lineHeight: 21, color: '#737373' },
  previewCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    minHeight: 74,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewImage: { width: 54, height: 54, borderRadius: 8 },
  previewBody: { flex: 1 },
  previewTitle: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  previewPrice: { marginTop: 2, fontSize: 14, lineHeight: 21, color: '#70A0FF', fontWeight: '600' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardImage: { height: 110, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
  cardPhoto: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 110,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tagText: { fontSize: 12, lineHeight: 18, color: '#3A3A3A', fontWeight: '500' },
  favoriteCircle: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 12 },
  price: { fontSize: 22, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
  title: { marginTop: 4, fontSize: 14, lineHeight: 21, color: '#3A3A3A' },
  address: { marginTop: 4, fontSize: 13, lineHeight: 20, color: '#939393' },
  statsRow: { marginTop: 8, flexDirection: 'row', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, lineHeight: 20, color: '#737373' },
  moreBtn: {
    marginTop: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtnText: { fontSize: 14, lineHeight: 21, color: '#70A0FF', fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '84%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
  },
  modalHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 20, lineHeight: 28, color: '#3A3A3A', fontWeight: '600' },
  modalContent: { padding: 16, gap: 12 },
  filterLabel: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  filterInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    color: '#3A3A3A',
    fontSize: 15,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownWrap: {
    position: 'relative',
    zIndex: 10,
  },
  dropdownValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3A3A3A',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    lineHeight: 22,
    color: '#939393',
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  dropdownScroll: {
    maxHeight: 220,
  },
  dropdownItem: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  dropdownItemTextActive: {
    color: '#70A0FF',
    fontWeight: '600',
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeChipActive: {
    backgroundColor: '#70A0FF',
    borderColor: '#70A0FF',
  },
  typeChipText: { fontSize: 13, lineHeight: 20, color: '#3A3A3A', fontWeight: '500' },
  typeChipTextActive: { color: '#FFFFFF' },
  priceRow: { flexDirection: 'row', gap: 10 },
  priceInput: { flex: 1 },
  clearArea: {
    marginTop: 2,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAreaText: { fontSize: 13, lineHeight: 20, color: '#70A0FF', fontWeight: '500' },
  modalActions: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    flexDirection: 'row',
    gap: 10,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { fontSize: 16, lineHeight: 24, color: '#737373', fontWeight: '500' },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF', fontWeight: '500' },
});
