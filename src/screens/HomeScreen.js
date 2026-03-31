import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish } from '../data/seasonalData';
import * as Location from 'expo-location';
import { TODAY as TODAY_STATIC } from '../data/weatherData';
import { fetchWeather } from '../services/weatherService';
import { loadEntries } from '../services/journalStorage';
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
  const insets = useSafeAreaInsets();
  const [inSeasonFish, setInSeasonFish] = useState([]);
  const [today, setToday] = useState(TODAY_STATIC);
  const [locationName, setLocationName] = useState('Milwaukee, WI');
  const [recentCatches, setRecentCatches] = useState([]);

  useEffect(() => {
    setInSeasonFish(getCurrentInSeasonFish());
    loadEntries().then(entries => setRecentCatches(entries.slice(0, 2))).catch(() => {});
    (async () => {
      let lat = 43.0389, lng = -87.9065, name = 'Milwaukee, WI';
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
          if (geo[0]) {
            const { city, region } = geo[0];
            name = [city, region].filter(Boolean).join(', ');
          }
        }
      } catch {}
      setLocationName(name);
      fetchWeather(lat, lng).then(f => setToday(f[0])).catch(() => {});
    })();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>

      {/* ══ WEATHER HERO ══════════════════════════════════════ */}
      <View style={styles.weatherHero}>
        <View style={styles.weatherTop}>
          <View>
            <Text style={styles.locationLabel}>📍 {locationName}</Text>
            <Text style={styles.tempText}>{today.high}°F</Text>
            <Text style={styles.conditionText}>{today.condition}</Text>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherBigEmoji}>{today.emoji}</Text>
            <View style={styles.weatherPills}>
              <View style={styles.weatherPill}>
                <Feather name="wind" size={12} color={colors.accent.wasabi} />
                <Text style={styles.weatherPillText}>{today.wind} mph</Text>
              </View>
              <View style={styles.weatherPill}>
                <Feather name="droplet" size={12} color={colors.accent.wasabi} />
                <Text style={styles.weatherPillText}>{today.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.conditionBar}>
          <View style={[styles.conditionDot, { backgroundColor: today.fishingColor }]} />
          <Text style={styles.conditionBarText}>
            Fishing: <Text style={[styles.conditionBarStatus, { color: today.fishingColor }]}>{today.fishing}</Text>
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

      {/* ══ RECENT CATCHES ════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHeadRow}>
          <View style={styles.sectionHeadLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionHeadText}>RECENT CATCHES</Text>
          </View>
          <TouchableOpacity onPress={goToJournal} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>All Catches</Text>
            <Feather name="chevron-right" size={14} color={colors.accent.persimmon} />
          </TouchableOpacity>
        </View>

        {recentCatches.length > 0 ? (
          recentCatches.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.catchCard}
              onPress={goToJournal}
              activeOpacity={0.85}
            >
              <View style={styles.catchIconWrap}>
                <Text style={styles.catchEmoji}>🐟</Text>
              </View>
              <View style={styles.catchInfo}>
                <Text style={styles.catchFish}>{entry.fishSpecies}</Text>
                <Text style={styles.catchLocation} numberOfLines={1}>
                  <Feather name="map-pin" size={11} color={colors.neutral.textSecondary} /> {entry.location}
                </Text>
              </View>
              <Text style={styles.catchDate}>
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity style={styles.emptyCatchCard} onPress={goToJournal} activeOpacity={0.85}>
            <Feather name="book-open" size={20} color={colors.accent.persimmon} />
            <Text style={styles.emptyCatchText}>Log your first catch</Text>
            <Feather name="chevron-right" size={16} color={colors.accent.persimmon} />
          </TouchableOpacity>
        )}
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

  // Recent catches
  catchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  catchIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catchEmoji: { fontSize: 20 },
  catchInfo: { flex: 1 },
  catchFish: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: 2,
  },
  catchLocation: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  catchDate: {
    fontSize: 12,
    color: colors.neutral.textSecondary,
    fontWeight: '600',
  },
  emptyCatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#DDB898',
    borderStyle: 'dashed',
    ...shadows.sm,
  },
  emptyCatchText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.accent.persimmon,
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
