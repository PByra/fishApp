import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, shadows, typography } from '../theme/colors';

/**
 * Water Condition Card Component (Glassmorphism)
 * - Frosted glass effect overlay
 * - Real-time water metrics (temp, clarity, flow, safety)
 * - High contrast for outdoor visibility
 */
export const WaterConditionCard = ({ 
  waterTemp,
  clarity,
  flowRate,
  safetyStatus = 'Safe',
  bestFor = [] 
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 20,
      padding: spacing.md,
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      ...shadows.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(59, 75, 72, 0.1)',
    },
    title: {
      fontSize: typography.heading.fontSize,
      fontWeight: '700',
      color: colors.primary.forest,
      letterSpacing: 0.5,
    },
    safetyBadge: {
      backgroundColor: colors.status.inSeason,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    safetyText: {
      fontSize: typography.caption.fontSize,
      fontWeight: '600',
      color: colors.neutral.white,
      letterSpacing: 0.3,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    metric: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: 'rgba(168, 198, 159, 0.1)',
      borderRadius: 12,
      padding: spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent.wasabi,
    },
    metricLabel: {
      fontSize: typography.caption.fontSize,
      color: colors.neutral.textSecondary,
      fontWeight: '600',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    metricValue: {
      fontSize: typography.body.fontSize,
      fontWeight: '700',
      color: colors.primary.forest,
    },
    bestForSection: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(59, 75, 72, 0.1)',
    },
    bestForLabel: {
      fontSize: typography.caption.fontSize,
      color: colors.neutral.textSecondary,
      fontWeight: '600',
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    bestForContent: {
      fontSize: typography.body.fontSize,
      color: colors.primary.forest,
      fontWeight: '500',
      lineHeight: 20,
    },
  });

  const getSafetyColor = (status) => {
    switch (status) {
      case 'Safe':
        return colors.status.inSeason; // Green
      case 'Caution':
        return colors.accent.persimmon; // Orange
      case 'Danger':
        return colors.status.offSeason; // Red
      default:
        return colors.neutral.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: getSafetyColor(safetyStatus) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Water Conditions</Text>
        <View style={[styles.safetyBadge, { backgroundColor: getSafetyColor(safetyStatus) }]}>
          <Text style={styles.safetyText}>{safetyStatus}</Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>🌡️ Temperature</Text>
          <Text style={styles.metricValue}>{waterTemp || '—'}°F</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>💧 Clarity</Text>
          <Text style={styles.metricValue}>{clarity || 'Good'}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>🌊 Flow</Text>
          <Text style={styles.metricValue}>{flowRate || 'Normal'}</Text>
        </View>
      </View>

      {/* Best For */}
      {bestFor && bestFor.length > 0 && (
        <View style={styles.bestForSection}>
          <Text style={styles.bestForLabel}>🎣 Best For Right Now</Text>
          <Text style={styles.bestForContent}>
            {bestFor.join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default WaterConditionCard;
