import { useState, useCallback, useRef, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook for API requests with loading, error, and retry functionality
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - State and functions for API request
 */
export const useApi = (apiCall, options = {}) => {
  const {
    immediate = false,
    onSuccess,
    onError,
    retryDelay = 1000,
    maxRetries = 3,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  
  const retryTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const execute = useCallback(async (params = {}) => {
    // Clear previous timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Check network connectivity
    if (!isOnline) {
      const networkError = new Error('Network not available');
      setError(networkError);
      if (onError) onError(networkError);
      return Promise.reject(networkError);
    }

    setLoading(true);
    setError(null);
    setRetryCount(0);

    const executeRequest = async (attempt = 1) => {
      try {
        const response = await apiCall(params);
        
        if (!isMountedRef.current) return;
        
        setData(response.data);
        setLoading(false);
        if (onSuccess) onSuccess(response.data);
        
        return response.data;
      } catch (err) {
        if (!isMountedRef.current) return;

        const currentRetryCount = attempt - 1;
        
        // Check if we should retry
        const shouldRetry = currentRetryCount < maxRetries && 
                          (err.response?.status >= 500 || 
                           err.response?.status === 429 ||
                           !err.response);

        if (shouldRetry) {
          setRetryCount(currentRetryCount);
          const delay = Math.pow(2, currentRetryCount) * retryDelay;
          
          return new Promise((resolve, reject) => {
            retryTimeoutRef.current = setTimeout(async () => {
              try {
                const result = await executeRequest(attempt + 1);
                resolve(result);
              } catch (retryErr) {
                reject(retryErr);
              }
            }, delay);
          });
        }

        // No more retries or non-retryable error
        setLoading(false);
        setError(err);
        if (onError) onError(err);
        return Promise.reject(err);
      }
    };

    return executeRequest();
  }, [apiCall, isOnline, onSuccess, onError, retryDelay, maxRetries]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Retry function
  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      execute();
    }
  }, [retryCount, maxRetries, execute]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    isOnline,
    execute,
    retry,
    reset,
    canRetry: retryCount < maxRetries,
  };
};

/**
 * Hook for paginated API requests
 */
export const usePaginatedApi = (apiCall, options = {}) => {
  const { pageSize = 10, ...rest } = options;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);

  const { 
    data, 
    loading, 
    error, 
    execute, 
    retry, 
    reset,
    canRetry,
  } = useApi(apiCall, rest);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      const newPage = page + 1;
      const result = await execute({ ...options.params, page: newPage, pageSize });
      
      if (result && result.data && result.data.length > 0) {
        setAllData(prev => [...prev, ...result.data]);
        setPage(newPage);
        setHasMore(result.data.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more:', err);
    }
  }, [page, loading, hasMore, execute, pageSize, options.params]);

  // Refresh data
  const refresh = useCallback(async () => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    await execute({ ...options.params, page: 1, pageSize });
  }, [execute, pageSize, options.params]);

  // Update data when new data arrives
  useEffect(() => {
    if (data && data.data && page === 1) {
      setAllData(data.data);
      setHasMore(data.data.length === pageSize);
    }
  }, [data, page, pageSize]);

  return {
    data: allData,
    loading,
    error,
    page,
    hasMore,
    execute,
    retry,
    reset,
    loadMore,
    refresh,
    canRetry,
  };
};

/**
 * Hook for debounced search requests
 */
export const useDebouncedSearch = (apiCall, options = {}) => {
  const { debounceTime = 500, ...rest } = options;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const debounceTimeoutRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceTime);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, debounceTime]);

  const { 
    data, 
    loading, 
    error, 
    execute,
    retry,
    reset,
  } = useApi(apiCall, rest);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      execute({ q: debouncedQuery });
    } else {
      reset();
    }
  }, [debouncedQuery, execute, reset]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    data,
    loading,
    error,
    retry,
    reset,
  };
};
