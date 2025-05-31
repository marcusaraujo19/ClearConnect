import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { getUserById } from '@/services/api';
import { Review, User } from '@/models/types';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const [reviewer, setReviewer] = useState<User | null>(null);

  useEffect(() => {
    const loadReviewer = async () => {
      try {
        const userData = await getUserById(review.fromUserId);
        setReviewer(userData);
      } catch (error) {
        console.error('Error loading reviewer:', error);
      }
    };

    loadReviewer();
  }, [review.fromUserId]);

  // Format date string for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!reviewer) {
    return null; // Or a loading skeleton
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: reviewer.photo || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
          }}
          style={styles.avatar}
        />
        
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{reviewer.name}</Text>
          <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={Colors.light.warning}
            fill={star <= review.rating ? Colors.light.warning : 'transparent'}
          />
        ))}
      </View>

      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  reviewDate: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  comment: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22,
  },
});