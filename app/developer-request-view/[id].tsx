import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import UserMapCard from '@/components/UserMapCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchApplications,
  fetchListingById,
  updateApplicationStatus,
  type ApiApplication,
} from '@/lib/api';
import { mapApplicationToCompanyRequest, type CompanyRequestViewModel } from '@/lib/applications';

type ActionConfig = {
  primary?: { label: string; nextStatus: 'review' | 'approved' };
  secondary?: { label: string; nextStatus: 'rejected' };
};

function getActionConfig(status: ApiApplication['status']): ActionConfig {
  if (status === 'new') {
    return {
      primary: { label: 'В работу', nextStatus: 'review' },
      secondary: { label: 'Отклонить', nextStatus: 'rejected' },
    };
  }

  if (status === 'review') {
    return {
      primary: { label: 'Одобрить', nextStatus: 'approved' },
      secondary: { label: 'Отклонить', nextStatus: 'rejected' },
    };
  }

  return {};
}

export default function DeveloperRequestViewScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [application, setApplication] = useState<ApiApplication | null>(null);
  const [request, setRequest] = useState<CompanyRequestViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!id || !session?.token) {
      setApplication(null);
      setRequest(null);
      setLoading(false);
      setLoadError('Войдите в аккаунт застройщика и выберите заявку');
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setLoadError(null);

    fetchApplications(session.token)
      .then(async (items) => {
        const target = items.find((item) => String(item.id) === id);

        if (!target) {
          if (!cancelled) {
            setApplication(null);
            setRequest(null);
            setLoadError('Откройте список заявок и выберите актуальную заявку');
          }
          return;
        }

        const listing = await fetchListingById(target.listing_id, session.token).catch(() => null);

        if (cancelled) {
          return;
        }

        setApplication(target);
        setRequest(mapApplicationToCompanyRequest(target, listing));
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setApplication(null);
          setRequest(null);
          setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить заявку');
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

  const actionConfig = useMemo(
    () => (application ? getActionConfig(application.status) : {}),
    [application]
  );

  const handleStatusUpdate = async (nextStatus: 'review' | 'approved' | 'rejected') => {
    if (!id || !session?.token || !application || updatingStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);
      const updated = await updateApplicationStatus(id, nextStatus, session.token);
      setApplication(updated);
      setRequest((current) =>
        current ? mapApplicationToCompanyRequest(updated, current.listing ?? null) : current
      );
    } catch (error) {
      Alert.alert(
        'Не удалось обновить статус',
        error instanceof Error ? error.message : 'Попробуйте еще раз.'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Заявка</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#70A0FF" />
            <Text style={styles.loadingText}>Загружаем заявку...</Text>
          </View>
        ) : null}

        {!loading && request ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{request.title}</Text>
              <Text style={styles.applicant}>{request.applicantName}</Text>
              <Text style={styles.project}>{request.summary}</Text>
              <View style={styles.statusRow}>
                <StatusBadge
                  label={request.status}
                  backgroundColor={request.bg}
                  textColor={request.color}
                />
                <Text style={styles.dateText}>{request.date}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Информация по клиенту</Text>
              {request.details.map((item) => (
                <InfoRow key={item.label} label={item.label} value={item.value} />
              ))}
              <Text style={styles.note}>{request.comment}</Text>
            </View>

            {request.listing?.latitude && request.listing?.longitude ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Локация объекта</Text>
                <Text style={styles.location}>{request.listing.address}</Text>
                <View style={styles.mapWrap}>
                  <UserMapCard
                    height={220}
                    markers={[
                      {
                        id: request.id,
                        lat: request.listing.latitude,
                        lng: request.listing.longitude,
                        price: 'Объект',
                      },
                    ]}
                    selectedMarkerId={request.id}
                    initialRegion={{
                      latitude: request.listing.latitude,
                      longitude: request.listing.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                    cityTitle={request.title}
                    citySubtitle={request.listing.address}
                    showListButton={false}
                    showScopeButton={false}
                  />
                </View>
              </View>
            ) : null}

            {actionConfig.primary || actionConfig.secondary ? (
              <View style={styles.actionRow}>
                {actionConfig.primary ? (
                  <Pressable
                    style={[styles.primaryBtn, updatingStatus && styles.btnDisabled]}
                    disabled={updatingStatus}
                    onPress={() => handleStatusUpdate(actionConfig.primary!.nextStatus)}>
                    <Text style={styles.primaryBtnText}>{actionConfig.primary.label}</Text>
                  </Pressable>
                ) : null}
                {actionConfig.secondary ? (
                  <Pressable
                    style={[styles.secondaryBtn, updatingStatus && styles.btnDisabled]}
                    disabled={updatingStatus}
                    onPress={() => handleStatusUpdate(actionConfig.secondary!.nextStatus)}>
                    <Text style={styles.secondaryBtnText}>{actionConfig.secondary.label}</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.infoText}>
                  Статус уже финализирован. Продолжайте работу по заявке через сообщения с клиентом.
                </Text>
              </View>
            )}
          </>
        ) : null}

        {!loading && !request ? (
          <EmptyState
            icon="mail-unread-outline"
            title="Заявка не найдена"
            description={loadError || 'Вернитесь в список заявок и откройте существующую запись'}
            actionLabel="К заявкам"
            onAction={() => router.replace('/developer-requests')}
          />
        ) : null}
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
  loadingWrap: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  loadingText: { fontSize: 13, lineHeight: 20, color: '#737373' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 10 },
  title: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  applicant: { fontSize: 15, lineHeight: 23, color: '#3A3A3A' },
  project: { fontSize: 14, lineHeight: 21, color: '#939393' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  dateText: { fontSize: 13, lineHeight: 20, color: '#939393' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393', flex: 1 },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500', flex: 1, textAlign: 'right' },
  note: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#FFF1F1', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, lineHeight: 22, color: '#E05A5A', fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
  infoText: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
});
