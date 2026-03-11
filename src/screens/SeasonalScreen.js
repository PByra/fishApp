import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish, getSeasonColor } from '../data/seasonalData';
import { colors, spacing, shadows, typography } from '../theme/colors';

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
        <ActivityIndicator size="large" color={colors.accent.persimmon} />
      </View>
    );
  }

  const getSeasonStatusLabel = (status) => {
    if (status === 2) return 'IN SEASON';
    if (status === 1) return 'COMING SOON';
    return 'OFF SEASON';
  };

  const getSeasonStatusColor = (status) => {
    if (status === 2) return colors.status.inSeason; // Green
    if (status === 1) return colors.accent.persimmon; // Orange
    return colors.status.offSeason; // Red
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
  legendContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
    backgroundColor: colors.neutral.white,
    marginBottom: spacing.md,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  fishCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 24,
    padding: spacing.md,
    ...shadows.md,
    borderLeftWidth: 4,
    minHeight: 56,
  },
  fishCardActive: {
    backgroundColor: '#f9f8f6',
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
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyText: {
    color: colors.neutral.white,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
  },
  fishImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: spacing.md,
    backgroundColor: colors.neutral.borderLight,
  },
  gearSection: {
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  gearTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  gearList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gearTag: {
    backgroundColor: '#FFF5F2',
    borderColor: colors.accent.persimmon,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  gearTagText: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.persimmon,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    lineHeight: 20,
    fontWeight: '500',
  },
  seasonInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 75, 72, 0.05)',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    gap: spacing.md,
  },
  seasonInfoText: {
    fontSize: typography.body.fontSize,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: typography.heading.small,
    color: colors.neutral.textSecondary,
    marginTop: spacing.md,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F2',
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.persimmon,
    ...shadows.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.accent.persimmon,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
});
