import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, shadows, typography } from '../theme/colors';

// ─── Static 7-day forecast · Milwaukee, WI ─────────────────────────────────
// Live API integration coming in v2. For now, enjoy the snark.
const FORECAST = [
  {
    label: 'Today', abbr: 'WED', date: 'Mar 11',
    high: 38, low: 30, feelsLike: 32,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 12, windDir: 'NW', humidity: 68,
    fishing: 'Fair', fishingColor: '#FF9800',
    quip: "38°F and partly cloudy. The walleye don't feel the cold. You do. That's literally the only difference between you and a walleye right now.",
  },
  {
    label: 'Thursday', abbr: 'THU', date: 'Mar 12',
    high: 42, low: 33, feelsLike: 38,
    condition: 'Mostly Sunny', emoji: '🌤️',
    wind: 8, windDir: 'W', humidity: 55,
    fishing: 'Good', fishingColor: '#4CAF50',
    quip: "Clear skies, light winds. The universe is practically begging you to go fishing. Don't be the person who lets the universe down.",
  },
  {
    label: 'Friday', abbr: 'FRI', date: 'Mar 13',
    high: 46, low: 35, feelsLike: 43,
    condition: 'Sunny', emoji: '☀️',
    wind: 6, windDir: 'SW', humidity: 52,
    fishing: 'Excellent', fishingColor: '#2E7D32',
    quip: "Prime conditions. If you're not at McKinley Pier by sunrise, I am legally required to confiscate your fishing license.",
  },
  {
    label: 'Saturday', abbr: 'SAT', date: 'Mar 14',
    high: 49, low: 37, feelsLike: 44,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 11, windDir: 'S', humidity: 60,
    fishing: 'Good', fishingColor: '#4CAF50',
    quip: "Weekend. Good fishing conditions. You have been handed a gift. Please do not spend it at Target.",
  },
  {
    label: 'Sunday', abbr: 'SUN', date: 'Mar 15',
    high: 44, low: 36, feelsLike: 38,
    condition: 'Rainy', emoji: '🌧️',
    wind: 17, windDir: 'NE', humidity: 82,
    fishing: 'Fair', fishingColor: '#FF9800',
    quip: "Rain activates fish feeding mode. It also activates your 'I'll go next weekend' mode. Fight the second one.",
  },
  {
    label: 'Monday', abbr: 'MON', date: 'Mar 16',
    high: 36, low: 28, feelsLike: 29,
    condition: 'Cloudy', emoji: '☁️',
    wind: 15, windDir: 'N', humidity: 75,
    fishing: 'Poor', fishingColor: '#F44336',
    quip: "Cold, gray, 15 mph gusts. Even the fish called in sick. Good day to reorganize your tackle box and question your life choices.",
  },
  {
    label: 'Tuesday', abbr: 'TUE', date: 'Mar 17',
    high: 40, low: 31, feelsLike: 35,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 9, windDir: 'NW', humidity: 65,
    fishing: 'Fair', fishingColor: '#FF9800',
    quip: "Conditions improving. The walleye are cautiously optimistic. Which is more emotional depth than I expected from a walleye.",
  },
];

const RATING_BARS = { Excellent: 4, Good: 3, Fair: 2, Poor: 1 };

function ActivityBars({ rating, color }) {
  const filled = RATING_BARS[rating] ?? 1;
  return (
    <View style={barStyles.row}>
      {[1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={[barStyles.bar, { backgroundColor: i <= filled ? color : 'rgba(255,255,255,0.2)' }]}
        />
      ))}
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  bar: { width: 8, height: 12, borderRadius: 3 },
});

