import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinWaters } from '../data/wisconsinWaters';

export default function MapScreen({ navigation }) {
  const [selectedWater, setSelectedWater] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate location permission check
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#004E89" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fishing Waters</Text>
        <Text style={styles.headerSubtitle}>Tap to view fish species</Text>
      </View>

      {wisconsinWaters.map((water) => (
        <TouchableOpacity
          key={water.id}
          style={[styles.waterCard, selectedWater?.id === water.id && styles.waterCardActive]}
          onPress={() => setSelectedWater(selectedWater?.id === water.id ? null : water)}
        >
          <View style={styles.waterHeader}>
            <View style={styles.waterInfo}>
              <Feather name={water.type === 'lake' ? 'droplet' : 'navigation'} size={20} color="#004E89" />
              <View style={styles.waterTextContainer}>
                <Text style={styles.waterName}>{water.name}</Text>
                <Text style={styles.waterType}>{water.type.charAt(0).toUpperCase() + water.type.slice(1)}</Text>
              </View>
            </View>
            <Text style={styles.difficultyBadge}>{water.difficulty}</Text>
          </View>

          {selectedWater?.id === water.id && (
            <View style={styles.expandedContent}>
              <Text style={styles.bestSeason}>Best Season: {water.bestSeason}</Text>
              <Text style={styles.fishTitle}>Fish Species:</Text>
              <View style={styles.fishList}>
                {water.fish.map((fish, idx) => (
                  <View key={idx} style={styles.fishTag}>
                    <Text style={styles.fishTagText}>{fish}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.coordinates}>
                📍 {water.location.latitude.toFixed(2)}, {water.location.longitude.toFixed(2)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
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
  waterCard: {
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
  waterCardActive: {
    borderColor: '#004E89',
    borderWidth: 2,
    backgroundColor: '#f0f7ff',
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waterTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  waterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  waterType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  difficultyBadge: {
    backgroundColor: '#004E89',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bestSeason: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  fishTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  fishList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  fishTag: {
    backgroundColor: '#e3f2fd',
    borderColor: '#004E89',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  fishTagText: {
    fontSize: 11,
    color: '#004E89',
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
  },
});
