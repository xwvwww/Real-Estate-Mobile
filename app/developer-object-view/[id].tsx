import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeveloperObjectById } from '@/constants/developerData';
import UserMapCard from '@/components/UserMapCard';

export default function DeveloperObjectViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const object = getDeveloperObjectById(id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Объект</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {object ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{object.title}</Text>
              <Text style={styles.project}>{object.project}</Text>
              <Text style={styles.price}>{object.price}</Text>
              <StatusBadge label={object.status.label} backgroundColor={object.status.bg} textColor={object.status.color} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Характеристики</Text>
              <InfoRow label="Комнаты" value={object.rooms} />
              <InfoRow label="Площадь" value={object.area} />
              <InfoRow label="Этаж" value={object.floor} />
              <InfoRow label="Просмотры" value={object.views} />
              <InfoRow label="Дата" value={object.date} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация объекта</Text>
              <Text style={styles.locationText}>{object.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: object.id,
                      lat: object.coordinates.latitude,
                      lng: object.coordinates.longitude,
                      price: object.price,
                    },
                  ]}
                  selectedMarkerId={object.id}
                  initialRegion={{
                    latitude: object.coordinates.latitude,
                    longitude: object.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={object.title}
                  citySubtitle={object.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>
          </>
        ) : (
          <EmptyState
            icon="home-outline"
            title="Объект не найден"
            description="Откройте список объектов и выберите актуальную карточку"
            actionLabel="К объектам"
            onAction={() => router.replace('/developer-objects')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 10 },
  title: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  project: { fontSize: 14, lineHeight: 21, color: '#939393' },
  price: { fontSize: 22, lineHeight: 30, color: '#70A0FF', fontWeight: '600' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  locationText: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
});
