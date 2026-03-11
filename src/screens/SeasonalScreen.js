import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish } from '../data/seasonalData';
import { colors, spacing, shadows, typography } from '../theme/colors';

const STATUS = {
  2: { label: 'IN SEASON',   bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50', border: '#A5D6A7' },
  1: { label: 'COMING SOON', bg: '#FFF3E0', text: '#E65100', dot: '#FF9800', border: '#FFCC80' },
  0: { label: 'OFF SEASON',  bg: '#FAFAFA', text: '#9E9E9E', dot: '#BDBDBD', border: '#E0E0E0' },
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function SeasonalScreen({ route }) {
  const [fish, setFish] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => { setFish(getCurrentInSeasonFish()); }, []);

  useEffect(() => {
    const openFish = route?.params?.openFish;
    if (!openFish || fish.length === 0) return;
    setFilter('all');
    setExpanded(openFish);
    // Scroll to the card after a short delay to let layout settle
    setTimeout(() => {
      const ref = cardRefs.current[openFish];
      if (ref && scrollRef.current) {
        ref.measureLayout(
          scrollRef.current.getInnerViewNode?.() ?? scrollRef.current,
          (x, y) => { scrollRef.current.scrollTo({ y: y - 16, animated: true }); },
          () => {}
        );
      }
    }, 350);
  }, [route?.params?.openFish, fish]);

  const inSeasonCount = fish.filter(f => f.seasonStatus === 2).length;
  const upcomingCount = fish.filter(f => f.seasonStatus === 1).length;

  const displayed = fish.filter(f => {
    if (filter === 'inseason') return f.seasonStatus === 2;
    if (filter === 'upcoming') return f.seasonStatus === 1;
    return true;
  });

  return (
    <View style={styles.container}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fish Seasons</Text>
        <Text style={styles.headerSub}>Tap any fish for gear, tips & field ID photo</Text>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statText}>{inSeasonCount} in season</Text>
          </View>
          <View style={styles.statPill}>
            <View style={[styles.statDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.statText}>{upcomingCount} upcoming</Text>
          </View>
          <View style={styles.statPill}>
            <View style={[styles.statDot, { backgroundColor: '#BDBDBD' }]} />
            <Text style={styles.statText}>{fish.length - inSeasonCount - upcomingCount} off</Text>
          </View>
        </View>
      </View>

      {/* ── FILTER TABS ─────────────────────────────────────── */}
      <View style={styles.filterRow}>
        {[
          { key: 'all',      label: 'All Fish' },
          { key: 'inseason', label: '🟢 In Season' },
          { key: 'upcoming', label: '🟠 Upcoming' },
        ].map(({ key, label }) => (
          <TouchableOpacity key={key}
            style={[styles.filterTab, filter === key && styles.filterTabActive]}
            onPress={() => setFilter(key)}>
            <Text style={[styles.filterTabText, filter === key && styles.filterTabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── LIST ────────────────────────────────────────────── */}
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {displayed.map((item, idx) => {
          const s = STATUS[item.seasonStatus];
          const open = expanded === item.fish;
          return (
            <TouchableOpacity key={item.fish}
              ref={el => { cardRefs.current[item.fish] = el; }}
              style={[styles.fishCard, { borderColor: s.border }, open && styles.fishCardOpen]}
              onPress={() => setExpanded(open ? null : item.fish)}
              activeOpacity={0.85}>

              {/* Card header row */}
              <View style={styles.cardHead}>
                <View style={[styles.statusStripe, { backgroundColor: s.dot }]} />
                <View style={styles.cardHeadContent}>
                  <View style={styles.cardTop}>
                    <Text style={styles.fishName}>{item.fish}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg, borderColor: s.border }]}>
                      <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
                      <Text style={[styles.statusLabel, { color: s.text }]}>{s.label}</Text>
                    </View>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaChip}>📏 {item.depth}</Text>
                    <Text style={styles.metaChip}>⚖️ {item.avgSize}</Text>
                    <View style={[styles.diffChip, { backgroundColor: s.bg, borderColor: s.border }]}>
                      <Text style={[styles.diffText, { color: s.text }]}>{item.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.neutral.gray400} />
              </View>

              {/* Expanded */}
              {open && (
                <View style={styles.expanded}>

                  {/* Field ID photo */}
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.fishPhoto} resizeMode="cover" />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>🐟  No photo available</Text>
                    </View>
                  )}
                  <Text style={styles.photoCaption}>Field identification photo</Text>

                  {/* Month calendar strip */}
                  <View style={styles.monthsRow}>
                    {MONTHS.map((m, i) => {
                      const active = item.seasonMonths.includes(i + 1);
                      const peak   = item.peakMonths.includes(i + 1);
                      return (
                        <View key={i} style={[
                          styles.monthCell,
                          active && styles.monthCellActive,
                          peak   && styles.monthCellPeak,
                        ]}>
                          <Text style={[styles.monthText, active && styles.monthTextActive, peak && styles.monthTextPeak]}>
                            {m}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <Text style={styles.monthLegend}>
                    <Text style={{ color: '#4CAF50' }}>■</Text>{'  In season  '}
                    <Text style={{ color: colors.accent.persimmon }}>■</Text>{'  Peak'}
                  </Text>

                  {/* Stats grid */}
                  <View style={styles.detailGrid}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>RECORD SIZE</Text>
                      <Text style={styles.detailValue}>{item.recordSize}</Text>
                    </View>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailLabel}>DEPTH</Text>
                      <Text style={styles.detailValue}>{item.depth}</Text>
                    </View>
                  </View>

                  {/* Gear */}
                  {item.recommendedGear?.length > 0 && (
                    <View style={styles.gearBox}>
                      <Text style={styles.gearBoxTitle}>🎣 Recommended Gear</Text>
                      <View style={styles.gearWrap}>
                        {item.recommendedGear.map((g, i) => (
                          <View key={i} style={styles.gearTag}>
                            <Text style={styles.gearTagText}>{g}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Tips */}
                  <View style={styles.tipsBox}>
                    <Feather name="zap" size={14} color={colors.accent.persimmon} />
                    <Text style={styles.tipsText}>{item.tips}</Text>
                  </View>

                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.dnrBox}>
          <Feather name="alert-circle" size={16} color={colors.accent.persimmon} />
          <Text style={styles.dnrText}>
            Always verify current regulations and bag limits with the Wisconsin DNR before fishing.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDEBE4' },

  header: {
    backgroundColor: colors.primary.forest,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: spacing.md,
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statDot: { width: 7, height: 7, borderRadius: 4 },
  statText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },

  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F0EDE6',
  },
  filterTabActive: { backgroundColor: colors.primary.forest },
  filterTabText: { fontSize: 12, fontWeight: '700', color: colors.neutral.textSecondary },
  filterTabTextActive: { color: '#fff' },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },

  fishCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...shadows.sm,
  },
  fishCardOpen: { ...shadows.md },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  statusStripe: { width: 5, height: 44, borderRadius: 3 },
  cardHeadContent: { flex: 1 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  fishName: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '800',
    color: colors.primary.forest,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  metaChip: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral.textSecondary,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  diffChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  diffText: { fontSize: 11, fontWeight: '700' },

  expanded: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
    gap: spacing.md,
  },

  fishPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  photoPlaceholder: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: typography.body.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  photoCaption: {
    fontSize: 11,
    color: colors.neutral.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -spacing.sm,
  },

  monthsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  monthCell: {
    flex: 1,
    marginHorizontal: 1,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#F0EDE6',
  },
  monthCellActive: { backgroundColor: '#C8E6C9' },
  monthCellPeak:   { backgroundColor: colors.accent.persimmon },
  monthText: { fontSize: 8, fontWeight: '700', color: '#9E9E9E' },
  monthTextActive: { color: '#2E7D32' },
  monthTextPeak:   { color: '#fff' },
  monthLegend: {
    fontSize: 10,
    color: colors.neutral.textSecondary,
    fontWeight: '600',
    marginTop: -spacing.xs,
  },

  detailGrid: { flexDirection: 'row', gap: spacing.md },
  detailBox: {
    flex: 1,
    backgroundColor: '#F5F8F5',
    borderRadius: 10,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.neutral.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
  },

  gearBox: {
    backgroundColor: '#FFF5F2',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.persimmon,
  },
  gearBoxTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.sm,
  },
  gearWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  gearTag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFCCBC',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  gearTagText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.accent.persimmon,
  },

  tipsBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#F5F8F5',
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
  },
  tipsText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    fontWeight: '500',
    lineHeight: 21,
  },

  dnrBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#FFF5F2',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.persimmon,
  },
  dnrText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    lineHeight: 17,
  },
});
