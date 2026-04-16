export type DashboardRoute = '/(tabs)' | '/agency-dashboard' | '/developer-dashboard';

export function getDashboardRoute(roleName: string | undefined): DashboardRoute {
  switch (roleName) {
    case 'agency':
      return '/agency-dashboard';
    case 'developer':
      return '/developer-dashboard';
    default:
      return '/(tabs)';
  }
}