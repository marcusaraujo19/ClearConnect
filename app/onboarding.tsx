import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

/**
 * Onboarding screen for role selection (Housekeeper or Service Seeker)
 */
export default function OnboardingScreen() {
  const { setUserRole } = useAuth();

  const handleRoleSelection = (role: 'housekeeper' | 'seeker') => {
    setUserRole(role);
    router.push('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>CleanConnect</Text>
          <Text style={styles.tagline}>Connecting clean spaces with skilled professionals</Text>
        </View>

        <View style={styles.roleSelection}>
          <Text style={styles.question}>How would you like to use CleanConnect?</Text>
          
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => handleRoleSelection('housekeeper')}
          >
            <Text style={styles.roleButtonText}>I'm a Housekeeper</Text>
            <Text style={styles.roleDescription}>I want to offer my cleaning services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => handleRoleSelection('seeker')}
          >
            <Text style={styles.roleButtonText}>I'm Hiring Help</Text>
            <Text style={styles.roleDescription}>I want to find cleaning services</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 17,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  roleSelection: {
    width: '100%',
  },
  question: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  roleButton: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleButtonText: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 20,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  roleDescription: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
});