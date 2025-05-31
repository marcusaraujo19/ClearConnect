import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { AuthProvider } from '@/context/AuthContext';


// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'SF-Pro-Text-Regular': require('@/assets/fonts/SF-Pro-Text-Regular.otf'),
    'SF-Pro-Text-Medium': require('@/assets/fonts/SF-Pro-Text-Medium.otf'),
    'SF-Pro-Text-Semibold': require('@/assets/fonts/SF-Pro-Text-Semibold.otf'),
    'SF-Pro-Display-Regular': require('@/assets/fonts/SF-Pro-Display-Regular.otf'),
    'SF-Pro-Display-Medium': require('@/assets/fonts/SF-Pro-Display-Medium.otf'),
    'SF-Pro-Display-Semibold': require('@/assets/fonts/SF-Pro-Display-Semibold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <DatabaseProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </AuthProvider>
    </DatabaseProvider>
  );
}