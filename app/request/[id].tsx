import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApplications, fetchListingById } from '@/lib/api';
import { mapApiListingToCatalogListing } from '@/lib/listings';
import { mapApplicationToUserRequest, type UserRequestViewModel } from '@/lib/applications';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [request, setRequest] = useState<UserRequestViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id || !session?.token) {
      setRequest(null);
      setLoading(false);
      setLoadError('Войдите в аккаунт и выберите заявку');
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
            setRequest(null);
            setLoadError('Откройте список заявок и выберите актуальную заявку');
          }
          return;
        }

        let listing = null;
        try {
          listing = await fetchListingById(target.listing_id);
        } catch {
          listing = null;
        }

        if (!cancelled) {
          setRequest(mapApplicationToUserRequest(target, listing));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
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

  const listing = useMemo(() => {
    if (!request?.listing) {
      return null;
    }

    return mapApiListingToCatalogListing(request.listing);
  }, [request?.listing]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#3A3A3A" />
          </Pressable>
          <Text style={styles.headerTitle}>Заявка</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.emptyWrap}>
          <ActivityIndicator color="#70A0FF" />
          <Text style={styles.loadingText}>Загружаем заявку...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#3A3A3A" />
          </Pressable>
          <Text style={styles.headerTitle}>Заявка</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="document-text-outline"
            title="Заявка не найдена"
            description={loadError || 'Откройте список заявок и выберите актуальную заявку'}
            actionLabel="Вернуться к заявкам"
            onAction={() => router.replace('/(tabs)/requests')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Детали заявки</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {listing ? (
          <Pressable
            style={styles.objectCard}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: listing.id } })}>
            <Image source={listing.image} style={styles.objectImage} contentFit="cover" />
            <View style={styles.objectBody}>
              <Text style={styles.objectTitle}>{listing.title}</Text>
              <Text style={styles.objectAddress}>{listing.city}</Text>
              <Text style={styles.objectPrice}>{listing.price}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статус заявки</Text>
          <View style={styles.statusRow}>
            <StatusBadge label={request.status} backgroundColor={request.bg} textColor={request.color} size="md" />
            <Text style={styles.dateText}>{request.date}</Text>
          </View>
          <Text style={styles.noteText}>{request.note}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Контакты по заявке</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="business-outline" label="Компания" value={request.company} />
            <InfoRow icon="person-outline" label="Менеджер" value={request.manager} />
            <InfoRow icon="call-outline" label="Телефон" value={request.phone} />
          </View>
        </View>

        {request.response ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ответ по заявке</Text>
            <View style={styles.responseCard}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#70A0FF" />
              <Text style={styles.responseText}>{request.response}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push({ pathname: '/object/[id]', params: { id: request.listingId } })}>
            <Text style={styles.primaryBtnText}>Открыть объект</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/(tabs)/messages')}>
            <Text style={styles.secondaryBtnText}>Перейти в сообщения</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color="#70A0FF" />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    height: 63,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  objectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  objectImage: { width: 78, height: 78, borderRadius: 12 },
  objectBody: { flex: 1, gap: 2 },
  objectTitle: { fontSize: 16, lineHeight: 24, color: '#3A3A3A', fontWeight: '600' },
  objectAddress: { fontSize: 13, lineHeight: 20, color: '#939393' },
  objectPrice: { marginTop: 4, fontSize: 18, lineHeight: 24, color: '#70A0FF', fontWeight: '600' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 18, lineHeight: 27, color: '#3A3A3A', fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  dateText: { fontSize: 13, lineHeight: 20, color: '#939393' },
  noteText: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    lineHeight: 22,
    color: '#5D5D5D',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
  },
  infoTextWrap: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 12, lineHeight: 18, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  responseText: { fontSize: 14, lineHeight: 22, color: '#3A3A3A' },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
  secondaryBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, lineHeight: 22, color: '#70A0FF', fontWeight: '600' },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: { fontSize: 13, lineHeight: 20, color: '#737373' },
});
