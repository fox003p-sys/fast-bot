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
import { campaignsAPI } from '../../api/endpoints';

const CampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Summer Sale', status: 'active', budget: 5000, spent: 3200 },
    { id: 2, name: 'Brand Awareness', status: 'paused', budget: 3000, spent: 2100 },
    { id: 3, name: 'Product Launch', status: 'active', budget: 8000, spent: 4500 },
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      // const response = await campaignsAPI.getCampaigns();
      // setCampaigns(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampaigns();
    setRefreshing(false);
  };

  const renderCampaignItem = ({ item }) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => navigation.navigate('CampaignDetail', { campaign: item })}
    >
      <View style={styles.campaignHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campaignName}>{item.name}</Text>
          <Text style={styles.campaignStatus}>{item.status.toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#4ade80' : '#f97316' }]}>
          <Text style={styles.statusText}>{item.status === 'active' ? '●' : '○'}</Text>
        </View>
      </View>
      <View style={styles.campaignStats}>
        <Text style={styles.statText}>Budget: ${item.budget}</Text>
        <Text style={styles.statText}>Spent: ${item.spent}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(item.spent / item.budget) * 100}%` }]} />
      </View>
    </TouchableOpacity>
  );

  if (loading && campaigns.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={campaigns}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No campaigns yet</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  campaignCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  campaignStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    padding: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: '#00d4ff',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#00d4ff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default CampaignsScreen;
