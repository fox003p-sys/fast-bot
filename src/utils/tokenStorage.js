import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const SESSION_KEY = 'userSession';

export const getStoredToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export const getSession = async () => {
  try {
    const session = await SecureStore.getItemAsync(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const saveSession = async (session) => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const deleteSession = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_KEY);
    await SecureStore.deleteItemAsync('botSettings');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
