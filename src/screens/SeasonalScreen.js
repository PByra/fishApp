import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish, getSeasonColor } from '../data/seasonalData';

export default function SeasonalScreen() {
  const [inSeasonFish, setInSeasonFish] = useState([]);
  const [expandedFish, setExpandedFish] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get all fish with season status
    const allFish = getCurrentInSeasonFish();
    setInSeasonFish(allFish);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  const getSeasonStatusLabel = (status) => {
    if (status === 2) return 'IN SEASON';
    if (status === 1) return 'COMING SOON';
    return 'OFF SEASON';
  };

  const getSeasonStatusColor = (status) => {
    if (status === 2) return '#2E7D32'; // Green
    if (status === 1) return '#E65100'; // Orange
    return '#C62828'; // Red
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fish Seasons</Text>
        <Text style={styles.headerSubtitle}>Check what's biting now</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
          <Text style={styles.legendText}>In Season</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E65100' }]} />
          <Text style={styles.legendText}>Coming Soon</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#C62828' }]} />
          <Text style={styles.legendText}>Off Season</Text>
        </View>
      </View>

      {inSeasonFish.length > 0 ? (
        inSeasonFish.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.fishCard,
              expandedFish === idx && styles.fishCardActive,
              { borderLeftColor: item.colorStatus }
            ]}
            onPress={() => setExpandedFish(expandedFish === idx ? null : idx)}
          >
            <View style={styles.fishHeader}>
              <View style={styles.fishNameContainer}>
                <Text style={styles.fishName}>{item.fish}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: item.colorStatus }]} />
                  <Text style={[styles.statusLabel, { color: item.colorStatus }]}>
                    {getSeasonStatusLabel(item.seasonStatus)}
                  </Text>
                </View>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: item.colorStatus }]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>

            {expandedFish === idx && (
              <View style={styles.expandedContent}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.fishImage}
                    onError={() => console.log('Image failed to load')}
                  />
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Peak Months:</Text>
                  <Text style={styles.value}>{item.peakMonths.map(m => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return months[m - 1];
                  }).join(', ')}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Depth Range:</Text>
                  <Text style={styles.value}>{item.depth}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Average Size:</Text>
                  <Text style={styles.value}>{item.avgSize}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Record Size:</Text>
                  <Text style={styles.value}>{item.recordSize}</Text>
                </View>

                {item.recommendedGear && item.recommendedGear.length > 0 && (
                  <View style={styles.gearSection}>
                    <Text style={styles.gearTitle}>🎣 Recommended Gear:</Text>
                    <View style={styles.gearList}>
                      {item.recommendedGear.map((gear, gIdx) => (
                        <View key={gIdx} style={styles.gearTag}>
                          <Text style={styles.gearTagText}>{gear}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tips:</Text>
                  <Text style={styles.value}>{item.tips}</Text>
                </View>

                <View style={[styles.seasonInfo, { borderLeftColor: item.colorStatus }]}>
                  <Feather name="info" size={16} color={item.colorStatus} />
                  <Text style={[styles.seasonInfoText, { color: item.colorStatus }]}>
                    {item.seasonStatus === 2 && `${item.fish} is in season! Great time to fish!`}
                    {item.seasonStatus === 1 && `${item.fish} season is coming soon!`}
                    {item.seasonStatus === 0 && `${item.fish} is currently out of season.`}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No fish data available</Text>
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
  legendContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  fishCard: {
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
  },
  fishCardActive: {
    backgroundColor: '#F0F7F0',
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
    color: '#1B5E20',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
    borderTopColor: '#E8F5E9',
  },
  fishImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
  },
  gearSection: {
    marginVertical: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  gearTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  gearList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gearTag: {
    backgroundColor: '#fff3e0',
    borderColor: '#E65100',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  gearTagText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '600',
  },
  detailRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  seasonInfo: {
    flexDirection: 'row',
    backgroundColor: '#F0F7F0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    gap: 8,
  },
  seasonInfoText: {
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
    lineHeight: 16,
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
    borderLeftColor: '#E65100',
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
