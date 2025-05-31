import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DollarSign, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Post } from '@/models/types';

interface RequestCardProps {
  request: Post;
  onPress: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress }) => {
  // Format date string for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Flexible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{request.title}</Text>
      
      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>${request.rate}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <MapPin size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{request.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Calendar size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{formatDate(request.dateTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
});