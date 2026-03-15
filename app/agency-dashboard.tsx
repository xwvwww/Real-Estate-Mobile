import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { AGENCY_LISTINGS } from '@/constants/agencyData';

type MetricItem = {
  id: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  route?: string;
};

const METRICS: MetricItem[] = [
  {
    id: 'total',
    value: '42',
    label: 'Всего объявлений',
    icon: 'document-text-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
    route: '/agency-listings',
  },
  {
    id: 'active',
    value: '28',
    label: 'Активные объявления',
    icon: 'trending-up-outline',
    iconColor: '#4CAF50',
    iconBg: '#E8F5E9',
    route: '/agency-listings',
  },
  {
    id: 'moderation',
    value: '3',
    label: 'На модерации',
    icon: 'time-outline',
    iconColor: '#F57C00',
    iconBg: '#FFF3E0',
  },
  {
    id: 'views',
    value: '12 485',
    label: 'Просмотры',
    icon: 'eye-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
  {
    id: 'requests',
    value: '67',
    label: 'Заявки',
    icon: 'mail-open-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
    route: '/agency-requests',
  },
];

export default function AgencyDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Обзор</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.metricList}>
          {METRICS.map((metric) => (
            <Pressable
              key={metric.id}
              style={styles.metricCard}
              onPress={metric.route ? () => router.replace(metric.route as any) : undefined}>
              <View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <View style={[styles.metricIconWrap, { backgroundColor: metric.iconBg }]}>
                <Ionicons name={metric.icon} size={24} color={metric.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Последние объявления</Text>
          <Pressable onPress={() => router.replace('/agency-listings')}>
            <Text style={styles.sectionAction}>Все</Text>
          </Pressable>
        </View>

        <View style={styles.listingList}>
          {AGENCY_LISTINGS.slice(0, 3).map((listing) => (
            <Pressable key={listing.id} style={styles.listingCard} onPress={() => router.push(`/agency-listing-view/${listing.id}` as any)}>
              <Image source={listing.image} contentFit="cover" style={styles.listingImage} />
              <View style={styles.listingBody}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingType}>{listing.type}</Text>

                <View style={styles.listingMetaRow}>
                  <View style={[styles.statusPill, { backgroundColor: listing.statusBg }]}>
                    <Text style={[styles.statusText, { color: listing.statusColor }]}>{listing.status}</Text>
                  </View>
                  <Text style={styles.listingDate}>{listing.date}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AgencyBottomBar active="overview" />
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
    alignItems: 'flex-start',
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
  },
  metricList: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    minHeight: 105,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
  },
  metricIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  sectionAction: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#70A0FF',
  },
  listingList: {
    marginTop: 12,
    gap: 12,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
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
    fontWeight: '600',
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
  statusPill: {
    minHeight: 26,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  listingDate: {
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
});
