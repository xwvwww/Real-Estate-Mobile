import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/lib/auth';

export default function Index() {
  const { isHydrated, session } = useAuth();

  if (!isHydrated) {
    return null;
  }

  const roleName = session?.user?.role?.name;

  return <Redirect href={roleName ? getDashboardRoute(roleName) : '/login'} />;
}
