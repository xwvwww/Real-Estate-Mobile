import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserMapCard from '@/components/UserMapCard';
import { getAgencyRequestById } from '@/constants/agencyData';

export default function AgencyRequestViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const request = getAgencyRequestById(id);

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
              <Text style={styles.title}>{request.objectTitle}</Text>
              <Text style={styles.name}>{request.applicantName}</Text>
              <Text style={styles.summary}>{request.summary}</Text>
              <View style={[styles.statusPill, { backgroundColor: request.status.bgColor }]}>
                <Text style={[styles.statusText, { color: request.status.textColor }]}>{request.status.label}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Информация о клиенте</Text>
              <InfoRow label="Телефон" value={request.phone} />
              <InfoRow label="Доход" value={request.income} />
              <Text style={styles.location}>{request.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[{ id: request.id, lat: request.coordinates.latitude, lng: request.coordinates.longitude, price: 'Объект' }]}
                  selectedMarkerId={request.id}
                  initialRegion={{
                    latitude: request.coordinates.latitude,
                    longitude: request.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={request.objectTitle}
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
  header: { height: 73, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', left: 12, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 10 },
  title: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  name: { fontSize: 15, lineHeight: 23, color: '#3A3A3A' },
  summary: { fontSize: 14, lineHeight: 21, color: '#939393' },
  statusPill: { alignSelf: 'flex-start', minHeight: 26, borderRadius: 999, paddingHorizontal: 12, justifyContent: 'center' },
  statusText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#FFF1F1', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, lineHeight: 22, color: '#E05A5A', fontWeight: '600' },
  empty: { padding: 16, fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
