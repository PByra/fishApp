import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
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
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fishing Waters</Text>
        <Text style={styles.headerSubtitle}>Tap to view fish species & navigate</Text>
      </View>

      {wisconsinWaters.map((water) => (
        <TouchableOpacity
          key={water.id}
          style={[styles.waterCard, selectedWater?.id === water.id && styles.waterCardActive]}
          onPress={() => setSelectedWater(selectedWater?.id === water.id ? null : water)}
        >
          <View style={styles.waterHeader}>
            <View style={styles.waterInfo}>
              <Feather name={water.type === 'lake' ? 'droplet' : 'navigation'} size={20} color="#1B5E20" />
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
              
              {water.accessPoints && water.accessPoints.length > 0 && (
                <View style={styles.accessPointsSection}>
                  <Text style={styles.accessPointsTitle}>🎣 Fishing Access Points:</Text>
                  {water.accessPoints.map((point, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.accessPointButton}
                      onPress={() => openGoogleMaps(point)}
                    >
                      <View style={styles.accessPointInfo}>
                        <Feather name="map-pin" size={16} color="#1B5E20" />
                        <View style={styles.accessPointText}>
                          <Text style={styles.accessPointName}>{point.name}</Text>
                          <Text style={styles.accessPointType}>{point.type}</Text>
                        </View>
                      </View>
                      <Feather name="external-link" size={14} color="#1B5E20" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// Helper function to open Google Maps for a location
const openGoogleMaps = (location) => {
  let url;
  if (location.name) {
    // For access points
    url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}&query_place_id=${encodeURIComponent(location.name)}`;
  } else {
    // For water body
    url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
  }
  
  Linking.openURL(url).catch(() => {
    const androidUrl = `geo:${location.latitude},${location.longitude}?q=${encodeURIComponent(location.name || 'Fishing Location')}`;
    Linking.openURL(androidUrl).catch(() => {
      Alert.alert('Error', 'Could not open maps application');
    });
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F1E8',
  },
  header: {
    padding: 16,
    backgroundColor: '#1B5E20',
    paddingVertical: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  waterCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  waterCardActive: {
    backgroundColor: '#F0F7F0',
    borderLeftColor: '#1B5E20',
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
    color: '#1B5E20',
  },
  waterType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  difficultyBadge: {
    backgroundColor: '#2E7D32',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  bestSeason: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  fishTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  fishList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  fishTag: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
  },
  fishTagText: {
    fontSize: 11,
    color: '#1B5E20',
    fontWeight: '600',
  },
  accessPointsSection: {
    marginVertical: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  accessPointsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },
  accessPointButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F1E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  accessPointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accessPointText: {
    marginLeft: 10,
    flex: 1,
  },
  accessPointName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B5E20',
  },
  accessPointType: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});
