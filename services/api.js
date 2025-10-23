// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - replace with your actual API base URL
const BASE_URL = 'https://admin-nasscripterp.up.railway.app/api'; // Change this to your API URL

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration - clear storage and redirect to login
      try {
        await AsyncStorage.multiRemove(['token', 'refresh', 'userData']);
        // You might want to add navigation logic here to redirect to login
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login/', credentials);
      
      if (response.data.access && response.data.refresh) {
        // Store tokens
        await AsyncStorage.setItem('token', response.data.access);
        await AsyncStorage.setItem('refresh', response.data.refresh);
        
        // Store user data if available
        if (response.data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  storeUserData: async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  getUserRole: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.role ? user.role.toLowerCase() : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  },

  refreshToken: async () => {
    try {
      const refresh = await AsyncStorage.getItem('refresh');
      if (!refresh) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/refresh/', { refresh });
      
      if (response.data.access) {
        await AsyncStorage.setItem('token', response.data.access);
      }
      
      return response.data;
    } catch (error) {
      // Clear tokens if refresh fails
      await AsyncStorage.multiRemove(['token', 'refresh', 'userData']);
      throw error;
    }
  },

  logout: async () => {
    try {
      const refresh_token = await AsyncStorage.getItem('refresh');
      if (refresh_token) {
        await api.post('/logout/', { refresh_token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.multiRemove(['token', 'refresh', 'userData']);
    }
  },
};

