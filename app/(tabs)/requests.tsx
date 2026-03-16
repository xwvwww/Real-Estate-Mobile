import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBadge } from '@/components/StatusBadge';
import { USER_REQUESTS } from '@/constants/userRequests';

export default function UserRequestsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои заявки</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {USER_REQUESTS.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/request/[id]', params: { id: item.id } })}>
            <View style={styles.topRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            </View>
            <Text style={styles.company}>{item.company}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.date}>{item.date}</Text>
              <StatusBadge label={item.status} backgroundColor={item.bg} textColor={item.color} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 15, lineHeight: 23, color: '#3A3A3A', fontWeight: '600' },
  company: { fontSize: 13, lineHeight: 20, color: '#939393' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: 12, lineHeight: 18, color: '#939393' },
});
