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
          } catch (err) {
            console.warn('Token validation failed:', err);
            await clearAuthData();
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Sign in user (handled via WebView)
   * @returns {Promise<Object>} - Result object with success status
   */
  const signIn = useCallback(async () => {
    // Авторизация через WebView
    return { success: true };
  }, []);

  /**
   * Register new user (handled via WebView)
   * @returns {Promise<Object>} - Result object with success status
   */
  const signUp = useCallback(async () => {
    // Регистрация через WebView
    return { success: true };
  }, []);

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
        await saveSession(data.data);
        
        if (data.data.refresh_token) {
          await saveRefreshToken(data.data.refresh_token);
        }
        
        setToken(data.data.token);
        setUser(data.data);
        return true;
      }
      
      await signOut();
      return false;
      
    } catch (err) {
      console.error('Failed to refresh token:', err);
      await signOut();
      return false;
    }
  }, []);

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile data
   */
  const getProfile = useCallback(async () => {
    try {
      const response = await userAPI.getProfile();
      const data = response.data;
      
      if (data.status === 'success') {
        setUser(data.data);
        return data.data;
      }
      
      throw new Error(data.message || 'Failed to get profile');
      
    } catch (err) {
      console.error('Failed to get profile:', err);
      throw err;
    }
  }, []);

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  /**
   * Clear authentication error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    token,
    loading,
    error,
    isOnline,
    signIn,
    signUp,
    signOut,
    refreshToken,
    getProfile,
    isAuthenticated,
    clearError,
    setUser,
    setToken,
  };
};

export default useAuth;
