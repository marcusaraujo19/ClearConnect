import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, ClipboardList, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

/**
 * Tab layout component for the main app navigation.
 * Provides tabs for Browse, My Posts, and Profile.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Default color theme
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: 'SF-Pro-Text-Semibold',
          fontSize: 17,
        },
      }}>
      <Tabs.Screen
        name="browse/index"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: 'Browse',
        }}
      />
      <Tabs.Screen
        name="my-posts/index"
        options={{
          title: 'My Posts',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
          headerTitle: user?.role === 'housekeeper' ? 'My Offers' : 'My Requests',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}