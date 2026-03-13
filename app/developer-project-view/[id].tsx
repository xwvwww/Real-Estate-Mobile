import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDeveloperProjectById } from '@/constants/developerData';

export default function DeveloperProjectViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const project = getDeveloperProjectById(id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Проект</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {project ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{project.title}</Text>
              <Text style={styles.location}>{project.location}</Text>
              <View style={[styles.statusPill, { backgroundColor: project.statusBg }]}>
                <Text style={[styles.statusText, { color: project.statusColor }]}>{project.status}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Показатели</Text>
              <InfoRow label="Объектов" value={project.units} />
              <InfoRow label="Просмотры" value={project.views} />
              {project.createdAt ? <InfoRow label="Дата" value={project.createdAt.replace('Создан: ', '')} /> : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{project.description}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.empty}>Проект не найден</Text>
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
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  statusPill: { alignSelf: 'flex-start', minHeight: 26, borderRadius: 999, paddingHorizontal: 12, justifyContent: 'center' },
  statusText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  empty: { fontSize: 16, lineHeight: 24, color: '#3A3A3A' },
});
