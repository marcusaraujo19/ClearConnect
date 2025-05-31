import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { initDatabase } from '@/services/database';

/**
 * Root entry point that handles app initialization and routing
 * based on authentication state.
 */
export default function Index() {
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Initialize the database
    initDatabase();
  }, []);

  // Wait for auth to be initialized before redirecting
  if (!isInitialized) {
    return null;
  }

  // Redirect based on authentication state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/browse" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}