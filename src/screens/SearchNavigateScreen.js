import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { bodiesOfWater, getWatersByRegion, searchSpots } from '../data/wisconsinWaters';
import { launchNavigation } from '../services/navigationService';
import { colors, spacing, shadows, typography } from '../theme/colors';

const REGIONS = ['Milwaukee', 'Mauston'];

const DIFF = {
  Easy:         { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  Intermediate: { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  Hard:         { bg: '#FFEBEE', text: '#B71C1C', border: '#EF9A9A' },
};

const TYPE_COLORS = {
  'Great Lake':            { bg: '#1B3A52', label: '#7EC8E3' },
  'River':                 { bg: '#2A3A28', label: '#A8C69F' },
  'Reservoir & River':     { bg: '#2A3A28', label: '#A8C69F' },
  'State Park Lakes':      { bg: '#3B3020', label: '#FFCC80' },
  'State Park – Lake Michigan & Quarry': { bg: '#1B3A52', label: '#7EC8E3' },
};

const typeStyle = (type) => TYPE_COLORS[type] || { bg: colors.primary.forest, label: colors.accent.wasabi };

export default function SearchNavigateScreen() {
  const [selectedRegion, setSelectedRegion] = useState('Milwaukee');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWater, setExpandedWater] = useState(null);

  const displayedWaters = useMemo(() => {
    if (searchQuery.trim()) {
      const hits = searchSpots(searchQuery);
      return bodiesOfWater
        .map(w => ({ ...w, spots: w.spots.filter(s => hits.some(h => h.id === s.id)) }))
        .filter(w => w.spots.length > 0);
    }
    return getWatersByRegion(selectedRegion);
  }, [selectedRegion, searchQuery]);

  const milwaukeeCount = getWatersByRegion('Milwaukee').reduce((n, w) => n + w.spots.length, 0);
  const maustonCount   = getWatersByRegion('Mauston').reduce((n, w) => n + w.spots.length, 0);

  return (
    <View style={styles.container}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search & Fish</Text>
        <Text style={styles.headerSubtitle}>Wisconsin — Bodies of Water</Text>
      </View>

      {/* ── SEARCH ──────────────────────────────────────────── */}
      <View style={styles.searchBar}>
        <Feather name="search" size={17} color={colors.neutral.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search fish, water, or location…"
          placeholderTextColor={colors.neutral.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x-circle" size={17} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── REGION TABS ─────────────────────────────────────── */}
      {!searchQuery.trim() && (
        <View style={styles.regionTabs}>
          {REGIONS.map(r => {
            const count = r === 'Milwaukee' ? milwaukeeCount : maustonCount;
            const active = selectedRegion === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.regionTab, active && styles.regionTabActive]}
                onPress={() => { setSelectedRegion(r); setExpandedWater(null); }}
              >
                <Text style={[styles.regionTabText, active && styles.regionTabTextActive]}>{r}</Text>
                <View style={[styles.regionTabBadge, active && styles.regionTabBadgeActive]}>
                  <Text style={[styles.regionTabBadgeText, active && styles.regionTabBadgeTextActive]}>
                    {count} spots
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── WATER LIST ──────────────────────────────────────── */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {displayedWaters.map(water => {
          const ts = typeStyle(water.type);
          const open = expandedWater === water.id;
          return (
            <View key={water.id} style={styles.waterCard}>

              {/* Water header */}
              <TouchableOpacity
                style={[styles.waterHead, { backgroundColor: ts.bg }]}
                onPress={() => setExpandedWater(open ? null : water.id)}
                activeOpacity={0.85}
              >
                <View style={styles.waterHeadLeft}>
                  <View style={styles.waterMeta}>
                    <Text style={[styles.waterTypeLabel, { color: ts.label }]}>{water.type.toUpperCase()}</Text>
                    {water.dogFriendly && (
                      <View style={styles.dogBadge}>
                        <Text style={styles.dogEmoji}>🐕</Text>
                        <Text style={styles.dogText}>Dog OK</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.waterName}>{water.name}</Text>
                  <Text style={[styles.waterDesc, { color: ts.label + 'CC' }]} numberOfLines={2}>
                    {water.description}
                  </Text>
                </View>
                <View style={styles.waterHeadRight}>
                  <View style={[styles.spotBadge, { borderColor: ts.label + '60' }]}>
                    <Text style={[styles.spotBadgeNum, { color: ts.label }]}>{water.spots.length}</Text>
                    <Text style={[styles.spotBadgeLabel, { color: ts.label + '99' }]}>spots</Text>
                  </View>
                  <Feather
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={ts.label}
                    style={{ marginTop: spacing.sm }}
                  />
                </View>
              </TouchableOpacity>

              {/* Fish species chips */}
              <View style={styles.fishRow}>
                {water.fish.map((f, i) => (
                  <View key={i} style={styles.fishChip}>
                    <Text style={styles.fishChipText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* Spots */}
              {open && (
                <View style={styles.spotsWrap}>
                  {water.spots.map((spot, idx) => {
                    const d = DIFF[spot.difficulty] || DIFF.Easy;
                    return (
                      <View key={spot.id} style={[styles.spotCard, idx < water.spots.length - 1 && styles.spotDivider]}>
                        <View style={styles.spotHead}>
                          <View style={styles.spotHeadLeft}>
                            <Text style={styles.spotName}>{spot.name}</Text>
                            <Text style={styles.spotAccess}>
                              {spot.dogFriendly ? '🐕 ' : ''}{spot.accessPoint}
                            </Text>
                          </View>
                          <View style={[styles.diffPill, { backgroundColor: d.bg, borderColor: d.border }]}>
                            <Text style={[styles.diffText, { color: d.text }]}>{spot.difficulty}</Text>
                          </View>
                        </View>

                        <View style={styles.spotFishRow}>
                          {spot.fish.map((f, i) => (
                            <View key={i} style={styles.spotFishPill}>
                              <Text style={styles.spotFishText}>{f}</Text>
                            </View>
                          ))}
                        </View>

                        <Text style={styles.spotNotes}>{spot.notes}</Text>

                        <TouchableOpacity
                          style={styles.goBtn}
                          onPress={() => launchNavigation(spot.query, spot.name)}
                          activeOpacity={0.85}
                        >
                          <Feather name="navigation-2" size={15} color="#fff" />
                          <Text style={styles.goBtnText}>GO FISH</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

            </View>
          );
        })}

        {displayedWaters.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDEBE4' },

  // Header
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
  headerSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.wasabi,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
  },

  // Region tabs
  regionTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  regionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.neutral.borderLight,
    ...shadows.sm,
  },
  regionTabActive: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  regionTabText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
  },
  regionTabTextActive: { color: '#fff' },
  regionTabBadge: {
    backgroundColor: colors.neutral.gray200,
    borderRadius: 8,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  regionTabBadgeActive: { backgroundColor: 'rgba(168,198,159,0.25)' },
  regionTabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
  },
  regionTabBadgeTextActive: { color: colors.accent.wasabi },

  // List
  list: { flex: 1, marginTop: spacing.md },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },

  // Water card
  waterCard: {
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.md,
  },
  waterHead: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  waterHeadLeft: { flex: 1, marginRight: spacing.md },
  waterMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  waterTypeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dogBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dogEmoji: { fontSize: 10 },
  dogText: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  waterName: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '800',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  waterDesc: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  waterHeadRight: { alignItems: 'center' },
  spotBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    minWidth: 48,
  },
  spotBadgeNum: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '800',
  },
  spotBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Fish chips
  fishRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: '#F5F8F5',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  fishChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  fishChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },

  // Spots
  spotsWrap: { backgroundColor: '#FAFAF8' },
  spotCard: { padding: spacing.md },
  spotDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  spotHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  spotHeadLeft: { flex: 1, marginRight: spacing.sm },
  spotName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: 2,
  },
  spotAccess: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  diffPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
  },
  spotFishRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  spotFishPill: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  spotFishText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E65100',
  },
  spotNotes: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  goBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.persimmon,
    borderRadius: 12,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  goBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },

  // Empty
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyEmoji: { fontSize: 40 },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
});
