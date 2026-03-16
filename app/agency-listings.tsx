import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgencyBottomBar } from '@/components/AgencyBottomBar';
import { StatusBadge } from '@/components/StatusBadge';
import { AGENCY_LISTINGS } from '@/constants/agencyData';
import { CARD_RADIUS, LIGHT_CARD_SHADOW } from '@/constants/ui';

export default function AgencyListingsScreen() {
  const router = useRouter();

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
          {AGENCY_LISTINGS.map((listing) => (
            <Pressable key={listing.id} style={styles.listingCard} onPress={() => router.push(`/agency-listing-view/${listing.id}` as any)}>
              <Image source={listing.image} contentFit="cover" style={styles.listingImage} />

              <View style={styles.listingBody}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingType}>{listing.type}</Text>

                <View style={styles.listingMetaRow}>
                  <StatusBadge label={listing.status} backgroundColor={listing.statusBg} textColor={listing.statusColor} />
                  <Text style={styles.listingDate}>{listing.date}</Text>
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
          ))}
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
