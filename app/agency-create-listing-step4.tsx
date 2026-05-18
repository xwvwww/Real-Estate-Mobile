import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createListing, uploadListingMedia, type ListingUploadFile } from '@/lib/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetListingDraft, updateListingDraft, useListingDraft } from '@/stores/listingDraftStore';

let DocumentPicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DocumentPicker = require('expo-document-picker');
} catch {
  DocumentPicker = null;
}

export default function AgencyCreateListingStep4Screen() {
  const router = useRouter();
  const { session } = useAuth();
  const draft = useListingDraft();
  const [submitting, setSubmitting] = useState(false);

  const pickedPhotos = draft.photos;

  const persistDraftPhotos = (photos: ListingUploadFile[]) => {
    updateListingDraft({
      photos,
      photoNames: photos.map((photo) => photo.name),
    });
  };

  const saveDraftLocally = () => {
    Alert.alert('Черновик сохранен', 'Объявление сохранено локально на этом устройстве. Вы сможете вернуться к нему позже.');
    router.replace('/agency-dashboard');
  };

  const getUnsupportedPhoto = (photo: ListingUploadFile) => {
    const type = photo.type?.toLowerCase() || '';
    const name = photo.name.toLowerCase();
    const isSupportedType =
      type === 'image/jpeg' ||
      type === 'image/jpg' ||
      type === 'image/png' ||
      type === 'image/webp';
    const hasSupportedExtension =
      name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp');

    return isSupportedType || hasSupportedExtension ? null : photo;
  };

  const onPickPhoto = async () => {
    try {
      if (!DocumentPicker?.getDocumentAsync) {
        Alert.alert('Недоступно', 'Модуль выбора файла не найден.');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
        type: ['image/*'],
      });

      if (result.canceled) {
        return;
      }

      const picked = (result.assets ?? []).map((asset: any) => ({
        uri: asset?.uri,
        name: asset?.name || 'photo.jpg',
        type: asset?.mimeType || 'image/jpeg',
      })) as ListingUploadFile[];

      if (picked.length > 0) {
        const validPicked = picked.filter((photo) => Boolean(photo.uri));
        if (validPicked.length > 0) {
          persistDraftPhotos([...pickedPhotos, ...validPicked]);
        }
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось выбрать фотографии.');
    }
  };

  const onSubmit = async () => {
    if (!session?.token) {
      Alert.alert('Ошибка', 'Нужно заново войти в аккаунт.');
      return;
    }

    const price = Number(draft.price.replace(/\s/g, ''));
    const rooms = draft.roomsCount ? Number(draft.roomsCount) : undefined;
    const area = draft.area ? Number(draft.area) : undefined;
    const floor = draft.floor ? Number(draft.floor) : undefined;
    const totalFloors = draft.totalFloors ? Number(draft.totalFloors) : undefined;

    if (!draft.title.trim() || !draft.propertyType.trim() || !draft.dealType || !draft.city.trim() || !draft.description.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля.');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert('Ошибка', 'Укажите корректную цену.');
      return;
    }

    const unsupportedPhoto = pickedPhotos.find(getUnsupportedPhoto);
    if (unsupportedPhoto) {
      Alert.alert(
        'Неподдерживаемый формат',
        `Файл "${unsupportedPhoto.name}" не подходит. Загрузите изображение в формате JPG, PNG или WEBP.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const createdListing = await createListing(
        {
          title: draft.title.trim(),
          description: draft.description.trim(),
          property_type: draft.propertyType,
          deal_type: draft.dealType === 'Аренда' ? 'rent' : 'sale',
          price,
          city: draft.city.trim(),
          address: draft.address.trim(),
          rooms: Number.isFinite(rooms ?? NaN) ? rooms : undefined,
          area: Number.isFinite(area ?? NaN) ? area : undefined,
          floor: Number.isFinite(floor ?? NaN) ? floor : undefined,
          total_floors: Number.isFinite(totalFloors ?? NaN) ? totalFloors : undefined,
          latitude: draft.latitude ?? undefined,
          longitude: draft.longitude ?? undefined,
        },
        session.token
      );

      const uploadErrors: string[] = [];
      for (const photo of pickedPhotos) {
        try {
          await uploadListingMedia(createdListing.id, photo, session.token);
        } catch (error) {
          uploadErrors.push(`${photo.name}: ${error instanceof Error ? error.message : 'не удалось загрузить файл'}`);
        }
      }

      resetListingDraft();
      if (uploadErrors.length > 0) {
        Alert.alert(
          'Объявление создано',
          `Объявление отправлено на модерацию, но часть фото не загрузилась.\n\n${uploadErrors.join('\n')}`
        );
      } else {
        Alert.alert('Готово', 'Объявление отправлено на модерацию.');
      }
      router.replace({
        pathname: '/agency-listing-view/[id]',
        params: { id: String(createdListing.id) },
      });
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось отправить объявление.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#3A3A3A" />
        </Pressable>

        <Text style={styles.topHeaderTitle}>Создание объявления</Text>

        <Pressable style={styles.saveButton} onPress={saveDraftLocally} disabled={submitting}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.stepSection}>
          <Text style={styles.stepText}>Шаг 4 из 4</Text>

          <View style={styles.progressRow}>
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Описание и фотографии</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Описание объекта*</Text>
            <TextInput
              style={styles.textarea}
              multiline
              textAlignVertical="top"
              value={draft.description}
              onChangeText={(value) => updateListingDraft({ description: value })}
              placeholder="Опишите особенности и преимущества объекта..."
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.photosWrap}>
            <Text style={styles.fieldLabel}>Фотографии</Text>
            <View style={styles.photosRow}>
              <Pressable style={styles.addPhotoButton} onPress={onPickPhoto}>
                <Ionicons name="cloud-upload-outline" size={24} color="#70A0FF" />
                <Text style={styles.addPhotoText}>Добавить</Text>
              </Pressable>

              {draft.photoNames.slice(0, 2).map((photo, index) => (
                <View key={`${photo}-${index}`} style={styles.photoChip}>
                  <Text style={styles.photoChipText} numberOfLines={2}>
                    {photo}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.backAction} onPress={() => router.back()}>
              <Text style={styles.backActionText}>Назад</Text>
            </Pressable>

            <Pressable style={styles.draftAction} onPress={saveDraftLocally} disabled={submitting}>
              <Text style={styles.draftActionText}>Сохранить как черновик</Text>
            </Pressable>
          </View>

          <Pressable style={[styles.submitAction, submitting && styles.submitActionDisabled]} onPress={onSubmit} disabled={submitting}>
            <Text style={styles.submitActionText}>Отправить на модерацию</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  saveButton: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#70A0FF',
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 24,
  },
  stepSection: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
    textAlign: 'center',
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E8E8E8',
  },
  progressBarActive: {
    backgroundColor: '#70A0FF',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: {
    marginTop: 16,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  textarea: {
    height: 168,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingTop: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  photosWrap: {
    marginTop: 16,
    gap: 8,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  addPhotoButton: {
    width: 109,
    height: 109,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#70A0FF',
  },
  photoChip: {
    width: 109,
    height: 109,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoChipText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#3A3A3A',
    textAlign: 'center',
  },
  actionsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  backAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backActionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  draftAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  draftActionText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#70A0FF',
    textAlign: 'center',
  },
  submitAction: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitActionDisabled: {
    opacity: 0.7,
  },
  submitActionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
