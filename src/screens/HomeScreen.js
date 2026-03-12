import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish } from '../data/seasonalData';
import { TODAY as TODAY_STATIC } from '../data/weatherData';
import { fetchMilwaukeeWeather } from '../services/weatherService';
import { colors, spacing, shadows, typography } from '../theme/colors';

const GEAR_EMOJI = (gear) => {
  if (/rod|reel/i.test(gear)) return '🎣';
  if (/line|hook/i.test(gear)) return '📏';
  if (/bait|minnow|shiner|liver|egg/i.test(gear)) return '🪱';
  if (/worm|plastic|soft/i.test(gear)) return '🪝';
  if (/spoon|spinner|crankbait|lure|bucktail/i.test(gear)) return '✨';
  if (/net/i.test(gear)) return '🥅';
  if (/downrigger|trolling/i.test(gear)) return '⚓';
  return '📦';
};

export default function HomeScreen({ navigation }) {
  const [inSeasonFish, setInSeasonFish] = useState([]);
  const [today, setToday] = useState(TODAY_STATIC);

  useEffect(() => {
    setInSeasonFish(getCurrentInSeasonFish());
    fetchMilwaukeeWeather()
      .then(f => setToday(f[0]))
      .catch(() => {}); // silently keep static fallback on failure
  }, []);

  const topInSeason = useMemo(
    () => inSeasonFish.filter(f => f.seasonStatus === 2).slice(0, 3),
    [inSeasonFish],
  );

  const goToSeasonalFish = useCallback(
    (fishName) => navigation.navigate('Seasonal', { openFish: fishName }),
    [navigation],
  );
  const goToSearch = useCallback(() => navigation.navigate('Search'), [navigation]);
  const goToJournal = useCallback(() => navigation.navigate('Journal'), [navigation]);
  const goToSupplies = useCallback(() => navigation.navigate('Supplies'), [navigation]);
  const goToWeather = useCallback(() => navigation.navigate('Weather'), [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

      {/* ══ WEATHER HERO ══════════════════════════════════════ */}
      <View style={styles.weatherHero}>
        <View style={styles.weatherTop}>
          <View>
            <Text style={styles.locationLabel}>📍 Milwaukee, WI</Text>
            <Text style={styles.tempText}>{TODAY.high}°F</Text>
            <Text style={styles.conditionText}>{TODAY.condition}</Text>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherBigEmoji}>{TODAY.emoji}</Text>
            <View style={styles.weatherPills}>
              <View style={styles.weatherPill}>
                <Feather name="wind" size={12} color={colors.accent.wasabi} />
                <Text style={styles.weatherPillText}>{TODAY.wind} mph</Text>
              </View>
              <View style={styles.weatherPill}>
                <Feather name="droplet" size={12} color={colors.accent.wasabi} />
                <Text style={styles.weatherPillText}>{TODAY.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.conditionBar}>
          <View style={[styles.conditionDot, { backgroundColor: TODAY.fishingColor }]} />
          <Text style={styles.conditionBarText}>
            Fishing: <Text style={[styles.conditionBarStatus, { color: TODAY.fishingColor }]}>{TODAY.fishing}</Text>
          </Text>
          <TouchableOpacity onPress={goToWeather} style={styles.forecastBtn}>
            <Text style={styles.forecastBtnText}>Full Forecast</Text>
            <Feather name="chevron-right" size={13} color={colors.accent.wasabi} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ══ IN SEASON NOW ═════════════════════════════════════ */}
      {topInSeason.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeadRow}>
            <View style={styles.sectionHeadLeft}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionHeadText}>IN SEASON NOW</Text>
            </View>
            <TouchableOpacity onPress={() => goToSeasonalFish()} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>All Fish</Text>
              <Feather name="chevron-right" size={14} color={colors.accent.persimmon} />
            </TouchableOpacity>
          </View>

          {topInSeason.map((fish, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.fishCard}
              onPress={() => goToSeasonalFish(fish.fish)}
              activeOpacity={0.85}
            >
              {/* Status stripe */}
              <View style={[styles.fishStripe, { backgroundColor: fish.colorStatus }]} />

              <View style={styles.fishCardInner}>
                <View style={styles.fishCardTop}>
                  <View style={styles.fishCardLeft}>
                    <Text style={styles.fishCardName}>{fish.fish}</Text>
                    <Text style={styles.fishCardMeta}>{fish.depth} · {fish.avgSize} avg</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.whereBtn}
                    onPress={(e) => { e.stopPropagation?.(); goToSearch(); }}
                  >
                    <Feather name="map-pin" size={12} color={colors.accent.persimmon} />
                    <Text style={styles.whereBtnText}>Where to catch</Text>
                  </TouchableOpacity>
                </View>

                {fish.recommendedGear?.length > 0 && (
                  <View style={styles.gearRow}>
                    {fish.recommendedGear.slice(0, 4).map((gear, gi) => (
                      <View key={gi} style={styles.gearPill}>
                        <Text style={styles.gearPillEmoji}>{GEAR_EMOJI(gear)}</Text>
                        <Text style={styles.gearPillText}>{gear}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ══ DASHBOARD GRID ════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHeadRow}>
          <View style={styles.sectionHeadLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionHeadText}>QUICK ACCESS</Text>
          </View>
        </View>

        <View style={styles.dashGrid}>
          <TouchableOpacity style={[styles.dashCard, styles.dashCardLarge, { backgroundColor: colors.primary.forest }]}
            onPress={goToSearch}>
            <Feather name="search" size={28} color={colors.accent.wasabi} />
            <Text style={[styles.dashLabel, { color: '#fff' }]}>Search & Fish</Text>
            <Text style={[styles.dashSub, { color: colors.accent.wasabi }]}>Find your spot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dashCard, { backgroundColor: '#F7EDDE', borderColor: colors.accent.persimmon }]}
            onPress={goToJournal}>
            <Feather name="book-open" size={24} color={colors.accent.persimmon} />
            <Text style={[styles.dashLabel, { color: colors.accent.persimmon }]}>Journal</Text>
            <Text style={styles.dashSub}>Log catches</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dashCard, { backgroundColor: '#E8EFE4', borderColor: colors.accent.wasabi }]}
            onPress={goToSupplies}>
            <Feather name="shopping-cart" size={24} color={colors.primary.forest} />
            <Text style={[styles.dashLabel, { color: colors.primary.forest }]}>WI Gear</Text>
            <Text style={styles.dashSub}>Local brands</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dashCard, { backgroundColor: '#E4EEF7', borderColor: colors.environment.riverBlue }]}
            onPress={goToWeather}>
            <Feather name="cloud" size={24} color={colors.environment.riverBlue} />
            <Text style={[styles.dashLabel, { color: colors.environment.riverBlue }]}>Forecast</Text>
            <Text style={styles.dashSub}>7-day outlook</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ══ REMINDERS ═════════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.reminderCard}>
          <View style={[styles.reminderIcon, { backgroundColor: '#E4EEF7' }]}>
            <Feather name="alert-circle" size={18} color={colors.environment.riverBlue} />
          </View>
          <Text style={styles.reminderText}>Wisconsin fishing license required for all anglers 16+</Text>
        </View>
        <TouchableOpacity
          style={styles.reminderCard}
          onPress={() => Linking.openURL('https://dnr.wisconsin.gov/topic/fishing/regulations')}
          activeOpacity={0.8}
        >
          <View style={[styles.reminderIcon, { backgroundColor: '#F7EDDE' }]}>
            <Feather name="external-link" size={18} color={colors.accent.persimmon} />
          </View>
          <Text style={styles.reminderText}>WI Fishing Regulations — tap to open DNR site</Text>
        </TouchableOpacity>
        <View style={styles.reminderCard}>
          <View style={[styles.reminderIcon, { backgroundColor: '#EEF2EA' }]}>
            <Text style={{ fontSize: 18 }}>🎣</Text>
          </View>
          <Text style={styles.reminderText}>State fish: Muskellunge (Musky) — designated 1955</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E0CC' },
  content: { paddingBottom: spacing.xl },

  // Weather Hero
  weatherHero: {
    backgroundColor: colors.primary.forest,
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent.wasabi,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  tempText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 60,
    letterSpacing: -1,
  },
  conditionText: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  weatherRight: { alignItems: 'flex-end' },
  weatherBigEmoji: { fontSize: 48, marginBottom: spacing.sm },
  weatherPills: { gap: spacing.xs },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(168,198,159,0.15)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  weatherPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent.wasabi,
  },
  conditionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.inSeason,
  },
  conditionBarText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  conditionBarStatus: { fontWeight: '700', color: '#fff' },
  forecastBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  forecastBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent.wasabi,
  },

  // Section header
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionAccentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.accent.persimmon,
  },
  sectionHeadText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary.forest,
    letterSpacing: 1,
  },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent.persimmon,
  },

  // Fish cards
  fishCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  fishStripe: { width: 5 },
  fishCardInner: { flex: 1, padding: spacing.md },
  fishCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  fishCardLeft: { flex: 1 },
  fishCardName: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: 2,
  },
  fishCardMeta: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  whereBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9EDE4',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#DDB898',
  },
  whereBtnText: {
    fontSize: 11,
    color: colors.accent.persimmon,
    fontWeight: '700',
  },
  gearRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  gearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2EA',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#C8D8C0',
  },
  gearPillEmoji: { fontSize: 12 },
  gearPillText: {
    fontSize: 11,
    color: colors.primary.forest,
    fontWeight: '600',
  },

  // Dashboard grid
  dashGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dashCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 100,
    justifyContent: 'center',
    ...shadows.sm,
  },
  dashCardLarge: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 72,
    justifyContent: 'flex-start',
  },
  dashLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
  },
  dashSub: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },

  // Reminders
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF6',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    lineHeight: 16,
  },
});
