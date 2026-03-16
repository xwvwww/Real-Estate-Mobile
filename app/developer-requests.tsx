import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import { StatusBadge } from '@/components/StatusBadge';
import { DEVELOPER_REQUESTS } from '@/constants/developerData';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';

export default function DeveloperRequestsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Заявки</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {DEVELOPER_REQUESTS.map((request) => (
          <Pressable
            key={request.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/developer-request-view/[id]', params: { id: request.id } })}>
            <Text style={styles.title}>{request.title}</Text>
            <Text style={styles.applicant}>{request.applicant}</Text>
            <Text style={styles.note}>{request.note}</Text>
            <StatusBadge label={request.status} backgroundColor={request.statusBg} textColor={request.statusColor} />
          </Pressable>
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
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    ...ELEVATED_CARD_SHADOW,
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
});
