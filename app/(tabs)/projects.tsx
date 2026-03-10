<<<<<<< HEAD
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
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
  image: any;
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
    image: require('@/assets/images/ObjectOne.png'),
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
    image: require('@/assets/images/ObjectTwo.png'),
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
    image: require('@/assets/images/ObjectThree.png'),
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
    image: require('@/assets/images/ObjectFour.png'),
  },
  {
    id: '5',
    type: 'Квартира',
    price: '8 500 000 ₸',
    title: '1-комнатная квартира',
    address: 'ул. Тимирязева 42',
    beds: '1',
    area: '42 м²',
    floor: '3 этаж',
    image: require('@/assets/images/ObjectFive.png'),
  },
  {
    id: '6',
    type: 'Квартира',
    price: '25 000 000 ₸',
    title: '4-комнатная квартира',
    address: 'пр. Аль-Фараби 77',
    beds: '4',
    area: '130 м²',
    floor: '15 этаж',
    image: require('@/assets/images/ObjectSix.png'),
  },
  {
    id: '7',
    type: 'Новостройка',
    price: '14 200 000 ₸',
    title: '2-комнатная в ЖК "Comfort Town"',
    address: 'ул. Сатпаева 89',
    beds: '2',
    area: '68 м²',
    floor: '10 этаж',
    image: require('@/assets/images/ObjectSeven.png'),
  },
  {
    id: '8',
    type: 'Дом',
    price: '38 500 000 ₸',
    title: 'Таунхаус в закрытом комплексе',
    address: 'мкр. Мирас, ул. Садовая 12',
    beds: '4',
    area: '180 м²',
    floor: '2 этаж',
    image: require('@/assets/images/ObjectEight.png'),
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

function ListingCard({
  listing,
  onPressDetails,
}: {
  listing: Listing;
  onPressDetails: () => void;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const onToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerBtnPlaceholder} />
        <Text style={styles.headerTitle}>Каталог объектов</Text>
        <Pressable style={styles.headerBtn}>
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
          <Pressable
            style={styles.segment}
            onPress={() => onSelectDealType('buy')}
          >
            <Text style={[styles.segmentText, dealType === 'buy' && styles.segmentTextActive]}>
              Купить
            </Text>
          </Pressable>
          <Pressable
            style={styles.segment}
            onPress={() => onSelectDealType('rent')}
          >
            <Text style={[styles.segmentText, dealType === 'rent' && styles.segmentTextActive]}>
              Арендовать
            </Text>
          </Pressable>
        </View>

        <UserMapCard />

        <Text style={styles.foundText}>Найдено {LISTINGS.length} объектов</Text>

        {LISTINGS.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onPressDetails={() =>
              router.push({ pathname: '/object/[id]', params: { id: listing.id } })
            }
          />
        ))}
      </ScrollView>
=======
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProjectsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Проекты</Text>
        <Text style={styles.subtitle}>Следующий экран по дизайну доделаем следующим шагом.</Text>
      </View>
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
<<<<<<< HEAD
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
=======
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', color: '#2F2F2F' },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 22, color: '#737373' },
>>>>>>> a6cf9b0a1952f5ef070b197f1a41b9f238c917b2
});
