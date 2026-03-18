import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeveloperProjectById } from '@/constants/developerData';
import UserMapCard from '@/components/UserMapCard';

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
              <StatusBadge label={project.status} backgroundColor={project.statusBg} textColor={project.statusColor} />
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

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация проекта</Text>
              <Text style={styles.locationText}>{project.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: project.id,
                      lat: project.coordinates.latitude,
                      lng: project.coordinates.longitude,
                      price: project.units,
                    },
                  ]}
                  selectedMarkerId={project.id}
                  initialRegion={{
                    latitude: project.coordinates.latitude,
                    longitude: project.coordinates.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                  }}
                  cityTitle={project.title}
                  citySubtitle={project.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>
          </>
        ) : (
          <EmptyState
            icon="business-outline"
            title="Проект не найден"
            description="Вернитесь к списку проектов и выберите существующий проект"
            actionLabel="К проектам"
            onAction={() => router.replace('/developer-projects')}
          />
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
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  locationText: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
});
