import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Marker = {
  id: string;
  lat: number;
  lng: number;
  price: string;
};

const MARKERS: Marker[] = [
  { id: 'm1', lat: 43.242, lng: 76.944, price: '12.5M ₸' },
  { id: 'm2', lat: 43.236, lng: 76.92, price: '18.9M ₸' },
  { id: 'm3', lat: 43.225, lng: 76.957, price: '9.2M ₸' },
];

let MapLibreModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  MapLibreModule = require('react-native-maps');
} catch {
  MapLibreModule = null;
}

export default function UserMapCard() {
  const MapView = MapLibreModule?.default ?? MapLibreModule?.MapView;
  const Marker = MapLibreModule?.Marker;
  const UrlTile = MapLibreModule?.UrlTile;
  const hasNativeMap = Boolean(MapView && Marker && UrlTile);
  const [region, setRegion] = useState({
    latitude: 43.238,
    longitude: 76.944,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
  });

  const onZoom = (dir: 'in' | 'out') => {
    const nextDelta =
      dir === 'in'
        ? Math.max(region.latitudeDelta * 0.7, 0.01)
        : Math.min(region.latitudeDelta * 1.35, 0.7);

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: nextDelta,
      longitudeDelta: nextDelta,
    }));
  };

  return (
    <View style={styles.mapCard}>
      {hasNativeMap ? (
        <>
          <MapView
            style={StyleSheet.absoluteFill}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

            {MARKERS.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              >
                <View style={styles.marker}>
                  <Text style={styles.markerText}>{marker.price}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </>
      ) : (
        <View style={styles.fallbackMap}>
          <Text style={styles.fallbackTitle}>Map package not installed yet</Text>
          <Text style={styles.fallbackText}>Install react-native-maps to enable OSM map in Expo Go.</Text>
        </View>
      )}

      <View style={styles.mapTopRow}>
        <View style={styles.cityBadge}>
          <Text style={styles.cityTitle}>Алматы</Text>
          <Text style={styles.citySubtitle}>Карта объектов</Text>
        </View>
      </View>

      <Pressable style={styles.listButton}>
        <Ionicons name="list-outline" size={16} color="#3A3A3A" />
        <Text style={styles.listButtonText}>Список</Text>
      </Pressable>

      <View style={styles.mapActions}>
        <Pressable style={styles.mapIconBtn} onPress={() => onZoom('in')}>
          <Text style={styles.mapActionText}>+</Text>
        </Pressable>
        <Pressable style={styles.mapIconBtn} onPress={() => onZoom('out')}>
          <Text style={styles.mapActionText}>−</Text>
        </Pressable>
      </View>

      <Pressable style={styles.mapScopeButton}>
        <Text style={styles.mapScopeText}>Показать объекты в этой области</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mapCard: {
    height: 332,
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
  },
  markerText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#3A3A3A',
    fontWeight: '600',
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
    width: 124,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    color: '#70A0FF',
    fontWeight: '500',
  },
});
