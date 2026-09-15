import * as SecureStore from 'expo-secure-store';

// Constants for storage keys
const TOKEN_KEY = 'userToken';
const SESSION_KEY = 'userSession';
const REFRESH_TOKEN_KEY = 'refreshToken';
const BOT_SETTINGS_KEY = 'botSettings';

/**
 * Get stored authentication token
 * @returns {Promise<string|null>} Token or null if not found
 */
export const getStoredToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Save authentication token
 * @param {string} token - Token to save
 */
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Delete authentication token
 */
export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

/**
 * Get stored user session
 * @returns {Promise<object|null>} Session object or null
 */
export const getSession = async () => {
  try {
    const session = await SecureStore.getItemAsync(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Save user session
 * @param {object} session - Session object to save
 */
export const saveSession = async (session) => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * Delete user session
 */
export const deleteSession = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

/**
 * Get refresh token
 * @returns {Promise<string|null>} Refresh token or null
 */
export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save refresh token
 * @param {string} token - Refresh token to save
 */
export const saveRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
  }
};

/**
 * Delete refresh token
 */
export const deleteRefreshToken = async () => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting refresh token:', error);
  }
};

/**
 * Get bot settings
 * @returns {Promise<object|null>} Bot settings or null
 */
export const getBotSettings = async () => {
  try {
    const settings = await SecureStore.getItemAsync(BOT_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting bot settings:', error);
    return null;
  }
};

/**
 * Save bot settings
 * @param {object} settings - Bot settings to save
 */
export const saveBotSettings = async (settings) => {
  try {
    await SecureStore.setItemAsync(BOT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving bot settings:', error);
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(BOT_SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await getStoredToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
