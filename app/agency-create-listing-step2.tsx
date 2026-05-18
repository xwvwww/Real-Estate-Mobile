import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppDropdown from '@/components/AppDropdown';
import { fetchNearbyPlaces, reverseGeocode, type NearbyPlace } from '@/lib/geo';
import { updateListingDraft, useListingDraft } from '@/stores/listingDraftStore';

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

const CITY_OPTIONS = [
  { label: 'Алматы', latitude: 43.238949, longitude: 76.889709 },
  { label: 'Астана', latitude: 51.128207, longitude: 71.43042 },
  { label: 'Шымкент', latitude: 42.315514, longitude: 69.586907 },
  { label: 'Караганда', latitude: 49.802815, longitude: 73.102356 },
] as const;

export default function AgencyCreateListingStep2Screen() {
  const router = useRouter();
  const draft = useListingDraft();
  const MapView = MapModule?.default ?? MapModule?.MapView;
  const Marker = MapModule?.Marker;
  const UrlTile = MapModule?.UrlTile;
  const hasNativeMap = Boolean(MapView && Marker && UrlTile);

  const [cityOpen, setCityOpen] = useState(false);
  const [region, setRegion] = useState<MapRegion>({
    latitude: draft.latitude ?? 43.238,
    longitude: draft.longitude ?? 76.944,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(
    draft.latitude && draft.longitude
      ? { latitude: draft.latitude, longitude: draft.longitude }
      : null,
  );
  const [addressLoading, setAddressLoading] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [nearbyError, setNearbyError] = useState<string | null>(null);

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

  const onSelectCity = (nextCity: (typeof CITY_OPTIONS)[number]) => {
    setCityOpen(false);
    setRegion({
      latitude: nextCity.latitude,
      longitude: nextCity.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    });
    setPickedLocation({
      latitude: nextCity.latitude,
      longitude: nextCity.longitude,
    });
    updateListingDraft({ city: nextCity.label, latitude: nextCity.latitude, longitude: nextCity.longitude });
  };

  const onPickLocation = async (coordinate: { latitude: number; longitude: number }) => {
    setPickedLocation(coordinate);
    setRegion((prev) => ({
      ...prev,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    }));
    updateListingDraft({ latitude: coordinate.latitude, longitude: coordinate.longitude });

    setAddressLoading(true);
    setNearbyLoading(true);
    setNearbyError(null);

    try {
      const result = await reverseGeocode(coordinate.latitude, coordinate.longitude);
      updateListingDraft({
        address: result.address,
        city: result.city || draft.city,
      });
    } catch {
      updateListingDraft({
        address: `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`,
      });
    } finally {
      setAddressLoading(false);
    }

    try {
      const places = await fetchNearbyPlaces(coordinate.latitude, coordinate.longitude);
      setNearbyPlaces(places);
      setNearbyError(null);
    } catch {
      setNearbyPlaces([]);
      setNearbyError('Не удалось загрузить объекты рядом');
    } finally {
      setNearbyLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#3A3A3A" />
        </Pressable>

        <Text style={styles.topHeaderTitle}>Создание объявления</Text>

        <Pressable style={styles.saveButton}>
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
          <Text style={styles.stepText}>Шаг 2 из 4</Text>

          <View style={styles.progressRow}>
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={[styles.progressBar, styles.progressBarActive]} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Локация</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Город*</Text>
            <AppDropdown
              value={draft.city}
              placeholder="Выберите город"
              open={cityOpen}
              options={CITY_OPTIONS.map((option) => ({ label: option.label, value: option.label }))}
              onToggle={() => setCityOpen((prev) => !prev)}
              onSelect={(value) => {
                const option = CITY_OPTIONS.find((item) => item.label === value);
                if (option) {
                  onSelectCity(option);
                }
              }}
              triggerStyle={styles.dropdown}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Адрес*</Text>
            <TextInput
              style={styles.input}
              value={draft.address}
              onChangeText={(value) => updateListingDraft({ address: value })}
              placeholder="Например: ул. Абая 150"
              placeholderTextColor="#939393"
            />
            <Text style={styles.fieldHint}>
              {addressLoading
                ? 'Определяем адрес по выбранной точке...'
                : 'Адрес можно поправить вручную, точка на карте от этого не изменится.'}
            </Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <View style={styles.mapCanvas}>
              {hasNativeMap ? (
                <MapView
                  style={StyleSheet.absoluteFill}
                  region={region}
                  onRegionChangeComplete={setRegion}
                  onPress={(event: any) => {
                    const coordinate = event.nativeEvent.coordinate;
                    void onPickLocation(coordinate);
                  }}>
                  <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
                  {pickedLocation ? <Marker coordinate={pickedLocation} /> : null}
                </MapView>
              ) : (
                <View style={styles.mapFallback}>
                  <Ionicons name="location-outline" size={48} color="#939393" />
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

              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeTitle}>{draft.city || 'Казахстан'}</Text>
                <Text style={styles.mapBadgeSubtitle}>Выберите точку на карте</Text>
              </View>
            </View>
          </View>
          <Text style={styles.mapHint}>Нажмите на карту, чтобы указать местоположение</Text>

          {pickedLocation ? (
            <View style={styles.nearbySection}>
              <View style={styles.nearbyHeader}>
                <View>
                  <Text style={styles.nearbyTitle}>Рядом с объектом</Text>
                  <Text style={styles.nearbySubtitle}>В радиусе до 900 м</Text>
                </View>
                {nearbyLoading ? <ActivityIndicator size="small" color="#70A0FF" /> : null}
              </View>

              {nearbyError ? <Text style={styles.nearbyError}>{nearbyError}</Text> : null}

              {!nearbyLoading && !nearbyError && nearbyPlaces.length === 0 ? (
                <Text style={styles.nearbyEmpty}>Поблизости пока ничего не найдено.</Text>
              ) : null}

              {nearbyPlaces.length > 0 ? (
                <View style={styles.nearbyGrid}>
                  {nearbyPlaces.map((place) => (
                    <View key={place.id} style={styles.nearbyChip}>
                      <Ionicons name="location-outline" size={15} color="#70A0FF" />
                      <View style={styles.nearbyChipTextWrap}>
                        <Text style={styles.nearbyChipTitle} numberOfLines={1}>
                          {place.name}
                        </Text>
                        <Text style={styles.nearbyChipSubtitle}>
                          {place.type} · {place.distanceMeters} м
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actionsRow}>
            <Pressable style={styles.backAction} onPress={() => router.back()}>
              <Text style={styles.backActionText}>Назад</Text>
            </Pressable>

            <Pressable style={styles.nextAction} onPress={() => router.push('/agency-create-listing-step3')}>
              <Text style={styles.nextActionText}>Далее</Text>
            </Pressable>
          </View>
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
  dropdown: {
    borderWidth: 0,
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  fieldHint: {
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  mapPlaceholder: {
    marginTop: 16,
    height: 300,
    borderRadius: 14,
    backgroundColor: '#EEF1F5',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EEF1F5',
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 8,
  },
  mapBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapBadgeTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  mapBadgeSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
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
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: '#939393',
  },
  nearbySection: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
    padding: 14,
  },
  nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  nearbyTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  nearbySubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: '#939393',
  },
  nearbyError: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#D9534F',
  },
  nearbyEmpty: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#737373',
  },
  nearbyGrid: {
    marginTop: 12,
    gap: 8,
  },
  nearbyChip: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  nearbyChipTextWrap: {
    flex: 1,
  },
  nearbyChipTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  nearbyChipSubtitle: {
    marginTop: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#939393',
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
  nextAction: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextActionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
