import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { ApiSession } from '@/lib/api';

type AuthContextValue = {
  session: ApiSession | null;
  isHydrated: boolean;
  signIn: (session: ApiSession) => Promise<void>;
  signOut: () => Promise<void>;
  updateSessionUser: (user: ApiSession['user']) => Promise<void>;
};

const SESSION_STORAGE_KEY = 'real-estate-auth-session';

function isValidSession(value: unknown): value is ApiSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as ApiSession;
  return Boolean(session.token && session.user && session.user.role && session.user.role.name);
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readSessionValue() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  }

  return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
}

async function writeSessionValue(value: string | null) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return;
    }

    if (value === null) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, value);
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
    return;
  }

  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, value);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ApiSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedSession = await readSessionValue();

        if (!isMounted) {
          return;
        }

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as unknown;

          if (isValidSession(parsedSession)) {
            setSession(parsedSession);
          } else {
            await writeSessionValue(null);
            setSession(null);
          }
        }
      } catch {
        if (isMounted) {
          await writeSessionValue(null);
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (nextSession: ApiSession) => {
    const serializedSession = JSON.stringify(nextSession);
    setSession(nextSession);
    await writeSessionValue(serializedSession);
  };

  const signOut = async () => {
    setSession(null);
    await writeSessionValue(null);
  };

  const updateSessionUser = async (user: ApiSession['user']) => {
    setSession((current) => {
      if (!current) {
        return current;
      }

      const nextSession = {
        ...current,
        user,
      };

      void writeSessionValue(JSON.stringify(nextSession));
      return nextSession;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isHydrated,
        signIn,
        signOut,
        updateSessionUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
