import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeveloperRequestById } from '@/constants/developerData';
import UserMapCard from '@/components/UserMapCard';

export default function DeveloperRequestViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const request = getDeveloperRequestById(id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Заявка</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {request ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{request.title}</Text>
              <Text style={styles.applicant}>{request.applicant}</Text>
              <Text style={styles.project}>{request.project}</Text>
              <StatusBadge label={request.status} backgroundColor={request.statusBg} textColor={request.statusColor} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Информация по клиенту</Text>
              <InfoRow label="Телефон" value={request.phone} />
              <InfoRow label="Доход" value={request.income} />
              <Text style={styles.note}>{request.note}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация объекта</Text>
              <Text style={styles.location}>{request.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: request.id,
                      lat: request.coordinates.latitude,
                      lng: request.coordinates.longitude,
                      price: 'Объект',
                    },
                  ]}
                  selectedMarkerId={request.id}
                  initialRegion={{
                    latitude: request.coordinates.latitude,
                    longitude: request.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={request.project}
                  citySubtitle={request.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Принять</Text>
              </Pressable>
              <Pressable style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Отклонить</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text style={styles.empty}>Заявка не найдена</Text>
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
  applicant: { fontSize: 15, lineHeight: 23, color: '#3A3A3A' },
  project: { fontSize: 14, lineHeight: 21, color: '#939393' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  note: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#FFF1F1', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, lineHeight: 22, color: '#E05A5A', fontWeight: '600' },
  empty: { fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
