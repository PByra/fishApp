import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { seasonalFish, getCurrentInSeasonFish } from '../data/seasonalData';

export default function SeasonalScreen() {
  const [inSeasonFish, setInSeasonFish] = useState([]);
  const [expandedFish, setExpandedFish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current in-season fish for Wisconsin
    const currentSeason = getCurrentInSeasonFish();
    setInSeasonFish(currentSeason.length > 0 ? currentSeason : Object.entries(seasonalFish).map(([fish, data]) => ({ fish, ...data })));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#004E89" />
      </View>
    );
  }

  const getSeasonColor = (season) => {
    if (season.includes('Spring')) return '#4CAF50';
    if (season.includes('Summer')) return '#FF9800';
    if (season.includes('Fall')) return '#F44336';
    if (season.includes('Winter')) return '#2196F3';
    return '#004E89';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return '#004E89';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>In Season Fish</Text>
        <Text style={styles.headerSubtitle}>Current fishing opportunities in Wisconsin</Text>
      </View>

      {inSeasonFish.length > 0 ? (
        inSeasonFish.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.fishCard, expandedFish === idx && styles.fishCardActive]}
            onPress={() => setExpandedFish(expandedFish === idx ? null : idx)}
          >
            <View style={styles.fishHeader}>
              <View style={styles.fishNameContainer}>
                <Text style={styles.fishName}>{item.fish}</Text>
                <Text style={[styles.season, { color: getSeasonColor(item.season) }]}>
                  {item.season}
                </Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>

            {expandedFish === idx && (
              <View style={styles.expandedContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Peak Months:</Text>
                  <Text style={styles.value}>{item.peak.join(', ')}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Depth Range:</Text>
                  <Text style={styles.value}>{item.depth}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tips:</Text>
                  <Text style={styles.value}>{item.tips}</Text>
                </View>

                <View style={styles.seasonInfo}>
                  <Feather name="info" size={16} color="#004E89" />
                  <Text style={styles.seasonInfoText}>
                    This is a great time to target {item.fish} in Wisconsin waters!
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No fish currently in peak season</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Feather name="alert-circle" size={20} color="#FF9800" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Check Local Regulations</Text>
          <Text style={styles.infoText}>
            Always verify current fishing regulations and license requirements with the Wisconsin DNR before fishing.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#004E89',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  fishCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fishCardActive: {
    borderColor: '#004E89',
    borderWidth: 2,
    backgroundColor: '#f0f7ff',
  },
  fishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fishNameContainer: {
    flex: 1,
  },
  fishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  season: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  seasonInfo: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  seasonInfoText: {
    fontSize: 12,
    color: '#004E89',
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoContent: {
    flex: 1,
    marginLeft: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
