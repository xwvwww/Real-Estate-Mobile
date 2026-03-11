import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';

type ObjectStatus = {
  label: string;
  color: string;
  bg: string;
};

type ObjectItem = {
  id: string;
  title: string;
  project: string;
  status: ObjectStatus;
  views: string;
  date: string;
};

const OBJECTS: ObjectItem[] = [
  {
    id: 'o1',
    title: '2-комнатная квартира 65 м²',
    project: 'ЖК "Comfort Town"',
    status: { label: 'Активно', color: '#388E3C', bg: '#E8F5E9' },
    views: '245',
    date: '15 февраля 2026',
  },
  {
    id: 'o2',
    title: '3-комнатная квартира 95 м²',
    project: 'ЖК "Green Valley"',
    status: { label: 'Активно', color: '#388E3C', bg: '#E8F5E9' },
    views: '189',
    date: '12 февраля 2026',
  },
  {
    id: 'o3',
    title: 'Студия 35 м²',
    project: 'ЖК "Smart City"',
    status: { label: 'На модерации', color: '#F57C00', bg: '#FFF3E0' },
    views: '67',
    date: '10 февраля 2026',
  },
];

export default function DeveloperObjectsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Кабинет застройщика</Text>
      </View>

      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never">
          {OBJECTS.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.project}>{item.project}</Text>

              <View style={styles.metaRow}>
                <View style={[styles.statusPill, { backgroundColor: item.status.bg }]}>
                  <Text style={[styles.statusText, { color: item.status.color }]}>{item.status.label}</Text>
                </View>

                <View style={styles.viewsWrap}>
                  <Ionicons name="eye-outline" size={14} color="#939393" />
                  <Text style={styles.viewsText}>{item.views}</Text>
                </View>
              </View>

              <Text style={styles.date}>{item.date}</Text>
            </View>
          ))}
        </ScrollView>

        <Pressable style={styles.addButton} onPress={() => router.push('/developer-create-object')}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <DeveloperBottomBar active="objects" />
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
  main: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
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
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  project: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
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
  viewsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#939393',
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#70A0FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
