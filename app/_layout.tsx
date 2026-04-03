import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="register" />
          <Stack.Screen name="confirm/[token]" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="message/[id]" />
          <Stack.Screen name="request/[id]" />
          <Stack.Screen name="object/[id]" />
          <Stack.Screen name="object-application" />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="agency-dashboard" />
          <Stack.Screen name="agency-listings" />
          <Stack.Screen name="agency-requests" />
          <Stack.Screen name="agency-messages" />
          <Stack.Screen name="agency-settings" />
          <Stack.Screen name="agency-listing-view/[id]" />
          <Stack.Screen name="agency-edit-listing/[id]" />
          <Stack.Screen name="agency-request-view/[id]" />
          <Stack.Screen name="agency-message/[id]" />
          <Stack.Screen name="agency-create-listing" />
          <Stack.Screen name="agency-create-listing-step2" />
          <Stack.Screen name="agency-create-listing-step3" />
          <Stack.Screen name="agency-create-listing-step4" />
          <Stack.Screen name="developer-dashboard" />
          <Stack.Screen name="developer-projects" />
          <Stack.Screen name="developer-project-view/[id]" />
          <Stack.Screen name="developer-create-project" />
          <Stack.Screen name="developer-create-object" />
          <Stack.Screen name="developer-objects" />
          <Stack.Screen name="developer-object-view/[id]" />
          <Stack.Screen name="developer-requests" />
          <Stack.Screen name="developer-request-view/[id]" />
          <Stack.Screen name="developer-analytics" />
          <Stack.Screen name="developer-settings" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
