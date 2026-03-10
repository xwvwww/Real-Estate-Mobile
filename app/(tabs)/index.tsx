import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type RecentItem = {
  id: string;
  title: string;
  city: string;
  price: string;
  seenAgo: string;
  image: any;
};

type RequestItem = {
  id: string;
  title: string;
  agency: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
};

const RECENT_ITEMS: RecentItem[] = [
  {
    id: 'r1',
    title: '2-комнатная квартира',
    city: 'Алматы',
    price: '12 500 000 ₸',
    seenAgo: '2 дня назад',
    image: require('@/assets/images/ObjectOne.png'),
  },
  {
    id: 'r2',
    title: '3-комнатная квартира',
    city: 'Алматы',
    price: '18 900 000 ₸',
    seenAgo: '3 дня назад',
    image: require('@/assets/images/ObjectTwo.png'),
  },
  {
    id: 'r3',
    title: 'Студия в новостройке',
    city: 'Алматы',
    price: '9 200 000 ₸',
    seenAgo: '5 дней назад',
    image: require('@/assets/images/ObjectThree.png'),
  },
];

const REQUEST_ITEMS: RequestItem[] = [
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

export default function UserDashboardScreen() {
  const router = useRouter();
  const catalogScale = useRef(new Animated.Value(1)).current;
  const transitionOpacity = useRef(new Animated.Value(0)).current;

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
      // Reset animation state after route change so returning to this tab looks clean.
      catalogScale.setValue(1);
      transitionOpacity.setValue(0);
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
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
          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <View style={styles.metricIconBg}>
              <Ionicons name="heart-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricLabel}>Избранное</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <View style={styles.metricIconBg}>
              <Ionicons name="document-text-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>5</Text>
            <Text style={styles.metricLabel}>Активные заявки</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <View style={styles.metricIconBg}>
              <Ionicons name="chatbubble-outline" size={24} color="#70A0FF" />
            </View>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>Сообщения</Text>
          </View>

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

        {RECENT_ITEMS.map((item) => (
          <Pressable key={item.id} style={styles.recentCard} onPress={() => router.push({ pathname: '/object/[id]', params: { id: item.id } })}>
            <Image source={item.image} style={styles.recentImage} contentFit="cover" />
            <View style={styles.recentBody}>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentCity}>{item.city}</Text>
              <Text style={styles.recentPrice}>{item.price}</Text>
              <View style={styles.recentSeenRow}>
                <Ionicons name="time-outline" size={14} color="#8F8F8F" />
                <Text style={styles.recentSeenText}>{item.seenAgo}</Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={[styles.sectionHeader, styles.requestsHeader]}>
          <Text style={styles.sectionTitle}>Последние заявки</Text>
          <Pressable>
            <Text style={styles.sectionAction}>Все</Text>
          </Pressable>
        </View>

        {REQUEST_ITEMS.map((item) => (
          <Pressable key={item.id} style={styles.requestCard}>
            <View style={styles.requestTop}>
              <Text style={styles.requestTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            </View>
            <Text style={styles.requestAgency}>{item.agency}</Text>
            <View style={styles.requestBottom}>
              <Text style={styles.requestDate}>{item.date}</Text>
              <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Animated.View pointerEvents="none" style={[styles.transitionOverlay, { opacity: transitionOpacity }]} />
=======
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import UserMapCard from '@/components/UserMapCard';

type Listing = {
  id: string;
  type: string;
  price: string;
  title: string;
  address: string;
  beds: string;
  area: string;
  floor: string;
  photoColor: string;
};

const LISTINGS: Listing[] = [
  {
    id: '1',
    type: 'Квартира',
    price: '12 500 000 ₸',
    title: '2-комнатная квартира',
    address: 'ул. Абая 150',
    beds: '2',
    area: '65 м²',
    floor: '5 этаж',
    photoColor: '#E8DDD2',
  },
  {
    id: '2',
    type: 'Квартира',
    price: '18 900 000 ₸',
    title: '3-комнатная квартира',
    address: 'пр. Достык 97',
    beds: '3',
    area: '95 м²',
    floor: '12 этаж',
    photoColor: '#DDE7F0',
  },
  {
    id: '3',
    type: 'Новостройка',
    price: '9 200 000 ₸',
    title: 'Студия в новостройке',
    address: 'ул. Розыбакиева 289',
    beds: '1',
    area: '38 м²',
    floor: '8 этаж',
    photoColor: '#E7ECD5',
  },
  {
    id: '4',
    type: 'Дом',
    price: '45 000 000 ₸',
    title: 'Коттедж с участком',
    address: 'мкр. Алатау, ул. Жулдыз 45',
    beds: '5',
    area: '220 м²',
    floor: '2 этаж',
    photoColor: '#CFD8E8',
  },
];

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

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardImage, { backgroundColor: listing.photoColor }]}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{listing.type}</Text>
        </View>
        <Pressable style={styles.favoriteCircle}>
          <Ionicons name="heart-outline" size={18} color="#6C6C6C" />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.address}>{listing.address}</Text>
        <StatRow beds={listing.beds} area={listing.area} floor={listing.floor} />
        <Pressable style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>Подробнее</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function UserCatalogScreen() {
  const [dealType, setDealType] = useState<'buy' | 'rent'>('buy');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={20} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Каталог объектов</Text>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="options-outline" size={20} color="#3A3A3A" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmented}>
          <Pressable
            style={[styles.segment, dealType === 'buy' && styles.segmentActive]}
            onPress={() => setDealType('buy')}
          >
            <Text style={[styles.segmentText, dealType === 'buy' && styles.segmentTextActive]}>
              Купить
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segment, dealType === 'rent' && styles.segmentActive]}
            onPress={() => setDealType('rent')}
          >
            <Text style={[styles.segmentText, dealType === 'rent' && styles.segmentTextActive]}>
              Арендовать
            </Text>
          </Pressable>
        </View>

        <UserMapCard />

        <Text style={styles.foundText}>Найдено {LISTINGS.length} объектов</Text>

        {LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ScrollView>
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  scroll: { backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#333333' },
  content: { padding: 16, paddingBottom: 24, backgroundColor: '#F8F8F8' },
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
  statusPill: {
    paddingHorizontal: 12,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111827',
=======
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
  },
  segment: { flex: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: '#70A0FF' },
  segmentText: { fontSize: 14, lineHeight: 21, color: '#737373', fontWeight: '500' },
  segmentTextActive: { color: '#FFFFFF' },
  foundText: { fontSize: 14, lineHeight: 21, color: '#737373' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
  },
  cardImage: { height: 110, padding: 8, flexDirection: 'row', justifyContent: 'space-between' },
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
});
