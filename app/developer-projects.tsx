import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';

type ProjectItem = {
  id: string;
  title: string;
  status: string;
  statusColor: string;
  statusBg: string;
  units: string;
  views: string;
  createdAt?: string;
};

const PROJECTS: ProjectItem[] = [
  {
    id: 'comfort-town',
    title: 'ЖК "Comfort Town"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '35',
    views: '8 453',
  },
  {
    id: 'green-valley',
    title: 'ЖК "Green Valley"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '28',
    views: '6 234',
  },
  {
    id: 'smart-city',
    title: 'ЖК "Smart City"',
    status: 'На модерации',
    statusColor: '#F57C00',
    statusBg: '#FFF3E0',
    units: '15',
    views: '3 890',
  },
  {
    id: 'premium-plaza',
    title: 'ЖК "Premium Plaza"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '42',
    views: '9 876',
    createdAt: 'Создан: 1 января 2026',
  },
  {
    id: 'city-park',
    title: 'ЖК "City Park"',
    status: 'Активно',
    statusColor: '#388E3C',
    statusBg: '#E8F5E9',
    units: '22',
    views: '4 532',
    createdAt: 'Создан: 15 декабря 2025',
  },
];

export default function DeveloperProjectsScreen() {
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
          {PROJECTS.map((project) => (
            <View key={project.id} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{project.title}</Text>

              <View style={[styles.statusPill, { backgroundColor: project.statusBg }]}>
                <Text style={[styles.statusText, { color: project.statusColor }]}>{project.status}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>Объектов</Text>
                  <Text style={styles.statValue}>{project.units}</Text>
                </View>
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>Просмотры</Text>
                  <Text style={styles.statValue}>{project.views}</Text>
                </View>
              </View>

              {project.createdAt ? <Text style={styles.createdText}>{project.createdAt}</Text> : null}
            </View>
          ))}
        </ScrollView>

        <Pressable style={styles.addButton} onPress={() => router.push('/developer-create-project')}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <DeveloperBottomBar active="projects" />
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
  projectCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  projectTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  statusPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 17,
    color: '#939393',
  },
  statValue: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  createdText: {
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
