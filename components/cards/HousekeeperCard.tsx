import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { User, Post } from '@/models/types';

interface HousekeeperCardProps {
  user: User;
  post?: Post;
  onPress: () => void;
}

export const HousekeeperCard: React.FC<HousekeeperCardProps> = ({ user, post, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{
          uri: user.photo || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{post?.title || user.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star
            fill={Colors.light.warning}
            color={Colors.light.warning}
            size={16}
          />
          <Text style={styles.rating}>
            {user.completedJobs ? `${(4 + Math.random()).toFixed(1)} • ${user.completedJobs} jobs` : 'New'}
          </Text>
        </View>
        
        <Text style={styles.location}>{user.location || 'Location not specified'}</Text>
        
        <View style={styles.rateContainer}>
          <Text style={styles.rate}>${post?.rate || user.rate || 0}</Text>
          <Text style={styles.hourly}>/hr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  location: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rate: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.primary,
  },
  hourly: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 2,
    marginBottom: 2,
  },
});