import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { loginUser, registerUser, getUserById } from '@/services/api';
import { User } from '@/models/types';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  userRole: 'housekeeper' | 'seeker' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role: 'housekeeper' | 'seeker') => Promise<void>;
  logout: () => void;
  setUserRole: (role: 'housekeeper' | 'seeker') => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  userRole: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUserRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userRole, setUserRole] = useState<'housekeeper' | 'seeker' | null>(null);

  useEffect(() => {
    // Check for stored user session
    const checkSession = async () => {
      try {
        // In a real app, you'd check local storage or secure storage
        // For this demo, we'll just initialize without a user
        setIsInitialized(true);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsInitialized(true);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'housekeeper' | 'seeker'
  ) => {
    try {
      const userData = await registerUser(name, email, password, phone, role);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialized,
    userRole,
    login,
    register,
    logout,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};