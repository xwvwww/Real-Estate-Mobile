import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import UserMapCard from '@/components/UserMapCard';
import { getAgencyListingById } from '@/constants/agencyData';
import { useAuth } from '@/contexts/AuthContext';
import { deleteListing, fetchListingById, type ApiListing } from '@/lib/api';
import { mapApiListingToCatalogListing } from '@/lib/listings';

export default function AgencyListingViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const localListing = getAgencyListingById(id);
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
          setError(nextError instanceof Error ? nextError.message : 'Не удалось загрузить объявление.');
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

    Alert.alert('Удалить объявление?', 'Объявление и его медиа будут удалены.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteListing(id, session.token);
            Alert.alert('Готово', 'Объявление удалено.');
            router.replace('/agency-listings');
          } catch (nextError) {
            Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось удалить объявление.');
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
        <Text style={styles.headerTitle}>Объявление</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <EmptyState icon="hourglass-outline" title="Загрузка объявления" description="Подождите немного" />
        ) : backendCard ? (
          <>
            <View style={styles.card}>
              <Image source={backendCard.image} contentFit="cover" style={styles.image} />
              <Text style={styles.title}>{backendCard.title}</Text>
              <Text style={styles.subtitle}>{backendCard.propertyType}</Text>
              <Text style={styles.price}>{backendCard.price}</Text>
              <StatusBadge label={remoteListing?.status || 'Активно'} backgroundColor="#E8F5E9" textColor="#388E3C" />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{backendCard.description}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация</Text>
              <Text style={styles.location}>{backendCard.address}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: backendCard.id,
                      lat: backendCard.latitude ?? 43.2389,
                      lng: backendCard.longitude ?? 76.8897,
                      price: 'Объект',
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

            <Pressable style={styles.editButton} onPress={() => router.push(`/agency-edit-listing/${backendCard.id}` as any)}>
              <Text style={styles.editButtonText}>Редактировать объявление</Text>
            </Pressable>

            <Pressable
              style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
              onPress={onDelete}
              disabled={deleting}>
              <Text style={styles.deleteButtonText}>{deleting ? 'Удаляем...' : 'Удалить объявление'}</Text>
            </Pressable>
          </>
        ) : localListing ? (
          <>
            <View style={styles.card}>
              <Image source={localListing.image} contentFit="cover" style={styles.image} />
              <Text style={styles.title}>{localListing.title}</Text>
              <Text style={styles.subtitle}>{localListing.type}</Text>
              <Text style={styles.price}>{localListing.price}</Text>
              <StatusBadge label={localListing.status} backgroundColor={localListing.statusBg} textColor={localListing.statusColor} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Описание</Text>
              <Text style={styles.description}>{localListing.description}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Локация</Text>
              <Text style={styles.location}>{localListing.location}</Text>
              <View style={styles.mapWrap}>
                <UserMapCard
                  height={220}
                  markers={[
                    {
                      id: localListing.id,
                      lat: localListing.coordinates.latitude,
                      lng: localListing.coordinates.longitude,
                      price: 'Объект',
                    },
                  ]}
                  selectedMarkerId={localListing.id}
                  initialRegion={{
                    latitude: localListing.coordinates.latitude,
                    longitude: localListing.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  cityTitle={localListing.title}
                  citySubtitle={localListing.location}
                  showListButton={false}
                  showScopeButton={false}
                />
              </View>
            </View>

            <Pressable style={styles.editButton} onPress={() => router.push(`/agency-edit-listing/${localListing.id}` as any)}>
              <Text style={styles.editButtonText}>Редактировать объявление</Text>
            </Pressable>
          </>
        ) : (
          <EmptyState
            icon="newspaper-outline"
            title="Объявление не найдено"
            description={error || 'Вернитесь к списку объявлений и выберите существующую карточку'}
            actionLabel="К объявлениям"
            onAction={() => router.replace('/agency-listings')}
          />
        )}
      </ScrollView>
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, gap: 10 },
  image: { width: '100%', height: 200, borderRadius: 12 },
  title: { fontSize: 18, lineHeight: 27, fontWeight: '600', color: '#3A3A3A' },
  subtitle: { fontSize: 14, lineHeight: 21, color: '#939393' },
  price: { fontSize: 22, lineHeight: 30, fontWeight: '600', color: '#70A0FF' },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#3A3A3A' },
  description: { fontSize: 14, lineHeight: 22, color: '#5D5D5D' },
  location: { fontSize: 14, lineHeight: 21, color: '#939393' },
  mapWrap: { marginTop: 4 },
  editButton: { height: 48, borderRadius: 12, backgroundColor: '#70A0FF', alignItems: 'center', justifyContent: 'center' },
  editButtonText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
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
