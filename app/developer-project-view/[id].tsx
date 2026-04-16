import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { deleteProject, fetchProjectById, type ApiProject } from '@/lib/api';

export default function DeveloperProjectViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!session?.token || !id) {
      setProject(null);
      setLoading(false);
      setError('Проект не найден.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProjectById(id, session.token)
      .then((nextProject) => {
        if (!cancelled) {
          setProject(nextProject);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : 'Не удалось загрузить проект.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, session?.token]);

  const onDelete = () => {
    if (!project || !session?.token || deleting) {
      return;
    }

    Alert.alert('Удалить проект?', 'Связанные объекты останутся, но project_id будет очищен.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteProject(project.id, session.token);
            Alert.alert('Готово', 'Проект удален.');
            router.replace('/developer-projects');
          } catch (nextError) {
            Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось удалить проект.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Проект</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <EmptyState icon="hourglass-outline" title="Загрузка проекта" description="Подождите немного" />
        ) : project ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{project.name}</Text>
              <Text style={styles.location}>{project.city}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Показатели</Text>
              <InfoRow label="ID" value={String(project.id)} />
              <InfoRow label="Город" value={project.city} />
              <InfoRow label="Дата" value={formatProjectDate(project.created_at)} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{project.description || 'Описание не указано'}</Text>
            </View>

            <Pressable
              style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
              onPress={onDelete}
              disabled={deleting}>
              <Text style={styles.deleteButtonText}>{deleting ? 'Удаляем...' : 'Удалить проект'}</Text>
            </Pressable>
          </>
        ) : (
          <EmptyState
            icon="business-outline"
            title="Проект не найден"
            description={error || 'Вернитесь к списку проектов и выберите существующий проект'}
            actionLabel="К проектам"
            onAction={() => router.replace('/developer-projects')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
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
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  deleteButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#C84D4D',
    fontWeight: '600',
  },
});
