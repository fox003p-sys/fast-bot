import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AuthContext from '../../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const WebAuthScreen = ({ navigation, route }) => {
  const { setToken, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const { mode } = route.params; // 'login' или 'register'

  const AUTH_URLS = {
    login: 'https://vkserfing.com/login',
    register: 'https://vkserfing.com/register',
  };

  const handleNavigation = async (navState) => {
    const { url } = navState;

    // Проверяем успешный вход (редирект на главную или профиль)
    if (url.includes('vkserfing.com/dashboard') || url.includes('vkserfing.com/profile') || url.includes('vkserfing.com/')) {
      // Извлекаем токен из URL, если он есть
      const tokenMatch = url.match(/[?&]token=([^&]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        await SecureStore.setItemAsync('userToken', token);
        setToken(token);
        setUser({ token });
        navigation.replace('Bot');
        return;
      }

      // Если токен не в URL, просто помечаем, что пользователь залогинен
      await SecureStore.setItemAsync('isLoggedIn', 'true');
      setToken('web_auth_success');
      navigation.replace('Bot');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: AUTH_URLS[mode] || AUTH_URLS.login }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigation}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={styles.webview}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#00d4ff"
          style={styles.loader}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
});

export default WebAuthScreen;
