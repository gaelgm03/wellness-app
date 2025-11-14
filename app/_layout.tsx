/**
 * LAYOUT PRINCIPAL: Wellness Quest
 * Propósito: Manejo de navegación y tema de la app
 * Rutas: onboarding, (tabs) - main app, modal
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F9F6' } // Wellness background
      }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ 
          presentation: 'modal', 
          title: 'Modal',
          headerShown: true,
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#FFFFFF'
        }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
