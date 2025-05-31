import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserPosts } from '@/services/api';
import { RequestCard } from '@/components/cards/RequestCard';
import { HousekeeperCard } from '@/components/cards/HousekeeperCard';
import Colors from '@/constants/Colors';
import { Post } from '@/models/types';

/**
 * My Posts screen for viewing and managing user's posts/offers
 */
export default function MyPostsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userPosts = await getUserPosts(user.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    router.push('/post/create');
  };

  const handlePostPress = (id: string) => {
    router.push(`/post/${id}`);
  };

  const renderItem = ({ item }: { item: Post }) => {
    if (user?.role === 'housekeeper') {
      // For housekeepers, show their offer listings
      return (
        <HousekeeperCard
          user={user}
          post={item}
          onPress={() => handlePostPress(item.id)}
        />
      );
    } else {
      // For service seekers, show their cleaning requests
      return (
        <RequestCard
          request={item}
          onPress={() => handlePostPress(item.id)}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Posts Yet</Text>
              <Text style={styles.emptyText}>
                {user?.role === 'housekeeper'
                  ? 'Create your first cleaning service offer'
                  : 'Create your first cleaning request'}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={handleCreatePost}
      >
        <Plus color="#FFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    height: 300,
  },
  emptyTitle: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 17,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});