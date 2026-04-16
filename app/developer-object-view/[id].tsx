import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeveloperObjectById } from '@/constants/developerData';
import UserMapCard from '@/components/UserMapCard';
import { useAuth } from '@/contexts/AuthContext';
import { deleteListing, fetchListingById, type ApiListing } from '@/lib/api';
import { mapApiListingToCatalogListing } from '@/lib/listings';

export default function DeveloperObjectViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const localObject = getDeveloperObjectById(id);
  const [remoteListing, setRemoteListing] = useState<ApiListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isBackendListing = /^\d+$/.test(id ?? '');

  useEffect(() => {
    if (!isBackendListing || !id) {
      setRemoteListing(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchListingById(id, session?.token)
      .then((nextListing) => {
        if (!cancelled) {
          setRemoteListing(nextListing);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : 'Не удалось загрузить объект.');
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
  }, [id, isBackendListing, session?.token]);

  const backendCard = useMemo(() => {
    if (!remoteListing) {
      return null;
    }

    return mapApiListingToCatalogListing(remoteListing);
  }, [remoteListing]);

  const onDelete = () => {
    if (!isBackendListing || !id || !session?.token || deleting) {
      return;
    }

    Alert.alert('Удалить объект?', 'Объект и его медиа будут удалены.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteListing(id, session.token);
            Alert.alert('Готово', 'Объект удален.');
            router.replace('/developer-objects');
          } catch (nextError) {
            Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось удалить объект.');
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
        <Text style={styles.headerTitle}>Объект</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <EmptyState icon="hourglass-outline" title="Загрузка объекта" description="Подождите немного" />
        ) : backendCard ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{backendCard.title}</Text>
              <Text style={styles.project}>{backendCard.propertyType}</Text>
              <Text style={styles.price}>{backendCard.price}</Text>
              <StatusBadge label={remoteListing?.status || 'Активно'} backgroundColor="#E8F5E9" textColor="#388E3C" />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Характеристики</Text>
              <InfoRow label="Комнаты" value={backendCard.roomsLabel} />
              <InfoRow label="Площадь" value={backendCard.areaLabel} />
              <InfoRow label="Этаж" value={backendCard.floorLabel} />
              <InfoRow label="Город" value={backendCard.city} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация объекта</Text>
              <Text style={styles.locationText}>{backendCard.address}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: backendCard.id,
                      lat: backendCard.latitude ?? 43.2389,
                      lng: backendCard.longitude ?? 76.8897,
                      price: backendCard.price,
                    },
                  ]}
                  selectedMarkerId={backendCard.id}
                  initialRegion={{
                    latitude: backendCard.latitude ?? 43.2389,
                    longitude: backendCard.longitude ?? 76.8897,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={backendCard.title}
                  citySubtitle={backendCard.address}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>

            <Pressable style={styles.editButton} onPress={() => router.push(`/developer-edit-object/${backendCard.id}` as any)}>
              <Text style={styles.editButtonText}>Редактировать объект</Text>
            </Pressable>

            <Pressable
              style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
              onPress={onDelete}
              disabled={deleting}>
              <Text style={styles.deleteButtonText}>{deleting ? 'Удаляем...' : 'Удалить объект'}</Text>
            </Pressable>
          </>
        ) : localObject ? (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{localObject.title}</Text>
              <Text style={styles.project}>{localObject.project}</Text>
              <Text style={styles.price}>{localObject.price}</Text>
              <StatusBadge label={localObject.status.label} backgroundColor={localObject.status.bg} textColor={localObject.status.color} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Характеристики</Text>
              <InfoRow label="Комнаты" value={localObject.rooms} />
              <InfoRow label="Площадь" value={localObject.area} />
              <InfoRow label="Этаж" value={localObject.floor} />
              <InfoRow label="Просмотры" value={localObject.views} />
              <InfoRow label="Дата" value={localObject.date} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация объекта</Text>
              <Text style={styles.locationText}>{localObject.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: localObject.id,
                      lat: localObject.coordinates.latitude,
                      lng: localObject.coordinates.longitude,
                      price: localObject.price,
                    },
                  ]}
                  selectedMarkerId={localObject.id}
                  initialRegion={{
                    latitude: localObject.coordinates.latitude,
                    longitude: localObject.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={localObject.title}
                  citySubtitle={localObject.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>
          </>
        ) : (
          <EmptyState
            icon="home-outline"
            title="Объект не найден"
            description={error || 'Откройте список объектов и выберите актуальную карточку'}
            actionLabel="К объектам"
            onAction={() => router.replace('/developer-objects')}
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
  project: { fontSize: 14, lineHeight: 21, color: '#939393' },
  price: { fontSize: 22, lineHeight: 30, color: '#70A0FF', fontWeight: '600' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  infoLabel: { fontSize: 14, lineHeight: 21, color: '#939393' },
  infoValue: { fontSize: 14, lineHeight: 21, color: '#3A3A3A', fontWeight: '500' },
  locationText: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  editButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
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
