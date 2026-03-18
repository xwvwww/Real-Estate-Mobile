import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { DEVELOPER_PROJECTS } from '@/constants/developerData';
import { CARD_RADIUS, ELEVATED_CARD_SHADOW } from '@/constants/ui';

export default function DeveloperProjectsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/developer-dashboard')}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Проекты</Text>
      </View>

      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never">
          {DEVELOPER_PROJECTS.length === 0 ? (
            <EmptyState icon="business-outline" title="Пока нет проектов" description="Создайте первый проект, чтобы он появился в этом разделе" />
          ) : null}

          {DEVELOPER_PROJECTS.map((project) => (
            <Pressable
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push({ pathname: '/developer-project-view/[id]', params: { id: project.id } })}>
              <Text style={styles.projectTitle}>{project.title}</Text>

              <StatusBadge label={project.status} backgroundColor={project.statusBg} textColor={project.statusColor} />

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
            </Pressable>
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
    paddingBottom: 92,
    gap: 12,
  },
  projectCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    ...ELEVATED_CARD_SHADOW,
  },
  projectTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
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
