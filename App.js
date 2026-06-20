import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import AuthContext from './src/context/AuthContext';
import { getStoredToken } from './src/utils/tokenStorage';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import CampaignsScreen from './src/screens/campaigns/CampaignsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import CampaignDetailScreen from './src/screens/campaigns/CampaignDetailScreen';
import PostsScreen from './src/screens/posts/PostsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Campaigns"
        component={CampaignsStack}
        options={{
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
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
          return { ...prevState, isSignout: false, userToken: action.token };
        case 'SIGN_OUT':
          return { ...prevState, isSignout: true, userToken: null };
      }
    },
    { isLoading: true, isSignout: false, userToken: null }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getStoredToken();
        dispatch({ type: 'RESTORE_TOKEN', token });
      } catch (e) {
        console.error('Failed to restore token:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          const response = await fetch('https://api.vkserfing.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (data.token) {
            await SecureStore.setItemAsync('userToken', data.token);
            dispatch({ type: 'SIGN_IN', token: data.token });
            return { success: true };
          }
          return { success: false, error: data.message };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      signUp: async (username, email, password) => {
        try {
          const response = await fetch('https://api.vkserfing.com/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          const data = await response.json();
          if (data.token) {
            await SecureStore.setItemAsync('userToken', data.token);
            dispatch({ type: 'SIGN_IN', token: data.token });
            return { success: true };
          }
          return { success: false, error: data.message };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userToken');
          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          console.error('Failed to sign out:', error);
        }
      },
    }),
    []
  );

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