export default function WeatherScreen() {
  const today = FORECAST[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ══ TODAY HERO ════════════════════════════════════════ */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLocation}>📍 Milwaukee, WI</Text>
            <Text style={styles.heroTemp}>
              {today.high}
              <Text style={styles.heroTempDeg}>°F</Text>
            </Text>
            <Text style={styles.heroCondition}>{today.condition}</Text>
            <Text style={styles.heroFeels}>Feels like {today.feelsLike}° · Low {today.low}°</Text>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroEmoji}>{today.emoji}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatPill}>
                <Feather name="wind" size={11} color={colors.accent.wasabi} />
                <Text style={styles.heroStatText}>{today.wind} mph {today.windDir}</Text>
              </View>
              <View style={styles.heroStatPill}>
                <Feather name="droplet" size={11} color={colors.accent.wasabi} />
                <Text style={styles.heroStatText}>{today.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fishing status row */}
        <View style={styles.fishingBar}>
          <View style={[styles.fishingDot, { backgroundColor: today.fishingColor }]} />
          <Text style={styles.fishingLabel}>
            Fishing Today:{' '}
            <Text style={[styles.fishingValue, { color: today.fishingColor }]}>
              {today.fishing}
            </Text>
          </Text>
          <ActivityBars rating={today.fishing} color={today.fishingColor} />
        </View>

        {/* Snarky AI quip */}
        <View style={styles.quipBox}>
          <Text style={styles.quipEmoji}>🤖</Text>
          <Text style={styles.quipText}>{today.quip}</Text>
        </View>
      </View>

      {/* ══ 7-DAY OUTLOOK ════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>7-DAY OUTLOOK</Text>
        </View>

        <View style={styles.forecastCard}>
          {FORECAST.map((day, i) => (
            <View
              key={i}
              style={[styles.fRow, i < FORECAST.length - 1 && styles.fDivider]}
            >
              <Text style={styles.fEmoji}>{day.emoji}</Text>

              <View style={styles.fDayCol}>
                <Text style={[styles.fAbbr, i === 0 && styles.fAbbrToday]}>
                  {i === 0 ? 'TODAY' : day.abbr}
                </Text>
                <Text style={styles.fDate}>{day.date}</Text>
              </View>

              <View style={styles.fTempCol}>
                <Text style={styles.fHigh}>{day.high}°</Text>
                <Text style={styles.fLow}>/{day.low}°</Text>
              </View>

              <View style={[
                styles.fChip,
                { backgroundColor: day.fishingColor + '22', borderColor: day.fishingColor + '66' },
              ]}>
                <Text style={[styles.fChipText, { color: day.fishingColor }]}>
                  {day.fishing}
                </Text>
              </View>

              <View style={styles.fWindCol}>
                <Feather name="wind" size={10} color={colors.neutral.textSecondary} />
                <Text style={styles.fWindText}>{day.wind}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ══ BEST WINDOWS ══════════════════════════════════════ */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>BEST FISHING WINDOWS</Text>
        </View>
        <View style={styles.windowCard}>
          {[
            { day: 'Friday', color: '#2E7D32', note: 'Sunrise–10am + 4pm–dusk. Dawn bite on walleye and perch.' },
            { day: 'Saturday', color: '#4CAF50', note: 'Morning window before the south wind picks up after noon.' },
            { day: 'Today', color: '#FF9800', note: 'Midday when temps peak. Perch and crappie most active.' },
          ].map((w, i) => (
            <View key={i} style={[styles.windowRow, i > 0 && styles.windowDivider]}>
              <View style={[styles.windowDot, { backgroundColor: w.color }]} />
              <Text style={styles.windowText}>
                <Text style={styles.windowBold}>{w.day}: </Text>{w.note}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ══ DISCLAIMER ════════════════════════════════════════ */}
      <View style={styles.noteCard}>
        <Feather name="alert-circle" size={14} color={colors.environment.riverBlue} />
        <Text style={styles.noteText}>
          Illustrative forecast for Milwaukee, WI. Check weather.gov or NOAA Marine before heading out.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDEBE4' },
  content: { paddingBottom: spacing.xl },

  // ── Hero ─────────────────────────────────────────────────
  hero: {
    backgroundColor: colors.primary.forest,
    margin: spacing.md,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroLeft: { flex: 1 },
  heroLocation: {
    fontSize: 11, fontWeight: '700',
    color: colors.accent.wasabi,
    letterSpacing: 0.5, textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  heroTemp: {
    fontSize: 68, fontWeight: '800',
    color: '#fff', lineHeight: 72, letterSpacing: -2,
  },
  heroTempDeg: { fontSize: 28, fontWeight: '600', letterSpacing: 0 },
  heroCondition: {
    fontSize: typography.body.fontSize, fontWeight: '600',
    color: colors.accent.wasabi, marginTop: spacing.xs,
  },
  heroFeels: {
    fontSize: 12, fontWeight: '500',
    color: 'rgba(168,198,159,0.8)', marginTop: 2,
  },
  heroRight: { alignItems: 'flex-end' },
  heroEmoji: { fontSize: 52, marginBottom: spacing.sm },
  heroStats: { gap: spacing.xs },
  heroStatPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(168,198,159,0.12)',
    borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 4,
  },
  heroStatText: { fontSize: 11, fontWeight: '700', color: colors.accent.wasabi },

  fishingBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10, paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md, gap: spacing.sm,
    marginBottom: spacing.md,
  },
  fishingDot: { width: 8, height: 8, borderRadius: 4 },
  fishingLabel: {
    flex: 1, fontSize: 13,
    color: 'rgba(255,255,255,0.75)', fontWeight: '500',
  },
  fishingValue: { fontWeight: '800' },

  quipBox: {
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 12, padding: spacing.md,
    alignItems: 'flex-start',
  },
  quipEmoji: { fontSize: 22 },
  quipText: {
    flex: 1, fontSize: 13, fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 19, fontStyle: 'italic',
  },

  // ── Section ──────────────────────────────────────────────
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.md,
  },
  accentBar: {
    width: 4, height: 18, borderRadius: 2,
    backgroundColor: colors.accent.persimmon,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: '800',
    color: colors.primary.forest, letterSpacing: 1,
  },

  // ── 7-day forecast card ───────────────────────────────────
  forecastCard: {
    backgroundColor: '#fff',
    borderRadius: 18, overflow: 'hidden',
    ...shadows.md,
  },
  fRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  fDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  fEmoji: { fontSize: 22, width: 30, textAlign: 'center' },
  fDayCol: { width: 50 },
  fAbbr: {
    fontSize: 11, fontWeight: '800',
    color: colors.primary.forest, letterSpacing: 0.5,
  },
  fAbbrToday: { color: colors.accent.persimmon },
  fDate: {
    fontSize: 10, fontWeight: '500',
    color: colors.neutral.textSecondary, marginTop: 1,
  },
  fTempCol: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', gap: 3,
  },
  fHigh: { fontSize: 15, fontWeight: '700', color: colors.primary.forest },
  fLow: { fontSize: 13, fontWeight: '500', color: colors.neutral.textSecondary },
  fChip: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 68, alignItems: 'center',
  },
  fChipText: { fontSize: 11, fontWeight: '700' },
  fWindCol: {
    flexDirection: 'row', alignItems: 'center',
    gap: 3, width: 34,
  },
  fWindText: {
    fontSize: 11, fontWeight: '600',
    color: colors.neutral.textSecondary,
  },

  // ── Best windows card ─────────────────────────────────────
  windowCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: spacing.md, ...shadows.sm,
    borderLeftWidth: 3, borderLeftColor: colors.accent.wasabi,
  },
  windowRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  windowDivider: {
    borderTopWidth: 1, borderTopColor: colors.neutral.borderLight,
    marginTop: spacing.sm, paddingTop: spacing.sm,
  },
  windowDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  windowText: {
    flex: 1, fontSize: 13, fontWeight: '500',
    color: colors.neutral.textSecondary, lineHeight: 18,
  },
  windowBold: { fontWeight: '700', color: colors.primary.forest },

  // ── Disclaimer ────────────────────────────────────────────
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    marginHorizontal: spacing.md, marginTop: spacing.md,
    backgroundColor: '#E3F2FD', borderRadius: 12,
    padding: spacing.md, borderLeftWidth: 3,
    borderLeftColor: colors.environment.riverBlue,
  },
  noteText: {
    flex: 1, fontSize: typography.caption.fontSize,
    color: '#01579B', fontWeight: '500', lineHeight: 17,
  },
});
