import { useSyncExternalStore } from 'react';
import type { ListingUploadFile } from '@/lib/api';

export type ListingDraft = {
  title: string;
  propertyType: string;
  dealType: 'Продажа' | 'Аренда' | '';
  price: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  roomsCount: string;
  area: string;
  floor: string;
  totalFloors: string;
  description: string;
  photoNames: string[];
  photos: ListingUploadFile[];
};

const DEFAULT_DRAFT: ListingDraft = {
  title: '',
  propertyType: '',
  dealType: '',
  price: '',
  city: '',
  address: '',
  latitude: null,
  longitude: null,
  roomsCount: '',
  area: '',
  floor: '',
  totalFloors: '',
  description: '',
  photoNames: [],
  photos: [],
};

let listingDraft: ListingDraft = DEFAULT_DRAFT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return listingDraft;
}

export function useListingDraft() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function updateListingDraft(partial: Partial<ListingDraft>) {
  listingDraft = { ...listingDraft, ...partial };
  emit();
}

export function resetListingDraft() {
  listingDraft = DEFAULT_DRAFT;
  emit();
}
