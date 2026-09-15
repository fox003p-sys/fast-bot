import { useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

import { authAPI, userAPI } from '../api/endpoints';
import { 
  saveToken, 
  saveSession, 
  saveRefreshToken,
  clearAuthData,
  getStoredToken,
  getSession,
  isAuthenticated as checkIsAuthenticated,
} from '../utils/tokenStorage';

/**
 * Custom hook for authentication management
 * @returns {Object} - Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await getStoredToken();
        const storedSession = await getSession();
        
        if (storedToken && storedSession) {
          // Validate token
          try {
            const response = await authAPI.validateToken();
            if (response.data.status === 'success') {
              setToken(storedToken);
              setUser(storedSession);
            } else {
              await clearAuthData();
            }
          } catch (validationError) {
            console.warn('Token validation failed:', validationError);
            await clearAuthData();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Sign in user
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} - Result object with success status and user data
   */
  const signIn = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);

    try {
      if (!isOnline) {
        Alert.alert('Ошибка', 'Нет подключения к интернету');
        return { success: false, error: 'Нет подключения к интернету' };
      }

      const response = await authAPI.login(username, password);
      const data = response.data;

      if (data.status === 'success' && data.data && data.data.token) {
        await saveToken(data.data.token);
        await saveSession(data.data);
        
        if (data.data.refresh_token) {
          await saveRefreshToken(data.data.refresh_token);
        }

        setToken(data.data.token);
        setUser(data.data);
        setLoading(false);
        
        return { success: true, user: data.data };
      }

      setLoading(false);
      return { success: false, error: data.message || 'Неизвестная ошибка' };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isOnline]);

  /**
   * Register new user
   * @param {string} username - Username
   * @param {string} email - Email
   * @param {string} password - Password
   * @returns {Promise<Object>} - Result object with success status and user data
   */
  const signUp = useCallback(async (username, email, password) => {
    setError(null);
    setLoading(true);

    try {
      if (!isOnline) {
        Alert.alert('Ошибка', 'Нет подключения к интернету');
        return { success: false, error: 'Нет подключения к интернету' };
      }

      const response = await authAPI.register(username, email, password);
      const data = response.data;

      if (data.status === 'success' && data.data && data.data.token) {
        await saveToken(data.data.token);
        await saveSession(data.data);
        
        if (data.data.refresh_token) {
          await saveRefreshToken(data.data.refresh_token);
        }

        setToken(data.data.token);
        setUser(data.data);
        setLoading(false);
        
        return { success: true, user: data.data };
      }

      setLoading(false);
      return { success: false, error: data.message || 'Неизвестная ошибка' };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isOnline]);

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      await clearAuthData();
      setToken(null);
      setUser(null);
    }
  }, []);

  /**
   * Refresh token
   * @returns {Promise<boolean>} - True if refresh succeeded
   */
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (!refreshToken) {
        await signOut();
        return false;
      }

      const response = await authAPI.refreshToken(refreshToken);
      const data = response.data;

      if (data.status === 'success' && data.data && data.data.token) {
        await saveToken(data.data.token);
        setToken(data.data.token);
        
        if (data.data.refresh_token) {
          await saveRefreshToken(data.data.refresh_token);
        }

        return true;
      }

      await signOut();
      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      await signOut();
      return false;
    }
  }, [signOut]);

  /**
   * Get user profile
   * @returns {Promise<Object|null>} - User profile or null
   */
  const getProfile = useCallback(async () => {
    try {
      if (!token) return null;
      
      const response = await userAPI.getProfile();
      const data = response.data;
      
      if (data.status === 'success') {
        setUser(data.data);
        await saveSession(data.data);
        return data.data;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to get profile:', err);
      return null;
    }
  }, [token]);

  /**
   * Update user profile
   * @param {Object} profileData - Data to update
   * @returns {Promise<Object|null>} - Updated profile or null
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      const data = response.data;
      
      if (data.status === 'success') {
        setUser(prev => ({ ...prev, ...data.data }));
        await saveSession({ ...user, ...data.data });
        return data.data;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, [user]);

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = useCallback(async () => {
    return await checkIsAuthenticated();
  }, []);

  return {
    user,
    token,
    loading,
    error,
    isOnline,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshToken,
    getProfile,
    updateProfile,
  };
};

export default useAuth;
