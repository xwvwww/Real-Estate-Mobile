import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';

type RequestItem = {
  id: string;
  title: string;
  applicant: string;
  note: string;
  status: string;
  statusColor: string;
  statusBg: string;
};

const REQUESTS: RequestItem[] = [
  {
    id: 'r1',
    title: '2-комнатная квартира 65 м²',
    applicant: 'Иван Иванов',
    note: 'Семья из 3 человек, доход подтвержден',
    status: 'Новая',
    statusColor: '#1976D2',
    statusBg: '#E3F2FD',
  },
  {
    id: 'r2',
    title: '3-комнатная квартира 95 м²',
    applicant: 'Мария Петрова',
    note: 'Семья из 2 человек, постоянный доход',
    status: 'Рассматривается',
    statusColor: '#F57C00',
    statusBg: '#FFF3E0',
  },
];

export default function DeveloperRequestsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Кабинет застройщика</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {REQUESTS.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text style={styles.title}>{request.title}</Text>
            <Text style={styles.applicant}>{request.applicant}</Text>
            <Text style={styles.note}>{request.note}</Text>
            <View style={[styles.statusPill, { backgroundColor: request.statusBg }]}>
              <Text style={[styles.statusText, { color: request.statusColor }]}>{request.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <DeveloperBottomBar active="requests" />
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
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  applicant: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  note: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  statusPill: {
    marginTop: 14,
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
