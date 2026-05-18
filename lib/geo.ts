export type ReverseGeocodeResult = {
  address: string;
  city?: string;
};

export type NearbyPlace = {
  id: string;
  name: string;
  type: string;
  distanceMeters: number;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

const NEARBY_TYPE_LABELS: Record<string, string> = {
  pharmacy: 'Аптека',
  school: 'Школа',
  kindergarten: 'Детский сад',
  clinic: 'Клиника',
  hospital: 'Больница',
  supermarket: 'Супермаркет',
  bus_stop: 'Остановка',
  park: 'Парк',
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceInMeters(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const earthRadius = 6371000;
  const latDelta = toRadians(toLat - fromLat);
  const lonDelta = toRadians(toLon - fromLon);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(lonDelta / 2) ** 2;

  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getElementCoordinate(element: OverpassElement) {
  if (typeof element.lat === 'number' && typeof element.lon === 'number') {
    return { latitude: element.lat, longitude: element.lon };
  }

  if (element.center) {
    return { latitude: element.center.lat, longitude: element.center.lon };
  }

  return null;
}

function getNearbyType(tags: Record<string, string>) {
  const value = tags.amenity || tags.shop || tags.highway || tags.leisure;
  return NEARBY_TYPE_LABELS[value] ?? null;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', 'ru');

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось определить адрес');
  }

  const payload = (await response.json()) as NominatimResponse;
  const address = payload.address ?? {};
  const street = address.road || address.pedestrian || address.neighbourhood || address.suburb;
  const city = address.city || address.town || address.village || address.state;
  const house = address.house_number;
  const shortAddress = [street, house].filter(Boolean).join(', ');

  return {
    address: shortAddress || payload.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    city,
  };
}

export async function fetchNearbyPlaces(latitude: number, longitude: number): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:12];
    (
      node["amenity"~"pharmacy|school|kindergarten|clinic|hospital"](around:800,${latitude},${longitude});
      way["amenity"~"pharmacy|school|kindergarten|clinic|hospital"](around:800,${latitude},${longitude});
      node["shop"="supermarket"](around:800,${latitude},${longitude});
      way["shop"="supermarket"](around:800,${latitude},${longitude});
      node["highway"="bus_stop"](around:600,${latitude},${longitude});
      way["leisure"="park"](around:900,${latitude},${longitude});
    );
    out center tags 18;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить объекты рядом');
  }

  const payload = (await response.json()) as OverpassResponse;
  const places =
    payload.elements
      ?.map((element) => {
        const coordinate = getElementCoordinate(element);
        const tags = element.tags ?? {};
        const type = getNearbyType(tags);

        if (!coordinate || !type) {
          return null;
        }

        return {
          id: String(element.id),
          name: tags.name || type,
          type,
          distanceMeters: distanceInMeters(latitude, longitude, coordinate.latitude, coordinate.longitude),
        };
      })
      .filter((item): item is NearbyPlace => Boolean(item)) ?? [];

  const uniqueByName = new Map<string, NearbyPlace>();
  places
    .sort((left, right) => left.distanceMeters - right.distanceMeters)
    .forEach((place) => {
      const key = `${place.type}-${place.name}`;
      if (!uniqueByName.has(key)) {
        uniqueByName.set(key, place);
      }
    });

  return [...uniqueByName.values()].slice(0, 8);
}
