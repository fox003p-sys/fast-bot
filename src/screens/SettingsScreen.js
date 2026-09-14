import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AuthContext from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    autoLike: false,
    autoComment: false,
    autoFollow: false,
    commentText: '',
    likeDelay: 5,
    commentDelay: 10,
    notifications: true,
    darkMode: true,
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await SecureStore.getItemAsync('botSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    const loadUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const response = await fetch('https://vkserfing.com/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.status === 'success') {
            setUserInfo(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadSettings();
    loadUserInfo();
  }, []);

  const saveSettings = async () => {
    try {
      await SecureStore.setItemAsync('botSettings', JSON.stringify(settings));
      Alert.alert('Успех', 'Настройки сохранены');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить настройки');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Настройки бота</Text>
        <Text style={styles.subtitle}>VKSerfing Bot Configuration</Text>
      </View>

      {/* Информация о пользователе */}
      {userInfo && (
        <View style={styles.userInfoCard}>
          <Text style={styles.sectionTitle}>Ваш профиль</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Имя:</Text>
            <Text style={styles.userInfoValue}>{userInfo.username || 'Неизвестно'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Баланс:</Text>
            <Text style={styles.userInfoValue}>{userInfo.balance || 0} монет</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Роль:</Text>
            <Text style={[styles.userInfoValue, { color: userInfo.role === 'premium' ? '#f59e0b' : '#999' }]}>
              {userInfo.role === 'premium' ? 'Premium' : 'Стандарт'}
            </Text>
          </View>
        </View>
      )}

      {/* Настройки авто-действий */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Авто-действия</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="heart" size={20} color="#ef4444" />
            <Text style={styles.settingLabel}>Авто-лайки</Text>
          </View>
          <Switch
            value={settings.autoLike}
            onValueChange={() => toggleSetting('autoLike')}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={settings.autoLike ? '#00d4ff' : '#666'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="chatbubble" size={20} color="#3b82f6" />
            <Text style={styles.settingLabel}>Авто-комментарии</Text>
          </View>
          <Switch
            value={settings.autoComment}
            onValueChange={() => toggleSetting('autoComment')}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={settings.autoComment ? '#00d4ff' : '#666'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="person-add" size={20} color="#10b981" />
            <Text style={styles.settingLabel}>Авто-подписки</Text>
          </View>
          <Switch
            value={settings.autoFollow}
            onValueChange={() => toggleSetting('autoFollow')}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={settings.autoFollow ? '#00d4ff' : '#666'}
          />
        </View>
      </View>

      {/* Настройки задержек */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Задержки между действиями</Text>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Задержка лайков: {settings.likeDelay} сек</Text>
          <Slider
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={settings.likeDelay}
            onValueChange={(value) => setSettings(prev => ({ ...prev, likeDelay: Math.round(value) }))}
            minimumTrackTintColor="#00d4ff"
            maximumTrackTintColor="#333"
            thumbTintColor="#00d4ff"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Задержка комментариев: {settings.commentDelay} сек</Text>
          <Slider
            minimumValue={5}
            maximumValue={60}
            step={1}
            value={settings.commentDelay}
            onValueChange={(value) => setSettings(prev => ({ ...prev, commentDelay: Math.round(value) }))}
            minimumTrackTintColor="#00d4ff"
            maximumTrackTintColor="#333"
            thumbTintColor="#00d4ff"
          />
        </View>
      </View>

      {/* Текст комментария */}
      {settings.autoComment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Текст авто-комментария</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Введите текст для авто-комментариев..."
            placeholderTextColor="#999"
            value={settings.commentText}
            onChangeText={(text) => setSettings(prev => ({ ...prev, commentText: text }))}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.hintText}>
            Используйте переменные: {`{username}`}, {`{random}`}, {`{emoji}`}
          </Text>
        </View>
      )}

      {/* Уведомления */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="notifications" size={20} color="#f59e0b" />
            <Text style={styles.settingLabel}>Получать уведомления</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={settings.notifications ? '#00d4ff' : '#666'}
          />
        </View>
      </View>

      {/* Темная тема */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="moon" size={20} color="#8b5cf6" />
            <Text style={styles.settingLabel}>Темная тема</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={settings.darkMode ? '#00d4ff' : '#666'}
          />
        </View>
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Сохранить настройки</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>VKSerfing Bot v1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  userInfoCard: {
    margin: 12,
    padding: 16,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  section: {
    margin: 12,
    padding: 16,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#999',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionsSection: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00d4ff',
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default SettingsScreen;
