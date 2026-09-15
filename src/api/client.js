import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

// Unified API configuration
const BASE_URL = 'https://vkserfing.com/api';
const API_TIMEOUT = 15000;
const MAX_RETRIES = 3;

// Create axios instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request cache
const requestCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request interceptor to add auth token
client.interceptors.request.use(
  async (config) => {
    try {
      // Check network connectivity
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        throw new Error('Network not available');
      }

      // Add auth token
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Generate cache key for GET requests
      if (config.method === 'get') {
        const cacheKey = `${config.url}:${JSON.stringify(config.params)}`;
        const cachedResponse = requestCache.get(cacheKey);
        
        if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
          return Promise.resolve(cachedResponse.response);
        }
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and caching
client.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}:${JSON.stringify(response.config.params)}`;
      requestCache.set(cacheKey, {
        response,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token may have expired
    if (error.response?.status === 401) {
      console.warn('Unauthorized - token may have expired');
      
      try {
        // Try to refresh token
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (refreshResponse.data.status === 'success') {
            const newToken = refreshResponse.data.data.token;
            await SecureStore.setItemAsync('userToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        }

        // If refresh fails, clear auth data
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userSession');
        await SecureStore.deleteItemAsync('refreshToken');
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userSession');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }

    // Retry mechanism for network errors (5xx, network errors)
    if (shouldRetry(error) && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
      
      try {
        await new Promise(resolve => setTimeout(resolve, delay));
        return client(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to determine if request should be retried
function shouldRetry(error) {
  if (!error.response) {
    // Network error
    return true;
  }
  
  // Retry on server errors (5xx)
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }
  
  // Retry on rate limiting (429)
  if (error.response.status === 429) {
    return true;
  }
  
  return false;
}

// Clear cache function
export const clearCache = () => {
  requestCache.clear();
};

// Clear specific cache key
export const clearCacheKey = (key) => {
  requestCache.delete(key);
};

// Invalidate cache for specific endpoint
export const invalidateCache = (url, params = {}) => {
  const cacheKey = `${url}:${JSON.stringify(params)}`;
  requestCache.delete(cacheKey);
};

export default client;
