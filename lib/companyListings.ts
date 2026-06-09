import type { ApiListing } from '@/lib/api';

export function filterCompanyListings(listings: ApiListing[], companyId?: number | null) {
  if (!companyId) {
    return listings;
  }

  return listings.filter((listing) => listing.company_id === companyId);
}

export function getListingStatusMeta(status: string) {
  switch (status) {
    case 'active':
    case 'approved':
      return { label: 'Активно', bg: '#E8F5E9', color: '#388E3C' };
    case 'moderation':
    case 'review':
      return { label: 'На модерации', bg: '#FFF3E0', color: '#F57C00' };
    case 'rejected':
      return { label: 'Отклонено', bg: '#FFEBEE', color: '#D32F2F' };
    case 'draft':
      return { label: 'Черновик', bg: '#ECEFF1', color: '#607D8B' };
    default:
      return { label: status || 'Неизвестно', bg: '#F0F7FF', color: '#70A0FF' };
  }
}

export function formatListingDate(value?: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function countActiveListings(listings: ApiListing[]) {
  return listings.filter((listing) => ['active', 'approved'].includes(listing.status)).length;
}

export function countModerationListings(listings: ApiListing[]) {
  return listings.filter((listing) => ['moderation', 'review'].includes(listing.status)).length;
}
