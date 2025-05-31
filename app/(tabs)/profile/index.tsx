import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Star, Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserReviews } from '@/services/api';
import { ReviewItem } from '@/components/cards/ReviewItem';
import Colors from '@/constants/Colors';
import { Review } from '@/models/types';

/**
 * Profile screen for viewing and managing user profile
 */
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      // Fetch user reviews
      const userReviews = await getUserReviews(user.id);
      setReviews(userReviews);
      
      // Calculate average rating
      if (userReviews.length > 0) {
        const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / userReviews.length);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: user.photo || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            }}
            style={styles.profilePhoto}
          />
          
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.roleContainer}>
            <Text style={styles.role}>
              {user.role === 'housekeeper' ? 'Housekeeper' : 'Service Seeker'}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <Star
              fill={Colors.light.warning}
              color={Colors.light.warning}
              size={20}
            />
            <Text style={styles.rating}>
              {averageRating.toFixed(1)} • {reviews.length} reviews
            </Text>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>
            {user.bio || 'No bio provided. Tell others about yourself by editing your profile.'}
          </Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {user.completedJobs || 0}
            </Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${user.rate || 0}/hr</Text>
            <Text style={styles.statLabel}>Hourly Rate</Text>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          
          {loading ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <Text style={styles.noReviewsText}>
              No reviews yet. Completed jobs will appear here.
            </Text>
          )}
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Settings size={20} color={Colors.light.text} />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.light.error} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 8,
  },
  roleContainer: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  role: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 4,
  },
  bioSection: {
    padding: 16,
    backgroundColor: Colors.light.white,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },
  bioText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.light.white,
    padding: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  reviewsSection: {
    padding: 16,
    backgroundColor: Colors.light.white,
    marginBottom: 8,
  },
  noReviewsText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    padding: 16,
  },
  buttonsSection: {
    padding: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Colors.light.error,
    backgroundColor: Colors.light.white,
  },
  logoutText: {
    color: Colors.light.error,
  },
});