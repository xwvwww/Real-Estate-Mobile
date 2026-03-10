import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import UserMapCard from '@/components/UserMapCard';

const OBJECT_IMAGE = require('@/assets/images/ObjectNine.png');

const FEATURES = ['Ремонт', 'Мебель', 'Техника', 'Балкон', 'Парковка'];

export default function ObjectDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.heroWrap}>
        <Image source={OBJECT_IMAGE} style={styles.heroImage} contentFit="cover" />

        <Pressable style={styles.topLeftBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3A3A3A" />
        </Pressable>

        <View style={styles.topRightButtons}>
          <Pressable style={styles.roundBtn}>
            <Ionicons name="share-social-outline" size={20} color="#3A3A3A" />
          </Pressable>
          <Pressable style={styles.roundBtn}>
            <Ionicons name="heart-outline" size={20} color="#3A3A3A" />
          </Pressable>
        </View>

        <Pressable style={styles.sideBtnLeft}>
          <Ionicons name="chevron-back" size={18} color="#3A3A3A" />
        </Pressable>
        <Pressable style={styles.sideBtnRight}>
          <Ionicons name="chevron-forward" size={18} color="#3A3A3A" />
        </Pressable>

        <View style={styles.badgeType}>
          <Text style={styles.badgeTypeText}>Новостройка</Text>
        </View>
        <View style={styles.badgeCounter}>
          <Text style={styles.badgeCounterText}>1 / 3</Text>
        </View>
      </View>

      <View style={styles.sliderDots}>
        <View style={styles.dotActive} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.price}>9 200 000 ₸</Text>
        <Text style={styles.title}>Студия в новостройке</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color="#939393" />
          <Text style={styles.address}>ул. Розыбакиева 289</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="bed-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>комнат</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="resize-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>38</Text>
            <Text style={styles.statLabel}>м²</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="business-outline" size={20} color="#70A0FF" />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>этаж</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.sectionText}>
          Новая студия в современном жилом комплексе. Идеально подходит для молодой пары или
          студента.
        </Text>

        <Text style={styles.sectionTitle}>Особенности</Text>
        <View style={styles.featureWrap}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureTag}>
              <Text style={styles.featureTagText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Расположение</Text>
        <UserMapCard />

        <View style={styles.agencyCard}>
          <View style={styles.agencyHeader}>
            <View style={styles.agencyAvatar}>
              <Text style={styles.agencyAvatarText}>AH</Text>
            </View>
            <View>
              <Text style={styles.agencyName}>Агентство недвижимости</Text>
              <Text style={styles.agencyStatus}>Проверено</Text>
            </View>
          </View>
          <Text style={styles.agencyText}>
            Профессиональная помощь в подборе и оформлении недвижимости
          </Text>
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
        <Pressable
          style={styles.primaryAction}
          onPress={() => router.push({ pathname: '/object-application', params: { id } })}>
          <Text style={styles.primaryActionText}>Оставить заявку</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
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
  sideBtnLeft: {
    position: 'absolute',
    left: 8,
    top: 122,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnRight: {
    position: 'absolute',
    right: 8,
    top: 122,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
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
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: '#E0E0E0' },
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
