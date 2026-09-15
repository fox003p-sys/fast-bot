import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

import { botAPI, userAPI } from '../api/endpoints';
import { useApi, useDebouncedSearch } from '../hooks';
import { getStoredToken } from '../utils/tokenStorage';

const BotScreen = ({ navigation }) => {
  const [autoLike, setAutoLike] = useState(false);
  const [autoComment, setAutoComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Use custom hook for tasks
  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError,
    execute: loadTasks,
    retry: retryTasks,
  } = useApi(botAPI.getTasks, {
    immediate: false,
    maxRetries: 3,
    onError: (err) => {
      console.error('Error loading tasks:', err);
      if (err.message !== 'Network not available') {
        Alert.alert('Ошибка', 'Не удалось загрузить задачи');
      }
    },
  });

  // Use custom hook for stats
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    execute: loadStats,
    retry: retryStats,
  } = useApi(userAPI.getStats, {
    immediate: false,
    maxRetries: 3,
  });

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Load initial data
  useEffect(() => {
    if (isOnline) {
      loadTasks();
      loadStats();
    }
  }, [isOnline, loadTasks, loadStats]);

  const onRefresh = useCallback(async () => {
    if (isOnline) {
      await Promise.all([loadTasks(), loadStats()]);
    }
  }, [isOnline, loadTasks, loadStats]);

  // Memoized task rendering for performance
  const renderTaskItem = useCallback((task) => {
    const handleLikeTask = async () => {
      if (!isOnline) {
        Alert.alert('Ошибка', 'Нет подключения к интернету');
        return;
      }

      try {
        const response = await botAPI.likePost(task.id, task.url);
        const data = response.data;
        
        if (data.status === 'success') {
          Alert.alert('Успех', 'Лайк успешно поставлен!');
          // Update local state immediately for better UX
          loadTasks();
          loadStats();
        } else {
          Alert.alert('Ошибка', data.message || 'Не удалось поставить лайк');
        }
      } catch (error) {
        console.error('Error liking post:', error);
        Alert.alert('Ошибка', 'Не удалось поставить лайк');
      }
    };

    const handleCommentTask = async () => {
      if (!isOnline) {
        Alert.alert('Ошибка', 'Нет подключения к интернету');
        return;
      }

      if (!commentText.trim()) {
        Alert.alert('Ошибка', 'Введите текст комментария');
        return;
      }

      try {
        const response = await botAPI.commentPost(task.id, task.url, commentText);
        const data = response.data;
        
        if (data.status === 'success') {
          Alert.alert('Успех', 'Комментарий успешно опубликован!');
          setCommentText('');
          loadTasks();
          loadStats();
        } else {
          Alert.alert('Ошибка', data.message || 'Не удалось опубликовать комментарий');
        }
      } catch (error) {
        console.error('Error commenting:', error);
        Alert.alert('Ошибка', 'Не удалось опубликовать комментарий');
      }
    };

    return (
      <View key={task.id} style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.title || 'Задача'}</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: task.status === 'completed' ? '#22c55e' : 
                            task.status === 'in_progress' ? '#f59e0b' : '#3b82f6'
          }]}>
            <Text style={styles.statusText}>{task.status === 'completed' ? 'Выполнено' : 
                                                  task.status === 'in_progress' ? 'В процессе' : 'Ожидает'}</Text>
          </View>
        </View>
        
        <Text style={styles.taskDescription}>
          {task.description || `Поставить ${task.type === 'like' ? 'лайк' : 'комментарий'} в VK`}
        </Text>
        
        {task.url && (
          <Text style={styles.taskUrl} numberOfLines={1}>
            URL: {task.url}
          </Text>
        )}
        
        <View style={styles.taskActions}>
          {task.type === 'like' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikeTask}
              disabled={task.status === 'completed'}
            >
              <Ionicons name="heart" size={20} color={task.status === 'completed' ? '#22c55e' : '#ef4444'} />
              <Text style={[styles.actionText, { color: task.status === 'completed' ? '#22c55e' : '#ef4444' }]}>
                {task.status === 'completed' ? 'Выполнено' : 'Лайк'}
              </Text>
            </TouchableOpacity>
          )}
          
          {task.type === 'comment' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCommentTask}
              disabled={task.status === 'completed'}
            >
              <Ionicons name="chatbubble" size={20} color={task.status === 'completed' ? '#22c55e' : '#3b82f6'} />
              <Text style={[styles.actionText, { color: task.status === 'completed' ? '#22c55e' : '#3b82f6' }]}>
                {task.status === 'completed' ? 'Выполнено' : 'Коммент'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {task.reward && (
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardText}>★ Награда: {task.reward} монет</Text>
          </View>
        )}
      </View>
    );
  }, []);

  // Memoized stats component
  const StatsSection = useMemo(() => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Ваша статистика</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats?.likesGiven || 0}</Text>
          <Text style={styles.statLabel}>Лайков</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats?.commentsPosted || 0}</Text>
          <Text style={styles.statLabel}>Комментариев</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats?.tasksCompleted || 0}</Text>
          <Text style={styles.statLabel}>Задач выполнено</Text>
        </View>
      </View>
    </View>
  ), [stats]);

  // Toggle auto-like setting
  const toggleAutoLike = async () => {
    const newValue = !autoLike;
    setAutoLike(newValue);
    
    try {
      const token = await getStoredToken();
      if (token) {
        await fetch('https://vkserfing.com/api/settings/auto-like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ enabled: newValue }),
        });
      }
    } catch (error) {
      console.error('Error updating auto-like setting:', error);
      setAutoLike(!newValue);
    }
  };

  // Toggle auto-comment setting
  const toggleAutoComment = async () => {
    const newValue = !autoComment;
    setAutoComment(newValue);
    
    try {
      const token = await getStoredToken();
      if (token) {
        await fetch('https://vkserfing.com/api/settings/auto-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ enabled: newValue, text: commentText }),
        });
      }
    } catch (error) {
      console.error('Error updating auto-comment setting:', error);
      setAutoComment(!newValue);
    }
  };

  // Loading state
  if ((tasksLoading || statsLoading) && tasks?.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
        {!isOnline && <Text style={styles.offlineText}>Нет подключения к интернету</Text>}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={tasksLoading || statsLoading} onRefresh={onRefresh} tintColor="#00d4ff" />
      }
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {StatsSection}

      {/* Auto-action settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Авто-режим</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Автоматические лайки</Text>
          <Switch
            value={autoLike}
            onValueChange={toggleAutoLike}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={autoLike ? '#00d4ff' : '#666'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Автоматические комментарии</Text>
          <Switch
            value={autoComment}
            onValueChange={toggleAutoComment}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={autoComment ? '#00d4ff' : '#666'}
          />
        </View>
        
        {autoComment && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Текст комментария для авто-режима"
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
          </View>
        )}
      </View>

      {/* Tasks list */}
      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Доступные задачи ({tasks?.length || 0})</Text>
        
        {(!tasks || tasks.length === 0) ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="list" size={48} color="#666" />
            <Text style={styles.emptyText}>Нет доступных задач</Text>
            <Text style={styles.emptySubtext}>Попробуйте обновить страницу</Text>
            
            {tasksError && <Text style={styles.errorText}>{tasksError.message}</Text>}
          </View>
        ) : (
          tasks.map(renderTaskItem)
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bot для VKSerfing • v1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  offlineText: {
    color: '#ef4444',
    marginTop: 8,
    fontSize: 14,
  },
  statsContainer: {
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingsContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  commentInputContainer: {
    marginTop: 16,
  },
  commentInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tasksContainer: {
    padding: 16,
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  taskUrl: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardContainer: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 12,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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

export default BotScreen;
