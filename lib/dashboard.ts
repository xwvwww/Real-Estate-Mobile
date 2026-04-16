import type {
  ApiDashboardApplicationSummary,
  ApiDashboardFavoriteListing,
} from '@/lib/api';
import type { CatalogListing } from '@/lib/listings';

export type DashboardRequestItem = {
  id: string;
  title: string;
  agency: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
};

function formatFullDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Дата не указана';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function mapStatus(status: string) {
  switch (status) {
    case 'review':
      return { label: 'В обработке', color: '#F08A00', bg: '#FFEED9' };
    case 'approved':
      return { label: 'Одобрена', color: '#2E8C3C', bg: '#E3F5E7' };
    case 'rejected':
      return { label: 'Отклонена', color: '#D14F4F', bg: '#FCE4E4' };
    case 'new':
    default:
      return { label: 'Новая', color: '#2A7FE3', bg: '#DCEEFF' };
  }
}

export function mapDashboardApplicationToRequestItem(
  item: ApiDashboardApplicationSummary
): DashboardRequestItem {
  const status = mapStatus(item.status);

  return {
    id: String(item.id),
    title: item.listing_title,
    agency: item.company_name,
    date: formatFullDate(item.updated_at),
    status: status.label,
    statusColor: status.color,
    statusBg: status.bg,
  };
}

export function mapDashboardFavoriteToRecentListing(
  item: ApiDashboardFavoriteListing,
  fallback: CatalogListing | null = null
): CatalogListing {
  const image = item.cover_url ? { uri: item.cover_url } : fallback?.image;
  const formattedPrice = `${new Intl.NumberFormat('ru-RU').format(item.price)} ₸`;

  return {
    id: String(item.listing_id),
    numericId: item.listing_id,
    title: item.title,
    propertyType: fallback?.propertyType || 'Объект',
    dealType: fallback?.dealType || 'buy',
    city: item.city,
    priceValue: item.price,
    price: formattedPrice,
    address: fallback?.address || 'Адрес не указан',
    roomsLabel: fallback?.roomsLabel || '—',
    areaLabel: typeof item.area === 'number' ? `${item.area} м²` : fallback?.areaLabel || '—',
    floorLabel: fallback?.floorLabel || '—',
    latitude: fallback?.latitude,
    longitude: fallback?.longitude,
    image: image || fallback?.image,
    images: image ? [image] : fallback?.images || [],
    description: fallback?.description || 'Описание отсутствует',
    features: fallback?.features || [],
    companyName: fallback?.companyName,
    status: fallback?.status || 'active',
  };
}
