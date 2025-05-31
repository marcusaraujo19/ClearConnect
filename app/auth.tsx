import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

/**
 * Authentication screen for user login and registration
 */
export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, userRole } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      if (!isLogin && !name) {
        Alert.alert('Missing Name', 'Please enter your name');
        setIsLoading(false);
        return;
      }

      if (!isLogin && !phone) {
        Alert.alert('Missing Phone', 'Please enter your phone number');
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, phone, userRole || 'seeker');
      }

      router.replace('/(tabs)/browse');
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        isLogin ? 'Failed to log in. Please check your credentials.' : 'Failed to register. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue to CleanConnect'
                : `Join as a ${userRole === 'housekeeper' ? 'Housekeeper' : 'Service Seeker'}`}
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Log In' : 'Register'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchMode}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchModeText}>
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 17,
    color: Colors.light.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
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
    fontSize: 17,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'SF-Pro-Text-Semibold',
    color: Colors.light.white,
    fontSize: 17,
  },
  switchMode: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchModeText: {
    fontFamily: 'SF-Pro-Text-Medium',
    color: Colors.light.primary,
    fontSize: 16,
  },
});