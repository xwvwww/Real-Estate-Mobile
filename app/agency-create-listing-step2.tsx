import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function AgencyCreateListingStep2Screen() {
  const router = useRouter();
  const MapView = MapModule?.default ?? MapModule?.MapView;
  const Marker = MapModule?.Marker;
  const UrlTile = MapModule?.UrlTile;
  const hasNativeMap = Boolean(MapView && Marker && UrlTile);

  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState<MapRegion>({
    latitude: 43.238,
    longitude: 76.944,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

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
              placeholder="Например: ул. Абая 150"
              placeholderTextColor="#939393"
            />
          </View>

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
            </View>
          </View>
          <Text style={styles.mapHint}>Нажмите на карту, чтобы указать местоположение</Text>

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
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  mapPlaceholder: {
    marginTop: 16,
    height: 300,
    borderRadius: 14,
    backgroundColor: '#F8F8F8',
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
