import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import NavigateButton from './NavigateButton';
import { colors, spacing, shadows, typography } from '../theme/colors';

/**
 * Location Card Component (Bento Box Layout)
 * - Top section: Map preview or water conditions
 * - Bottom section: Water stats + navigate button
 * - Glassmorphism background with high contrast for outdoor visibility
 */
export const LocationCard = ({ 
  location, 
  waterTemp, 
  conditions,
  mapThumbnail 
}) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: colors.neutral.white,
      marginBottom: spacing.lg,
      ...shadows.md,
    },
    mapSection: {
      height: 120,
      backgroundColor: colors.neutral.lightGray,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.borderLight,
    },
    mapImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    mapPlaceholder: {
      color: colors.neutral.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: '500',
    },
    statsSection: {
      padding: spacing.md,
      backgroundColor: colors.neutral.white,
    },
    header: {
      marginBottom: spacing.sm,
    },
    locationName: {
      fontSize: typography.heading.fontSize,
      fontWeight: '700',
      color: colors.primary.forest,
      letterSpacing: 0.5,
    },
    locationType: {
      fontSize: typography.caption.fontSize,
      color: colors.neutral.textSecondary,
      fontWeight: '500',
      marginTop: 2,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: spacing.sm,
      paddingVertical: spacing.xs,
    },
    stat: {
      flex: 1,
    },
    statLabel: {
      fontSize: typography.caption.fontSize,
      color: colors.neutral.textSecondary,
      fontWeight: '500',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    statValue: {
      fontSize: typography.body.fontSize,
      color: colors.primary.forest,
      fontWeight: '700',
    },
    button: {
      marginTop: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Map Section - 40% */}
      <View style={styles.mapSection}>
        {mapThumbnail ? (
          <Image 
            source={{ uri: mapThumbnail }} 
            style={styles.mapImage} 
          />
        ) : (
          <Text style={styles.mapPlaceholder}>📍 {location.location}</Text>
        )}
      </View>

      {/* Stats Section - 60% */}
      <View style={styles.statsSection}>
        <View style={styles.header}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationType}>
            {location.type} • {location.difficulty}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>🌡️ Temp</Text>
            <Text style={styles.statValue}>{waterTemp || '—'}°F</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>🌊 Condition</Text>
            <Text style={styles.statValue}>{conditions || '—'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>🎣 Fish</Text>
            <Text style={styles.statValue}>{location.fish?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.button}>
          <NavigateButton 
            latitude={location.accessPoints[0]?.latitude}
            longitude={location.accessPoints[0]?.longitude}
            locationName={location.name}
            size="large"
          />
        </View>
      </View>
    </View>
  );
};

export default LocationCard;
