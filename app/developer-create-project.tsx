import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createProject } from '@/lib/api';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

let MapModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  MapModule = require('react-native-maps');
} catch {
  MapModule = null;
}

export default function DeveloperCreateProjectScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const MapView = MapModule?.default ?? MapModule?.MapView;
  const Marker = MapModule?.Marker;
  const UrlTile = MapModule?.UrlTile;
  const hasNativeMap = Boolean(MapView && Marker && UrlTile);

  const [projectName, setProjectName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [region, setRegion] = useState<MapRegion>({
    latitude: 43.238,
    longitude: 76.944,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  const [submitting, setSubmitting] = useState(false);

  const canCreate = useMemo(
    () => Boolean(projectName.trim() && city.trim() && description.trim()),
    [projectName, city, description],
  );

  const pickPhoto = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      multiple: false,
    });

    if (!result.canceled && result.assets?.length) {
      setPhotoName(result.assets[0].name);
    }
  };

  const onZoom = (dir: 'in' | 'out') => {
    const nextDelta =
      dir === 'in'
        ? Math.max(region.latitudeDelta * 0.7, 0.005)
        : Math.min(region.latitudeDelta * 1.35, 0.8);

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: nextDelta,
      longitudeDelta: nextDelta,
    }));
  };

  const coordinateLabel = pickedLocation
    ? `${pickedLocation.latitude.toFixed(6)}, ${pickedLocation.longitude.toFixed(6)}`
    : 'Координаты будут сохранены автоматически';

  const onCreate = async () => {
    if (!session?.token) {
      Alert.alert('Ошибка', 'Нужно заново войти в аккаунт.');
      return;
    }

    if (!canCreate || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const project = await createProject(
        {
          name: projectName.trim(),
          city: city.trim(),
          description: description.trim(),
        },
        session.token
      );

      Alert.alert('Готово', 'Проект создан.');
      router.replace({
        pathname: '/developer-project-view/[id]',
        params: { id: String(project.id) },
      });
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось создать проект.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Создание проекта</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Название проекта*</Text>
            <TextInput
              style={styles.input}
              value={projectName}
              onChangeText={setProjectName}
              placeholder='Например: ЖК "Comfort Town"'
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Город*</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Например: Алматы"
              placeholderTextColor="#939393"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Адрес*</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Например: пр. Аль-Фараби 150"
              placeholderTextColor="#939393"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Локация</Text>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapCanvas}>
              {hasNativeMap ? (
                <MapView
                  style={StyleSheet.absoluteFill}
                  region={region}
                  onRegionChangeComplete={setRegion}
                  onPress={(event: any) => setPickedLocation(event.nativeEvent.coordinate)}>
                  <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
                  {pickedLocation ? <Marker coordinate={pickedLocation} /> : null}
                </MapView>
              ) : (
                <View style={styles.mapFallback}>
                  <EmptyState
                    icon="map-outline"
                    title="Карта недоступна"
                    description="Проверьте, что модуль карты подключен корректно"
                    elevated={false}
                    style={styles.mapFallbackCard}
                  />
                </View>
              )}

              <View style={styles.mapControls}>
                <Pressable style={styles.mapControlButton} onPress={() => onZoom('in')}>
                  <Text style={styles.mapControlText}>+</Text>
                </Pressable>
                <Pressable style={styles.mapControlButton} onPress={() => onZoom('out')}>
                  <Text style={styles.mapControlText}>−</Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.mapHint}>Нажмите на карту, чтобы указать местоположение</Text>
            <Text style={styles.mapSubhint}>{coordinateLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание проекта</Text>
          <TextInput
            style={styles.textarea}
            value={description}
            onChangeText={setDescription}
            placeholder="Расскажите о концепции проекта, инфраструктуре, преимуществах..."
            placeholderTextColor="#939393"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <View style={styles.photoRow}>
            <Pressable style={styles.photoAdd} onPress={pickPhoto}>
              <Ionicons name="cloud-upload-outline" size={24} color="#70A0FF" />
              <Text style={styles.photoAddText}>Добавить</Text>
            </Pressable>
            {photoName ? (
              <View style={styles.photoMeta}>
                <Text numberOfLines={2} style={styles.photoName}>
                  {photoName}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.photoHint}>Добавьте фотографии проекта, планировки, визуализации</Text>
        </View>

        <Pressable
          style={[styles.submitButton, !canCreate && styles.submitButtonDisabled]}
          disabled={!canCreate || submitting}
          onPress={onCreate}>
          <Text style={styles.submitText}>{submitting ? 'Создаем...' : 'Создать проект'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3A3A3A',
  },
  mapPlaceholder: {
    minHeight: 300,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  mapCanvas: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EEF1F5',
    position: 'relative',
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  mapFallbackCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  mapControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 8,
  },
  mapControlButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControlText: {
    fontSize: 18,
    lineHeight: 22,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  mapHint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
    textAlign: 'center',
  },
  mapSubhint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
    textAlign: 'center',
  },
  textarea: {
    minHeight: 168,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoAdd: {
    width: 108,
    height: 108,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoAddText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#70A0FF',
    fontWeight: '500',
  },
  photoMeta: {
    flex: 1,
    minHeight: 108,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  photoName: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
  },
  photoHint: {
    marginTop: -4,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
