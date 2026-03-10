import { Ionicons } from '@expo/vector-icons';
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
