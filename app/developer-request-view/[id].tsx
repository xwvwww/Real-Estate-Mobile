import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDeveloperRequestById } from '@/constants/developerData';

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
              <View style={[styles.statusPill, { backgroundColor: request.statusBg }]}>
                <Text style={[styles.statusText, { color: request.statusColor }]}>{request.status}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Информация по клиенту</Text>
              <InfoRow label="Телефон" value={request.phone} />
              <InfoRow label="Доход" value={request.income} />
              <Text style={styles.note}>{request.note}</Text>
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
  statusPill: { alignSelf: 'flex-start', minHeight: 26, borderRadius: 999, paddingHorizontal: 12, justifyContent: 'center' },
  statusText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  note: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#FFF1F1', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, lineHeight: 22, color: '#E05A5A', fontWeight: '600' },
  empty: { fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
