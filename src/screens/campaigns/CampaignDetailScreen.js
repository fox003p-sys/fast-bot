import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const CampaignDetailScreen = ({ route }) => {
  const { campaign } = route.params;
  const [isPaused, setIsPaused] = useState(campaign.status === 'paused');

  const handleToggleCampaign = () => {
    setIsPaused(!isPaused);
    Alert.alert('Success', `Campaign ${isPaused ? 'resumed' : 'paused'}`)
  };

  const handleEditCampaign = () => {
    Alert.alert('Edit Campaign', 'Campaign editing feature coming soon!');
  };

  const handleDeleteCampaign = () => {
    Alert.alert('Delete Campaign', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Campaign deleted') },
    ]);
  };

  const spendPercentage = (campaign.spent / campaign.budget) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{campaign.name}</Text>
        <Text style={[styles.status, { color: isPaused ? '#f97316' : '#4ade80' }]}>
          {isPaused ? 'PAUSED' : 'ACTIVE'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        <View style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <Text style={styles.label}>Total Budget</Text>
            <Text style={styles.value}>${campaign.budget}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.label}>Spent</Text>
            <Text style={styles.value}>${campaign.spent}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.label}>Remaining</Text>
            <Text style={styles.value}>${campaign.budget - campaign.spent}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${spendPercentage}%` }]} />
          </View>
          <Text style={styles.percentage}>{spendPercentage.toFixed(1)}% spent</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1,250</Text>
            <Text style={styles.statLabel}>Impressions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>340</Text>
            <Text style={styles.statLabel}>Clicks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>27.2%</Text>
            <Text style={styles.statLabel}>CTR</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>$2.36</Text>
            <Text style={styles.statLabel}>CPC</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleToggleCampaign}>
          <Text style={styles.buttonText}>{isPaused ? 'Resume Campaign' : 'Pause Campaign'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleEditCampaign}>
          <Text style={styles.buttonText}>Edit Campaign</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDeleteCampaign}>
          <Text style={styles.buttonText}>Delete Campaign</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  budgetCard: {
    backgroundColor: '#0f0f1e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#999',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progress: {
    height: '100%',
    backgroundColor: '#00d4ff',
  },
  percentage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#0f0f1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#00d4ff',
  },
  secondaryButton: {
    backgroundColor: '#0f0f1e',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CampaignDetailScreen;
