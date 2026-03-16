import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserMapCard from '@/components/UserMapCard';
import { getAgencyListingById } from '@/constants/agencyData';

export default function AgencyListingViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const listing = getAgencyListingById(id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Объявление</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {listing ? (
          <>
            <View style={styles.card}>
              <Image source={listing.image} contentFit="cover" style={styles.image} />
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.subtitle}>{listing.type}</Text>
              <Text style={styles.price}>{listing.price}</Text>
              <View style={[styles.statusPill, { backgroundColor: listing.statusBg }]}>
                <Text style={[styles.statusText, { color: listing.statusColor }]}>{listing.status}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация</Text>
              <Text style={styles.location}>{listing.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: listing.id,
                      lat: listing.coordinates.latitude,
                      lng: listing.coordinates.longitude,
                      price: 'Объект',
                    },
                  ]}
                  selectedMarkerId={listing.id}
                  initialRegion={{
                    latitude: listing.coordinates.latitude,
                    longitude: listing.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={listing.title}
                  citySubtitle={listing.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>

            <Pressable style={styles.editButton} onPress={() => router.push(`/agency-edit-listing/${listing.id}` as any)}>
              <Text style={styles.editButtonText}>Редактировать объявление</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.empty}>Объявление не найдено</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 10 },
  image: { width: '100%', height: 200, borderRadius: 12 },
  title: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#939393' },
  price: { fontSize: 22, lineHeight: 30, fontWeight: '600', color: '#70A0FF' },
  statusPill: { alignSelf: 'flex-start', minHeight: 26, borderRadius: 999, paddingHorizontal: 12, justifyContent: 'center' },
  statusText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  description: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  editButton: { height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  editButtonText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  empty: { padding: 16, fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
