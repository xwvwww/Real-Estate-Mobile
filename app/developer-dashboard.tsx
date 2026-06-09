import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeveloperBottomBar } from '@/components/DeveloperBottomBar';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplications, fetchListings, fetchProjects, type ApiApplication, type ApiListing, type ApiProject } from '@/lib/api';
import { countActiveListings, countModerationListings, filterCompanyListings } from '@/lib/companyListings';

type MetricCard = {
  id: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

const METRICS: MetricCard[] = [
  {
    id: 'total',
    value: '5',
    label: 'Всего проектов',
    icon: 'business-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
  {
    id: 'active',
    value: '78',
    label: 'Активные объекты',
    icon: 'trending-up-outline',
    iconColor: '#388E3C',
    iconBg: '#E8F5E9',
  },
  {
    id: 'moderation',
    value: '4',
    label: 'На модерации',
    icon: 'time-outline',
    iconColor: '#F57C00',
    iconBg: '#FFF3E0',
  },
  {
    id: 'views',
    value: '24 567',
    label: 'Просмотры',
    icon: 'eye-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
  {
    id: 'requests',
    value: '142',
    label: 'Заявки',
    icon: 'mail-outline',
    iconColor: '#70A0FF',
    iconBg: '#F0F7FF',
  },
];

export default function DeveloperDashboardScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [objects, setObjects] = useState<ApiListing[]>([]);
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const openProjects = () => router.replace('/developer-projects');
  const openObjects = () => router.replace('/developer-objects');
  const openRequests = () => router.replace('/developer-requests');

  const onMetricPress = (id: string) => {
    if (id === 'total') return openProjects();
    if (id === 'active') return openObjects();
    if (id === 'requests') return openRequests();
  };

  useEffect(() => {
    let cancelled = false;

    if (!session?.token) {
      setProjects([]);
      setObjects([]);
      setApplications([]);
      setLoading(false);
      setLoadError('Войдите в аккаунт застройщика, чтобы увидеть обзор');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    Promise.all([
      fetchProjects(session.token),
      fetchListings({ dealType: 'buy' }),
      fetchListings({ dealType: 'rent' }),
      fetchApplications(session.token),
    ])
      .then(([nextProjects, saleListings, rentListings, nextApplications]) => {
        if (cancelled) {
          return;
        }

        setProjects(nextProjects);
        setObjects(filterCompanyListings([...saleListings, ...rentListings], session.user.company_id));
        setApplications(nextApplications);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProjects([]);
          setObjects([]);
          setApplications([]);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить обзор');
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
  }, [session]);

  const metrics = useMemo<MetricCard[]>(
    () => [
      { ...METRICS[0], value: String(projects.length) },
      { ...METRICS[1], value: String(countActiveListings(objects)) },
      { ...METRICS[2], value: String(countModerationListings(objects)) },
      { ...METRICS[3], value: '0' },
      { ...METRICS[4], value: String(applications.length) },
    ],
    [applications.length, objects, projects.length]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Обзор</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Загружаем обзор...</Text>
          </View>
        ) : null}

        {!loading && loadError ? (
          <EmptyState icon="cloud-offline-outline" title="Не удалось загрузить обзор" description={loadError} />
        ) : null}

        <View style={styles.metricsWrap}>
          {metrics.map((metric) => (
            <Pressable key={metric.id} style={styles.metricCard} onPress={() => onMetricPress(metric.id)}>
              <View style={styles.metricTextWrap}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <View style={[styles.metricIconWrap, { backgroundColor: metric.iconBg }]}>
                <Ionicons name={metric.icon} size={24} color={metric.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Активные проекты</Text>
          <Pressable onPress={openProjects}>
            <Text style={styles.sectionAction}>Все</Text>
          </Pressable>
        </View>

        <View style={styles.projectsWrap}>
          {!loading && !loadError && projects.length === 0 ? (
            <EmptyState icon="business-outline" title="Пока нет проектов" description="Создайте первый проект, чтобы он появился в обзоре" />
          ) : null}

          {projects.slice(0, 3).map((project) => (
            <Pressable
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push({ pathname: '/developer-project-view/[id]', params: { id: String(project.id) } })}>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <View style={styles.projectStatsRow}>
                <View style={styles.projectStat}>
                  <Text style={styles.projectStatLabel}>Город</Text>
                  <Text style={styles.projectStatValue}>{project.city}</Text>
                </View>
                <View style={styles.projectStat}>
                  <Text style={styles.projectStatLabel}>ID</Text>
                  <Text style={styles.projectStatValue}>{project.id}</Text>
                </View>
              </View>
              <StatusBadge label="Активен" backgroundColor="#E8F5E9" textColor="#388E3C" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <DeveloperBottomBar active="overview" />
    </SafeAreaView>
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
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  metricsWrap: {
    gap: 12,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#737373',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricTextWrap: {
    gap: 4,
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  metricLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
  },
  metricIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  sectionAction: {
    fontSize: 14,
    lineHeight: 21,
    color: '#70A0FF',
    fontWeight: '500',
  },
  projectsWrap: {
    marginTop: 12,
    gap: 12,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 150,
  },
  projectTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  projectStatsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  projectStat: {
    flex: 1,
  },
  projectStatLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: '#939393',
  },
  projectStatValue: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    color: '#3A3A3A',
  },
});
