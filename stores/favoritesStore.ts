import { useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { addFavorite, fetchFavorites, removeFavorite, type ApiSession } from '@/lib/api';

const listeners = new Set<() => void>();
const favoriteIds = new Set<string>();
const LOCAL_FAVORITES_STORAGE_KEY = 'real-estate-local-favorites';

let favoriteSnapshot = Array.from(favoriteIds);
let currentToken: string | null = null;
let currentLoadPromise: Promise<void> | null = null;
let localFavoritesHydrated = false;
let localFavoritesHydrationPromise: Promise<void> | null = null;

const emit = () => {
  favoriteSnapshot = Array.from(favoriteIds);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => favoriteSnapshot;

function isRemoteListingId(id: string) {
  return /^\d+$/.test(id);
}

async function readLocalFavoritesValue() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(LOCAL_FAVORITES_STORAGE_KEY);
  }

  return SecureStore.getItemAsync(LOCAL_FAVORITES_STORAGE_KEY);
}

async function writeLocalFavoritesValue(value: string | null) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return;
    }

    if (value === null) {
      window.localStorage.removeItem(LOCAL_FAVORITES_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LOCAL_FAVORITES_STORAGE_KEY, value);
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(LOCAL_FAVORITES_STORAGE_KEY);
    return;
  }

  await SecureStore.setItemAsync(LOCAL_FAVORITES_STORAGE_KEY, value);
}

async function persistLocalFavorites() {
  const localOnlyIds = Array.from(favoriteIds).filter((id) => !isRemoteListingId(id));
  await writeLocalFavoritesValue(localOnlyIds.length > 0 ? JSON.stringify(localOnlyIds) : null);
}

async function ensureLocalFavoritesHydrated() {
  if (localFavoritesHydrated) {
    return;
  }

  if (localFavoritesHydrationPromise) {
    await localFavoritesHydrationPromise;
    return;
  }

  localFavoritesHydrationPromise = readLocalFavoritesValue()
    .then((storedValue) => {
      if (!storedValue) {
        return;
      }

      const parsed = JSON.parse(storedValue) as unknown;
      if (!Array.isArray(parsed)) {
        return;
      }

      parsed.forEach((value) => {
        if (typeof value === 'string' && !isRemoteListingId(value)) {
          favoriteIds.add(value);
        }
      });
      emit();
    })
    .catch(() => {
      // Ignore broken local favorites cache.
    })
    .finally(() => {
      localFavoritesHydrated = true;
      localFavoritesHydrationPromise = null;
    });

  await localFavoritesHydrationPromise;
}

function replaceFavorites(ids: string[]) {
  favoriteIds.clear();
  ids.forEach((id) => favoriteIds.add(id));
  emit();
}

function replaceRemoteFavorites(ids: string[]) {
  const localOnlyIds = Array.from(favoriteIds).filter((id) => !isRemoteListingId(id));
  replaceFavorites([...localOnlyIds, ...ids]);
  void persistLocalFavorites();
}

export async function hydrateFavorites(session: ApiSession | null) {
  await ensureLocalFavoritesHydrated();

  const nextToken = session?.token ?? null;

  if (!nextToken) {
    currentToken = null;
    replaceRemoteFavorites([]);
    return;
  }

  if (currentToken === nextToken && currentLoadPromise) {
    await currentLoadPromise;
    return;
  }

  currentToken = nextToken;
  currentLoadPromise = fetchFavorites(nextToken)
    .then((items) => {
      replaceRemoteFavorites(items.map((item) => String(item.id)));
    })
    .catch(() => {
      replaceRemoteFavorites([]);
    })
    .finally(() => {
      currentLoadPromise = null;
    });

  await currentLoadPromise;
}

export async function toggleFavorite(id: string, session: ApiSession | null) {
  await ensureLocalFavoritesHydrated();

  if (!session?.token || !isRemoteListingId(id)) {
    if (favoriteIds.has(id)) {
      favoriteIds.delete(id);
    } else {
      favoriteIds.add(id);
    }
    emit();
    await persistLocalFavorites();
    return;
  }

  const alreadyFavorite = favoriteIds.has(id);

  if (alreadyFavorite) {
    favoriteIds.delete(id);
    emit();

    try {
      await removeFavorite(id, session.token);
    } catch (error) {
      favoriteIds.add(id);
      emit();
      throw error;
    }

    return;
  }

  favoriteIds.add(id);
  emit();

  try {
    await addFavorite(id, session.token);
  } catch (error) {
    favoriteIds.delete(id);
    emit();
    throw error;
  }
}

export function useFavoritesSync(session: ApiSession | null) {
  useEffect(() => {
    void hydrateFavorites(session);
  }, [session?.token]);
}

export function isFavorite(id: string) {
  return favoriteIds.has(id);
}

export function useFavoriteIds(session?: ApiSession | null) {
  useFavoritesSync(session ?? null);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useIsFavorite(id: string, session?: ApiSession | null) {
  const ids = useFavoriteIds(session);
  return ids.includes(id);
}
