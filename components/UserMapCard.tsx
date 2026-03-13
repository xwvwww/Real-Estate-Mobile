import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type UserMapMarker = {
  id: string;
  lat: number;
  lng: number;
  price: string;
  listingId?: string;
};

type Props = {
  markers?: UserMapMarker[];
  selectedMarkerId?: string | null;
  initialRegion?: MapRegion;
  region?: MapRegion;
  onRegionChange?: (region: MapRegion) => void;
  onMarkerPress?: (marker: UserMapMarker) => void;
  onListPress?: () => void;
  onShowInAreaPress?: () => void;
  listLabel?: string;
  cityTitle?: string;
  citySubtitle?: string;
  showListButton?: boolean;
  showScopeButton?: boolean;
  height?: number;
};

const DEFAULT_MARKERS: UserMapMarker[] = [
  { id: 'm1', lat: 43.242, lng: 76.944, price: '12.5M ₸', listingId: 'r1' },
  { id: 'm2', lat: 43.236, lng: 76.92, price: '18.9M ₸', listingId: 'r2' },
  { id: 'm3', lat: 43.225, lng: 76.957, price: '9.2M ₸', listingId: 'r3' },
];

const DEFAULT_REGION: MapRegion = {
  latitude: 48.0196,
  longitude: 66.9237,
  latitudeDelta: 16,
  longitudeDelta: 16,
};

let NativeMapModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  NativeMapModule = require('react-native-maps');
} catch {
  NativeMapModule = null;
}

export default function UserMapCard({
  markers = DEFAULT_MARKERS,
  selectedMarkerId,
  initialRegion = DEFAULT_REGION,
  region,
  onRegionChange,
  onMarkerPress,
  onListPress,
  onShowInAreaPress,
  listLabel = 'Список',
  cityTitle = 'Казахстан',
  citySubtitle = 'Карта объектов по стране',
  showListButton = true,
  showScopeButton = true,
  height = 332,
}: Props) {
  const MapView = NativeMapModule?.default ?? NativeMapModule?.MapView;
  const Marker = NativeMapModule?.Marker;
  const UrlTile = NativeMapModule?.UrlTile;
  const hasNativeMap = Boolean(MapView && Marker && UrlTile);

  const [localRegion, setLocalRegion] = useState<MapRegion>(initialRegion);
  const activeRegion = region ?? localRegion;

  const activeMarkerId = selectedMarkerId ?? null;

  const markerMap = useMemo(
    () => Object.fromEntries(markers.map((marker) => [marker.id, marker])),
    [markers]
  );

  const updateRegion = (nextRegion: MapRegion) => {
    if (!region) {
      setLocalRegion(nextRegion);
    }
    onRegionChange?.(nextRegion);
  };

  const onZoom = (dir: 'in' | 'out') => {
    const nextDelta =
      dir === 'in'
        ? Math.max(activeRegion.latitudeDelta * 0.72, 0.01)
        : Math.min(activeRegion.latitudeDelta * 1.34, 0.8);

    updateRegion({
      ...activeRegion,
      latitudeDelta: nextDelta,
      longitudeDelta: nextDelta,
    });
  };

  return (
    <View style={[styles.mapCard, { height }]}> 
      {hasNativeMap ? (
        <MapView
          style={StyleSheet.absoluteFill}
          region={activeRegion}
          onRegionChangeComplete={updateRegion}
          showsCompass={false}
          showsPointsOfInterest={false}
          showsBuildings={false}
          rotateEnabled={false}
          pitchEnabled={false}>
          <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

          {markers.map((marker) => {
            const isActive = activeMarkerId === marker.id;
            return (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                onPress={() => onMarkerPress?.(marker)}>
                <View style={[styles.marker, isActive && styles.markerActive]}>
                  <Text style={[styles.markerText, isActive && styles.markerTextActive]}>{marker.price}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <View style={styles.fallbackMap}>
          <Text style={styles.fallbackTitle}>Map package not installed yet</Text>
          <Text style={styles.fallbackText}>Install react-native-maps to enable OSM map in Expo Go.</Text>
        </View>
      )}

      <View style={styles.mapTopRow}>
        <View style={styles.cityBadge}>
          <Text style={styles.cityTitle}>{cityTitle}</Text>
          <Text style={styles.citySubtitle}>{citySubtitle}</Text>
        </View>
      </View>

      {showListButton ? (
        <Pressable style={styles.listButton} onPress={onListPress}>
          <Ionicons name="list-outline" size={16} color="#3A3A3A" />
          <Text style={styles.listButtonText}>{listLabel}</Text>
        </Pressable>
      ) : null}

      <View style={styles.mapActions}>
        <Pressable style={styles.mapIconBtn} onPress={() => onZoom('in')}>
          <Text style={styles.mapActionText}>+</Text>
        </Pressable>
        <Pressable style={styles.mapIconBtn} onPress={() => onZoom('out')}>
          <Text style={styles.mapActionText}>−</Text>
        </Pressable>
      </View>

      {showScopeButton ? (
        <Pressable style={styles.mapScopeButton} onPress={onShowInAreaPress}>
          <Text style={styles.mapScopeText}>Показать объекты в этой области</Text>
        </Pressable>
      ) : null}

      {activeMarkerId && markerMap[activeMarkerId] ? (
        <View style={[styles.selectedHint, showScopeButton && styles.selectedHintWithScope]}>
          <Text style={styles.selectedHintText}>Выбрано: {markerMap[activeMarkerId].price}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapCard: {
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  fallbackMap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 32,
  },
  fallbackTitle: {
    fontSize: 16,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  fallbackText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#6F6F6F',
    textAlign: 'center',
  },
  mapTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cityBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cityTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  citySubtitle: {
    fontSize: 10,
    lineHeight: 15,
    color: '#939393',
  },
  mapActions: {
    position: 'absolute',
    right: 16,
    top: 56,
    gap: 8,
  },
  mapIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActionText: {
    fontSize: 16,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  marker: {
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  markerActive: {
    borderColor: '#70A0FF',
    backgroundColor: '#F0F7FF',
  },
  markerText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#3A3A3A',
    fontWeight: '600',
  },
  markerTextActive: {
    color: '#2A7FE3',
  },
  listButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    height: 37,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listButtonText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  mapScopeButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mapScopeText: {
    width: 156,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    color: '#70A0FF',
    fontWeight: '500',
  },
  selectedHint: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    maxWidth: 148,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  selectedHintWithScope: {
    bottom: 14,
  },
  selectedHintText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3A3A3A',
    fontWeight: '500',
  },
});
