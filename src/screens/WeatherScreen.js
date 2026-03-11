import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, shadows, typography } from '../theme/colors';

export default function WeatherScreen() {
  // Mock weather data - no API calls, no async, no crashes
  const todayWeather = {
    location: 'Milwaukee, WI',
    temperature: 58,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NW',
    humidity: 65,
    fishingCondition: 'Good',
    emoji: '⛅'
  };

  const forecast = [
    { day: 'Tomorrow', high: 62, low: 48, condition: 'Sunny', windSpeed: 8, emoji: '☀️', rating: '⭐⭐⭐⭐' },
    { day: 'Wednesday', high: 65, low: 50, condition: 'Cloudy', windSpeed: 10, emoji: '☁️', rating: '⭐⭐⭐⭐⭐' },
    { day: 'Thursday', high: 58, low: 45, condition: 'Rainy', windSpeed: 15, emoji: '🌧️', rating: '⭐⭐⭐' },
  ];

  const getFishingColor = (condition) => {
    switch (condition) {
      case 'Good': return colors.status.inSeason;
      case 'Excellent': return colors.primary.forest;
      case 'Fair': return colors.accent.persimmon;
      default: return colors.primary.darkForest;
    }
  };

  return (
    <View style={styles.container}>
      {/* Today's Weather - Large */}
      <View style={styles.todayContainer}>
        <View style={styles.todayTop}>
          <Text style={styles.emoji}>{todayWeather.emoji}</Text>
          <View style={styles.todayInfo}>
            <Text style={styles.condition}>{todayWeather.condition}</Text>
            <Text style={styles.location}>{todayWeather.location}</Text>
          </View>
        </View>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>{todayWeather.temperature}°F</Text>
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Feather name="wind" size={18} color="#1B5E20" />
              <Text style={styles.detailText}>{todayWeather.windSpeed} mph</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="droplets" size={18} color="#1B5E20" />
              <Text style={styles.detailText}>{todayWeather.humidity}%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.fishingBadge, { backgroundColor: getFishingColor(todayWeather.fishingCondition) }]}>
          <Text style={styles.fishingEmoji}>🎣</Text>
          <View style={styles.fishingBadgeText}>
            <Text style={styles.fishingLabel}>Fishing: {todayWeather.fishingCondition}</Text>
          </View>
        </View>
      </View>

      {/* Next 3 Days - Compact */}
      <View style={styles.forecastRibbon}>
        {forecast.map((day, idx) => (
          <View key={idx} style={styles.dayCard}>
            <Text style={styles.dayEmoji}>{day.emoji}</Text>
            <Text style={styles.dayName}>{day.day}</Text>
            <Text style={styles.dayTemp}>{day.high}°/{day.low}°</Text>
            <Text style={styles.dayWind}>💨 {day.windSpeed}mph</Text>
            <Text style={styles.dayRating}>{day.rating}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
    paddingVertical: spacing.lg,
  },
  todayContainer: {
    backgroundColor: colors.primary.forest,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.lg,
  },
  todayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 56,
    marginRight: spacing.md,
  },
  todayInfo: {
    flex: 1,
  },
  condition: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  location: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  temperatureSection: {
    marginBottom: spacing.lg,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.3,
  },
  weatherDetails: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '600',
  },
  fishingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
    minHeight: 44,
  },
  fishingEmoji: {
    fontSize: 20,
  },
  fishingBadgeText: {
    justifyContent: 'center',
  },
  fishingLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.2,
  },
  forecastRibbon: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dayCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
    minHeight: 140,
    justifyContent: 'center',
  },
  dayEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  dayName: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  dayTemp: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.xs,
  },
  dayWind: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  dayRating: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.accent.persimmon,
  },
});
