import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SegmentedControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getHousekeepers, getRequests } from '@/services/api';
import { HousekeeperCard } from '@/components/cards/HousekeeperCard';
import { RequestCard } from '@/components/cards/RequestCard';
import FilterModal from '@/components/modals/FilterModal';
import Colors from '@/constants/Colors';
import { User, Post } from '@/models/types';

/**
 * Browse screen for viewing housekeepers and cleaning requests
 */
export default function BrowseScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [housekeepers, setHousekeepers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Post[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 1000,
    location: '',
    date: null,
  });

  // Set the initial active tab based on user role
  useEffect(() => {
    if (user?.role === 'housekeeper') {
      setActiveTab(1); // Show "Requests" tab for housekeepers
    } else {
      setActiveTab(0); // Show "Housekeepers" tab for service seekers
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        // Load housekeepers
        const data = await getHousekeepers(filters);
        setHousekeepers(data);
      } else {
        // Load requests
        const data = await getRequests(filters);
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (id: string) => {
    if (activeTab === 0) {
      router.push(`/housekeeper/${id}`);
    } else {
      router.push(`/request/${id}`);
    }
  };

  const handleTabChange = (event: { nativeEvent: { selectedSegmentIndex: number } }) => {
    setActiveTab(event.nativeEvent.selectedSegmentIndex);
  };

  const renderItem = ({ item }: { item: User | Post }) => {
    if (activeTab === 0) {
      return (
        <HousekeeperCard
          user={item as User}
          onPress={() => handleItemPress(item.id)}
        />
      );
    } else {
      return (
        <RequestCard
          request={item as Post}
          onPress={() => handleItemPress(item.id)}
        />
      );
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <SegmentedControl
          values={['Housekeepers', 'Requests']}
          selectedIndex={activeTab}
          onChange={handleTabChange}
          style={styles.segmentedControl}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 0 ? housekeepers : requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 0
                  ? 'No housekeepers found'
                  : 'No cleaning requests found'}
              </Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        filters={filters}
        type={activeTab === 0 ? 'housekeeper' : 'request'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  segmentedControl: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
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
  },
  emptyText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 17,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});