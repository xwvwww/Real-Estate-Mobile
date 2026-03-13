import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="message/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="request/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="object/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="object-application" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="agency-dashboard" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-listings" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-requests" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-messages" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-settings" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-create-listing" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-create-listing-step2" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-create-listing-step3" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="agency-create-listing-step4" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-dashboard" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-projects" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-project-view/[id]" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-create-project" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-create-object" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-objects" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-object-view/[id]" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-requests" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-request-view/[id]" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-analytics" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="developer-settings" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
