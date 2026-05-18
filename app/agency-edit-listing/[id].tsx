import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import {
  deleteListingMedia,
  fetchListingById,
  type ApiListing,
  type ListingUploadFile,
  updateListing,
  uploadListingMedia,
} from '@/lib/api';
import { formatPriceInput, parsePriceInput } from '@/lib/price';

let DocumentPicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DocumentPicker = require('expo-document-picker');
} catch {
  DocumentPicker = null;
}

export default function AgencyEditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const isBackendListing = /^\d+$/.test(id ?? '');

  const [listing, setListing] = useState<ApiListing | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBackendListing || !id || !session?.token) {
      setLoading(false);
      setError('Редактирование доступно только для backend-объявлений.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchListingById(id, session.token)
      .then((nextListing) => {
        if (cancelled) {
          return;
        }

        setListing(nextListing);
        setTitle(nextListing.title);
        setPrice(formatPriceInput(String(nextListing.price)));
        setCity(nextListing.city);
        setAddress(nextListing.address ?? '');
        setDescription(nextListing.description ?? '');
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

  const media = useMemo(
    () => [...(listing?.media ?? [])].sort((left, right) => left.position - right.position),
    [listing?.media]
  );

  const canSave = Boolean(
    title.trim() &&
      city.trim() &&
      address.trim() &&
      description.trim() &&
      Number.isFinite(parsePriceInput(price)) &&
      parsePriceInput(price) > 0
  );

  const reloadListing = async () => {
    if (!id || !session?.token) {
      return;
    }

    const nextListing = await fetchListingById(id, session.token);
    setListing(nextListing);
  };

  const onSave = async () => {
    if (!id || !session?.token || !canSave || saving) {
      return;
    }

    try {
      setSaving(true);
      const nextListing = await updateListing(
        id,
        {
          title: title.trim(),
          price: parsePriceInput(price),
          city: city.trim(),
          address: address.trim(),
          description: description.trim(),
        },
        session.token
      );

      setListing(nextListing);
      Alert.alert('Готово', 'Объявление обновлено.');
      router.replace({
        pathname: '/agency-listing-view/[id]',
        params: { id: String(nextListing.id) },
      });
    } catch (nextError) {
      Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось сохранить объявление.');
    } finally {
      setSaving(false);
    }
  };

  const onPickPhoto = async () => {
    if (!id || !session?.token || uploading) {
      return;
    }

    try {
      if (!DocumentPicker?.getDocumentAsync) {
        Alert.alert('Недоступно', 'Модуль выбора файла не найден.');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: ['image/*'],
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }

      const file: ListingUploadFile = {
        uri: asset.uri,
        name: asset.name || 'photo.jpg',
        type: asset.mimeType || 'image/jpeg',
      };

      setUploading(true);
      await uploadListingMedia(id, file, session.token);
      await reloadListing();
    } catch (nextError) {
      Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось загрузить фото.');
    } finally {
      setUploading(false);
    }
  };

  const onDeleteMedia = async (mediaId: number) => {
    if (!id || !session?.token || deletingMediaId) {
      return;
    }

    try {
      setDeletingMediaId(mediaId);
      await deleteListingMedia(id, mediaId, session.token);
      await reloadListing();
    } catch (nextError) {
      Alert.alert('Ошибка', nextError instanceof Error ? nextError.message : 'Не удалось удалить фото.');
    } finally {
      setDeletingMediaId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#70A0FF" />
        </Pressable>
        <Text style={styles.headerTitle}>Редактирование</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <EmptyState icon="hourglass-outline" title="Загрузка объявления" description="Подождите немного" />
        ) : listing ? (
          <>
            <View style={styles.card}>
              <Field label="Название" value={title} onChangeText={setTitle} />
              <Field
                label="Цена"
                value={price}
                onChangeText={(value) => setPrice(formatPriceInput(value))}
                keyboardType="numeric"
                isPrice
              />
              <Field label="Город" value={city} onChangeText={setCity} />
              <Field label="Адрес" value={address} onChangeText={setAddress} />

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Описание</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={styles.area}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#939393"
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.mediaHeader}>
                <Text style={styles.mediaTitle}>Фотографии</Text>
                <Pressable style={styles.addPhotoButton} onPress={onPickPhoto} disabled={uploading}>
                  <Text style={styles.addPhotoButtonText}>
                    {uploading ? 'Загрузка...' : 'Добавить фото'}
                  </Text>
                </Pressable>
              </View>

              {media.length === 0 ? (
                <Text style={styles.mediaEmptyText}>Пока нет фотографий.</Text>
              ) : (
                <View style={styles.mediaList}>
                  {media.map((item) => (
                    <View key={item.id} style={styles.mediaCard}>
                      <Image source={{ uri: item.url }} contentFit="cover" style={styles.mediaImage} />
                      <Pressable
                        style={styles.mediaDeleteButton}
                        onPress={() => onDeleteMedia(item.id)}
                        disabled={deletingMediaId === item.id}>
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              style={[styles.saveButton, (!canSave || saving) && styles.saveButtonDisabled]}
              onPress={onSave}
              disabled={!canSave || saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Сохраняем...' : 'Сохранить'}</Text>
            </Pressable>
          </>
        ) : (
          <EmptyState
            icon="create-outline"
            title="Редактирование недоступно"
            description={error || 'Откройте реальное backend-объявление и попробуйте снова.'}
            actionLabel="Назад"
            onAction={() => router.back()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  isPrice,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
  isPrice?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={isPrice ? styles.priceInputWrap : undefined}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, isPrice && styles.priceInput]}
          placeholderTextColor="#939393"
          keyboardType={keyboardType}
        />
        {isPrice ? <Text style={styles.priceCurrency}>₸</Text> : null}
      </View>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16 },
  fieldWrap: { marginTop: 14 },
  label: { fontSize: 14, lineHeight: 21, color: '#737373', marginBottom: 4 },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3A3A3A',
  },
  priceInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  priceInput: {
    paddingRight: 44,
  },
  priceCurrency: {
    position: 'absolute',
    right: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#737373',
    fontWeight: '500',
  },
  area: {
    minHeight: 120,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#3A3A3A',
  },
  mediaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  mediaTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  addPhotoButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButtonText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: '#70A0FF',
  },
  mediaEmptyText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
  },
  mediaList: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mediaCard: {
    width: 98,
    height: 98,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F4F4F4',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaDeleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.56)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', fontWeight: '600' },
});
