import type { ImageSourcePropType } from 'react-native';
import type { ApiListing } from '@/lib/api';

export type CatalogDealType = 'buy' | 'rent';

export type CatalogListing = {
  id: string;
  numericId: number;
  title: string;
  propertyType: string;
  dealType: CatalogDealType;
  city: string;
  priceValue: number;
  price: string;
  address: string;
  roomsLabel: string;
  areaLabel: string;
  floorLabel: string;
  latitude?: number;
  longitude?: number;
  image: ImageSourcePropType;
  images: ImageSourcePropType[];
  description: string;
  features: string[];
  companyName?: string;
  status: string;
};

const FALLBACK_IMAGES: ImageSourcePropType[] = [
  require('@/assets/images/ObjectOne.png'),
  require('@/assets/images/ObjectTwo.png'),
  require('@/assets/images/ObjectThree.png'),
  require('@/assets/images/ObjectFour.png'),
  require('@/assets/images/ObjectFive.png'),
  require('@/assets/images/ObjectSix.png'),
  require('@/assets/images/ObjectSeven.png'),
  require('@/assets/images/ObjectEight.png'),
];

function formatPrice(priceValue: number) {
  return `${new Intl.NumberFormat('ru-RU').format(priceValue)} ₸`;
}

function buildFeatures(listing: ApiListing) {
  const features = [
    listing.property_type,
    listing.deal_type === 'rent' ? 'Аренда' : 'Продажа',
    typeof listing.rooms === 'number' ? `${listing.rooms} комн.` : null,
    typeof listing.area === 'number' ? `${listing.area} м²` : null,
    typeof listing.floor === 'number' ? `${listing.floor} этаж` : null,
  ].filter((feature): feature is string => Boolean(feature));

  return features.slice(0, 4);
}

function toImageSources(listing: ApiListing, index: number) {
  const remoteImages = (listing.media ?? [])
    .filter((media) => Boolean(media?.url))
    .sort((left, right) => left.position - right.position)
    .map((media) => ({ uri: media.url }));

  if (remoteImages.length > 0) {
    return remoteImages;
  }

  return [FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]];
}

export function mapApiListingToCatalogListing(listing: ApiListing, index = 0): CatalogListing {
  const images = toImageSources(listing, index);
  const priceValue = listing.price;

  return {
    id: String(listing.id),
    numericId: listing.id,
    title: listing.title,
    propertyType: listing.property_type,
    dealType: listing.deal_type === 'rent' ? 'rent' : 'buy',
    city: listing.city,
    priceValue,
    price: formatPrice(priceValue),
    address: listing.address || 'Адрес не указан',
    roomsLabel: typeof listing.rooms === 'number' ? String(listing.rooms) : '—',
    areaLabel: typeof listing.area === 'number' ? `${listing.area} м²` : '—',
    floorLabel: typeof listing.floor === 'number' ? `${listing.floor} этаж` : '—',
    latitude: typeof listing.latitude === 'number' ? listing.latitude : undefined,
    longitude: typeof listing.longitude === 'number' ? listing.longitude : undefined,
    image: images[0],
    images,
    description: listing.description || 'Описание отсутствует',
    features: buildFeatures(listing),
    companyName: listing.company_name || undefined,
    status: listing.status,
  };
}
