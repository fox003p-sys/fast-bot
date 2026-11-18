import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AuthContext from '../../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

import { getWebAuthUrl, resolveWebAuthResult } from '../../utils/webAuth';

const WebAuthScreen = ({ navigation, route }) => {
  const { setToken, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const { mode } = route.params; // 'login' или 'register'

  // У сайта нет отдельных страниц /login и /register (они отдают 404):
  // форма входа и регистрации встроена в главную страницу.
  const AUTH_URL = getWebAuthUrl(mode);

  const completeAuth = async (token) => {
    if (token) {
      await SecureStore.setItemAsync('userToken', token);
    } else {
      await SecureStore.setItemAsync('isLoggedIn', 'true');
    }
    setToken(token || 'web_auth_success');
    setUser({ token: token || 'web_auth_success' });
    navigation.replace('Bot');
  };

  const handleNavigation = async (navState) => {
    const { url } = navState;

    const { success, token } = resolveWebAuthResult(AUTH_URL, url);
    if (success) {
      setLoading(false);
      await completeAuth(token);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: AUTH_URL }}
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
