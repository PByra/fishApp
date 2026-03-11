import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinLocations } from '../data/wisconsinWaters';
import { colors, spacing, shadows, typography } from '../theme/colors';
import NavigateButton from '../components/NavigateButton';
import WaterConditionCard from '../components/WaterConditionCard';

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
        <ActivityIndicator size="large" color={colors.accent.persimmon} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fishing Waters</Text>
        <Text style={styles.headerSubtitle}>13 Premium Locations • Verified Access Points</Text>
      </View>

      {wisconsinLocations.map((water) => (
        <View key={water.id} style={styles.locationCardWrapper}>
          {/* Card Header / Selector */}
          <TouchableOpacity
            style={[styles.cardSelector, selectedWater?.id === water.id && styles.cardSelectorActive]}
            onPress={() => setSelectedWater(selectedWater?.id === water.id ? null : water)}
          >
            <View style={styles.selectorLeft}>
              <View style={styles.typeIcon}>
                <Feather 
                  name={water.type === 'lake' ? 'droplet' : 'navigation'} 
                  size={20} 
                  color={colors.accent.persimmon}
                />
              </View>
              <View style={styles.selectorText}>
                <Text style={styles.waterName}>{water.name}</Text>
                <Text style={styles.waterType}>{water.type} • {water.difficulty}</Text>
              </View>
            </View>
            <Feather 
              name={selectedWater?.id === water.id ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={colors.primary.forest}
            />
          </TouchableOpacity>

          {/* Expanded Content */}
          {selectedWater?.id === water.id && (
            <View style={styles.expandedContent}>
              {/* Water Condition Card */}
              <View style={styles.waterConditionSection}>
                <WaterConditionCard 
                  waterTemp={68}
                  clarity="Clear"
                  flowRate="Normal"
                  safetyStatus="Safe"
                  bestFor={water.fish.slice(0, 3)}
                />
              </View>

              {/* Fish Species */}
              <View style={styles.fishSection}>
                <Text style={styles.sectionTitle}>🎣 Fish Species</Text>
                <View style={styles.fishGrid}>
                  {water.fish.map((fish, idx) => (
                    <View key={idx} style={styles.fishChip}>
                      <Text style={styles.fishChipText}>{fish}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Best Season */}
              <View style={styles.bestSeasonSection}>
                <Text style={styles.sectionTitle}>📅 Best Season</Text>
                <Text style={styles.bestSeasonText}>{water.bestSeason}</Text>
              </View>

              {/* Location Details */}
              {water.accessPoints && water.accessPoints.length > 0 && (
                <View style={styles.accessSection}>
                  <Text style={styles.sectionTitle}>📍 Access Point</Text>
                  {water.accessPoints.map((point, idx) => (
                    <View key={idx} style={styles.accessPoint}>
                      <View style={styles.accessPointDetails}>
                        <Text style={styles.accessPointName}>{point.name}</Text>
                        <Text style={styles.accessPointMeta}>
                          {point.type} • {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Navigate Button */}
              <View style={styles.navigateSection}>
                <NavigateButton 
                  latitude={water.accessPoints[0]?.latitude}
                  longitude={water.accessPoints[0]?.longitude}
                  locationName={water.name}
                  size="large"
                />
              </View>

              {/* Location Coordinates */}
              <View style={styles.coordsSection}>
                <Text style={styles.coordsLabel}>Coordinates</Text>
                <Text style={styles.coordsValue}>
                  {water.location.latitude.toFixed(4)}, {water.location.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          )}
        </View>
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
    backgroundColor: colors.neutral.lightGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary.forest,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  locationCardWrapper: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.neutral.white,
    ...shadows.md,
  },
  cardSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
    minHeight: 56, // Touch target minimum
  },
  cardSelectorActive: {
    backgroundColor: '#f9f8f6',
    borderBottomColor: colors.accent.persimmon,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectorText: {
    flex: 1,
  },
  waterName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },
  waterType: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  expandedContent: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
  },
  waterConditionSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  fishSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  sectionTitle: {
    fontSize: typography.heading.small,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  fishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fishChip: {
    backgroundColor: '#F0F7F4',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
  },
  fishChipText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary.darkForest,
    letterSpacing: 0.2,
  },
  bestSeasonSection: {
    backgroundColor: '#FFF5F2',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.persimmon,
  },
  bestSeasonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary.forest,
    lineHeight: 24,
  },
  accessSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  accessPoint: {
    backgroundColor: '#F9F8F6',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.persimmon,
  },
  accessPointDetails: {
    flex: 1,
  },
  accessPointName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  accessPointMeta: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  navigateSection: {
    marginBottom: spacing.lg,
  },
  coordsSection: {
    backgroundColor: '#F9F8F6',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.neutral.textSecondary,
  },
  coordsLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  coordsValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary.forest,
    fontFamily: 'monospace',
    letterSpacing: 0.1,
  },
});
