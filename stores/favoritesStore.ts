import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const favoriteIds = new Set<string>(['r1', 'r2', 'r3']);
let favoriteSnapshot = Array.from(favoriteIds);

const emit = () => {
  // keep stable reference between updates; change only when store changes
  favoriteSnapshot = Array.from(favoriteIds);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => favoriteSnapshot;

export function toggleFavorite(id: string) {
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }
  emit();
}

export function isFavorite(id: string) {
  return favoriteIds.has(id);
}

export function useFavoriteIds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useIsFavorite(id: string) {
  const ids = useFavoriteIds();
  return ids.includes(id);
}
