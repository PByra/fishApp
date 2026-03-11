import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish } from '../data/seasonalData';
import { colors, spacing, shadows, typography } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [inSeasonFish, setInSeasonFish] = useState([]);

  useEffect(() => {
    const allFish = getCurrentInSeasonFish();
    setInSeasonFish(allFish);
  }, []);

  // Mock weather for Milwaukee
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

  // Get in-season fish (up to 3 for gear display)
  const topInSeasonFish = inSeasonFish.filter(f => f.seasonStatus === 2).slice(0, 3);
  
  // Collect unique gear from in-season fish
  const allGear = new Set();
  inSeasonFish.forEach(fish => {
    if (fish.seasonStatus === 2 && fish.recommendedGear) {
      fish.recommendedGear.forEach(gear => allGear.add(gear));
    }
  });
  const gearList = Array.from(allGear).slice(0, 6);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* TODAY'S WEATHER SECTION */}
      <View style={styles.weatherContainer}>
        <View style={styles.weatherTop}>
          <Text style={styles.sectionLabel}>TODAY'S WEATHER</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Weather')}>
            <Text style={styles.seeMore}>View Forecast →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <Text style={styles.tempDisplay}>{todayWeather.temperature}°</Text>
            <Text style={styles.condition}>{todayWeather.condition}</Text>
            <Text style={styles.location}>{todayWeather.location}</Text>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherEmoji}>{todayWeather.emoji}</Text>
            <View style={styles.weatherDetails}>
              <Text style={styles.detail}>💨 {todayWeather.windSpeed} mph</Text>
              <Text style={styles.detail}>💧 {todayWeather.humidity}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.fishingConditionBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.conditionText}>Fishing: <Text style={{ fontWeight: 'bold' }}>{todayWeather.fishingCondition}</Text></Text>
        </View>
      </View>

      {/* IN-SEASON FISH SECTION */}
      {topInSeasonFish.length > 0 && (
        <View style={styles.inSeasonContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>🎣 IN SEASON NOW</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Seasonal')}>
              <Text style={styles.seeMore}>See All →</Text>
            </TouchableOpacity>
          </View>

          {topInSeasonFish.map((fish, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.fishCard}
              onPress={() => navigation.navigate('Seasonal')}
            >
              <View style={styles.fishCardContent}>
                <View style={styles.fishNameSection}>
                  <Text style={styles.fishName}>{fish.fish}</Text>
                  <Text style={styles.fishSize}>{fish.avgSize} avg</Text>
                </View>
                <View style={styles.fishRightSection}>
                  <Text style={styles.depthLabel}>Depth</Text>
                  <Text style={styles.depth}>{fish.depth}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* RECOMMENDED GEAR SECTION */}
      {gearList.length > 0 && (
        <View style={styles.gearContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>🎽 BRING THIS GEAR</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Supplies')}>
              <Text style={styles.seeMore}>Shop Gear →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gearGrid}>
            {gearList.map((gear, idx) => (
              <View key={idx} style={styles.gearItem}>
                <View style={styles.gearIcon}>
                  <Text style={styles.gearEmoji}>
                    {gear.includes('Rod') || gear.includes('Reel') ? '🎣' :
                     gear.includes('Line') || gear.includes('Hook') ? '📏' :
                     gear.includes('Bait') || gear.includes('Plastic') ? '🪝' :
                     gear.includes('Spoon') || gear.includes('Spinner') ? '✨' :
                     gear.includes('Net') ? '🥅' : '📦'}
                  </Text>
                </View>
                <Text style={styles.gearName}>{gear}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* QUICK LINKS SECTION */}
      <View style={styles.quickLinksContainer}>
        <Text style={styles.sectionLabel}>EXPLORE</Text>
        
        <View style={styles.linkGrid}>
          <TouchableOpacity 
            style={[styles.linkCard, { borderLeftColor: colors.accent.wasabi }]}
            onPress={() => navigation.navigate('Map')}
          >
            <Feather name="map" size={28} color={colors.accent.wasabi} />
            <Text style={styles.linkLabel}>Fishing Waters</Text>
            <Text style={styles.linkSub}>13 locations</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkCard, { borderLeftColor: colors.accent.persimmon }]}
            onPress={() => navigation.navigate('Supplies')}
          >
            <Feather name="shopping-cart" size={28} color={colors.accent.persimmon} />
            <Text style={styles.linkLabel}>Local Suppliers</Text>
            <Text style={styles.linkSub}>Wisconsin brands</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* INFO BOXES */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Feather name="alert-circle" size={18} color="#01579B" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>License Required</Text>
            <Text style={styles.infoDesc}>Wisconsin fishing license required for all anglers</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={18} color="#E65100" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Check Regulations</Text>
            <Text style={styles.infoDesc}>Season dates and bag limits vary by species</Text>
          </View>
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

  // ============ TODAY'S WEATHER ============
  weatherContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  seeMore: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  weatherCard: {
    backgroundColor: colors.primary.forest,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  weatherLeft: {
    flex: 1,
  },
  tempDisplay: {
    fontSize: 52,
    fontWeight: '700',
    color: colors.neutral.white,
    lineHeight: 60,
  },
  condition: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  location: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  weatherRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  weatherEmoji: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  weatherDetails: {
    gap: spacing.xs,
  },
  detail: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '600',
  },
  fishingConditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 198, 159, 0.15)',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status.inSeason,
  },
  conditionText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    fontWeight: '500',
  },

  // ============ IN-SEASON FISH ============
  inSeasonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fishCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.wasabi,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    minHeight: 56,
    justifyContent: 'center',
  },
  fishCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fishNameSection: {
    flex: 1,
  },
  fishName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },
  fishSize: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  fishRightSection: {
    alignItems: 'flex-end',
  },
  depthLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  depth: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
  },

  // ============ RECOMMENDED GEAR ============
  gearContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  gearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gearItem: {
    width: '30%',
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  gearIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 198, 159, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
  },
  gearEmoji: {
    fontSize: 24,
  },
  gearName: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // ============ QUICK LINKS ============
  quickLinksContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  linkGrid: {
    gap: spacing.md,
  },
  linkCard: {
    backgroundColor: colors.neutral.white,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
    minHeight: 56,
  },
  linkLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },
  linkSub: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },

  // ============ INFO BOXES ============
  infoSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  infoBox: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  infoDesc: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
});
