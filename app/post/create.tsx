import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/services/api';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { DateTimePicker } from '@/components/forms/DateTimePicker';
import Colors from '@/constants/Colors';

/**
 * Create Post screen for creating new cleaning requests or offers
 */
export default function CreatePostScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const isHousekeeper = user?.role === 'housekeeper';

  const handleCreatePost = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your post');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please provide a description');
      return;
    }

    if (!rate.trim()) {
      Alert.alert('Missing Rate', 'Please enter your rate');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Missing Location', 'Please specify a location');
      return;
    }

    if (!dateTime && !isHousekeeper) {
      Alert.alert('Missing Date/Time', 'Please select a date and time');
      return;
    }

    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      const postData = {
        userId: user.id,
        title,
        description,
        rate: parseFloat(rate.replace(/[^0-9.]/g, '')),
        location,
        type: isHousekeeper ? 'offer' : 'request',
        dateTime: dateTime ? dateTime.toISOString() : null,
        createdAt: new Date().toISOString(),
      };

      await createPost(postData);
      
      Alert.alert(
        'Success',
        isHousekeeper ? 'Your service offer has been posted!' : 'Your cleaning request has been posted!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isHousekeeper ? 'Create Offer' : 'Create Request'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder={isHousekeeper ? "e.g., Professional House Cleaning" : "e.g., Need Kitchen Deep Clean"}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={isHousekeeper 
                  ? "Describe your services, experience, and what sets you apart..."
                  : "Describe what needs cleaning, special requirements, etc..."}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Hourly Rate ($)</Text>
              <CurrencyInput
                value={rate}
                onChangeValue={setRate}
                placeholder="0.00"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Downtown, North Side"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {!isHousekeeper && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Preferred Date & Time</Text>
                <DateTimePicker
                  value={dateTime}
                  onChange={setDateTime}
                  minimumDate={new Date()}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreatePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isHousekeeper ? 'Post Offer' : 'Post Request'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.text,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.primary,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'SF-Pro-Text-Regular',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'SF-Pro-Text-Semibold',
    color: Colors.light.white,
    fontSize: 17,
  },
});