import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { postsAPI } from '../../api/endpoints';

const PostsScreen = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'Just launched our new product! 🚀',
      likes: 245,
      comments: 32,
      shares: 18,
      liked: false,
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Great meeting with the team today',
      likes: 156,
      comments: 21,
      shares: 8,
      liked: false,
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'Check out our latest blog post about digital marketing',
      likes: 432,
      comments: 67,
      shares: 45,
      liked: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      // const response = await postsAPI.getPosts({ limit: 20 });
      // setPosts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId) => {
    Alert.alert('Comment', 'Add your comment here');
  };

  const handleShare = (postId) => {
    Alert.alert('Share', 'Post shared successfully!');
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.author}>{item.author}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.postStats}>
        <Text style={styles.stat}>{item.likes} likes</Text>
        <Text style={styles.stat}>{item.comments} comments</Text>
        <Text style={styles.stat}>{item.shares} shares</Text>
      </View>
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.actionText, item.liked && { color: '#ef4444' }]}>❤️ Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item.id)}
        >
          <Text style={styles.actionText}>🔄 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No posts available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  postCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  postHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  content: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 20,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    marginBottom: 12,
  },
  stat: {
    fontSize: 12,
    color: '#999',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default PostsScreen;
