import React, { useEffect, useMemo, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

import AuthContext from './src/context/AuthContext';
import { getStoredToken, saveToken, saveSession, clearAuthData } from './src/utils/tokenStorage';
import { authAPI, userAPI } from './src/api/endpoints';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WebAuthScreen from './src/screens/auth/WebAuthScreen';
import BotScreen from './src/screens/BotScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import CampaignsScreen from './src/screens/campaigns/CampaignsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import CampaignDetailScreen from './src/screens/campaigns/CampaignDetailScreen';
import PostsScreen from './src/screens/posts/PostsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        contentStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="WebAuth" component={WebAuthScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
        contentStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <Stack.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Posts" component={PostsScreen} options={{ title: 'Posts' }} />
    </Stack.Navigator>
  );
}

function CampaignsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
        contentStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <Stack.Screen name="CampaignsTab" component={CampaignsScreen} options={{ title: 'Campaigns' }} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} options={{ title: 'Campaign Details' }} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#0f0f1e', borderTopColor: '#333' },
        headerShown: false,
        lazy: true, // Optimize: Load screens lazily
      }}
    >
      <Tab.Screen
        name="Bot"
        component={BotScreen}
        options={{
          tabBarLabel: 'Бот',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Campaigns"
        component={CampaignsStack}
        options={{
          tabBarLabel: 'Кампании',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return { ...prevState, userToken: action.token, isLoading: false };
        case 'SIGN_IN':
          return { ...prevState, isSignout: false, userToken: action.token, userSession: action.user };
        case 'SIGN_OUT':
          return { ...prevState, isSignout: true, userToken: null, userSession: null };
      }
    },
    { isLoading: true, isSignout: false, userToken: null, userSession: null }
  );

  // Memoized auth context for performance
  const authContext = useMemo(
    () => ({
      signIn: async () => {
        // Авторизация через WebView
        return { success: true };
      },
      
      signUp: async () => {
        // Регистрация через WebView
        return { success: true };
      },
      
      signOut: async () => {
        try {
          await clearAuthData();
          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          console.error('Failed to sign out:', error);
        }
      },
      
      getUserProfile: async () => {
        try {
          const response = await userAPI.getProfile();
          return response.data;
        } catch (error) {
          console.error('Failed to get user profile:', error);
          throw error;
        }
      },
    }),
    [state.userToken]
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Check network connectivity
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
          dispatch({ type: 'RESTORE_TOKEN', token: null });
          return;
        }

        const token = await getStoredToken();
        
        // Validate token if exists
        if (token) {
          try {
            const response = await authAPI.validateToken();
            if (response.data.status !== 'success') {
              await clearAuthData();
              dispatch({ type: 'RESTORE_TOKEN', token: null });
              return;
            }
          } catch (error) {
            console.warn('Token validation failed:', error);
            await clearAuthData();
            dispatch({ type: 'RESTORE_TOKEN', token: null });
            return;
          }
        }
        
        dispatch({ type: 'RESTORE_TOKEN', token });
      } catch (e) {
        console.error('Failed to restore token:', e);
        dispatch({ type: 'RESTORE_TOKEN', token: null });
      }
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? <AuthStack /> : <AppStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
