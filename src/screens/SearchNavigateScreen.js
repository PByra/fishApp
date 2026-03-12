import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { bodiesOfWater, getWatersByRegion, searchSpots } from '../data/wisconsinWaters';
import { launchNavigation } from '../services/navigationService';
import { loadSecretSpots, saveSecretSpot, deleteSecretSpot } from '../services/secretSpotStorage';
import { colors, spacing, shadows, typography } from '../theme/colors';

// ─── Constants ───────────────────────────────────────────────────────────────

const REGIONS = ['Southeast', 'South Central', 'Northeast', 'Northern', 'West Central'];

const regionCount = (region) =>
  getWatersByRegion(region).reduce((n, w) => n + w.spots.length, 0);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const DIFF = {
  Easy:         { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  Intermediate: { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  Hard:         { bg: '#FFEBEE', text: '#B71C1C', border: '#EF9A9A' },
};

const TYPE_COLORS = {
  'Great Lake':            { bg: '#152840', label: '#7EC8E3' },
  'Great Bay':             { bg: '#152840', label: '#7EC8E3' },
  'Bay — Lake Michigan':   { bg: '#1E4D7A', label: '#90CAF9' },
  'Lake Superior Bay':     { bg: '#0D2137', label: '#7EC8E3' },
  'River':                 { bg: '#1E3A22', label: '#A8C69F' },
  'River — Tailwaters':    { bg: '#1E3A22', label: '#C4A054' },
  'River — Trout Stream':  { bg: '#122015', label: '#A8C69F' },
  'Reservoir & River':     { bg: '#1E3A22', label: '#A8C69F' },
  'Reservoir':             { bg: '#2D5232', label: '#C4A054' },
  'Natural Lake':          { bg: '#1B3A52', label: '#7EC8E3' },
  'Glacial Lake':          { bg: '#1B3A52', label: '#90CAF9' },
  'Chain of Lakes':        { bg: '#152840', label: '#7EC8E3' },
  'State Park Lakes':      { bg: '#3B3020', label: '#FFCC80' },
  'State Park Lake':       { bg: '#3B3020', label: '#FFCC80' },
  'State Park – Lake Michigan & Quarry': { bg: '#1B3A52', label: '#7EC8E3' },
};

const typeStyle = (type) =>
  TYPE_COLORS[type] || { bg: colors.primary.forest, label: colors.accent.wasabi };

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchNavigateScreen() {
  const [selectedRegion, setSelectedRegion]   = useState('Southeast');
  const [searchQuery, setSearchQuery]         = useState('');
  const [expandedWater, setExpandedWater]     = useState(null);
  const [secretSpots, setSecretSpots]         = useState([]);
  const [secretExpanded, setSecretExpanded]   = useState(false);
  const [showAddForm, setShowAddForm]         = useState(false);
  const [addName, setAddName]                 = useState('');
  const [addNotes, setAddNotes]               = useState('');
  const [addingLocation, setAddingLocation]   = useState(false);
  const [manualLat, setManualLat]             = useState('');
  const [manualLng, setManualLng]             = useState('');

  // Load secret spots on mount
  useEffect(() => {
    loadSecretSpots().then(setSecretSpots);
  }, []);

  const refreshSecrets = useCallback(async () => {
    setSecretSpots(await loadSecretSpots());
  }, []);

  // Displayed bodies of water
  const displayedWaters = useMemo(() => {
    if (searchQuery.trim()) {
      const hits = searchSpots(searchQuery);
      return bodiesOfWater
        .map(w => ({ ...w, spots: w.spots.filter(s => hits.some(h => h.id === s.id)) }))
        .filter(w => w.spots.length > 0);
    }
    return getWatersByRegion(selectedRegion);
  }, [selectedRegion, searchQuery]);

  // ── Secret spot handlers ─────────────────────────────────────────────────

  const handlePinLocation = async () => {
    if (!addName.trim()) {
      Alert.alert('Name required', 'Give your spot a name before pinning.');
      return;
    }
    setAddingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed to pin your spot.');
        setAddingLocation(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      await saveSecretSpot({
        name: addName,
        notes: addNotes,
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
      setAddName('');
      setAddNotes('');
      setShowAddForm(false);
      await refreshSecrets();
    } catch (e) {
      Alert.alert('Error', 'Could not get your location. Try again.');
    } finally {
      setAddingLocation(false);
    }
  };

  const handleDeleteSecret = (id) => {
    Alert.alert('Delete Spot', 'Remove this secret spot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSecretSpot(id);
          await refreshSecrets();
        },
      },
    ]);
  };

  const handleSaveManual = async () => {
    if (!addName.trim()) {
      Alert.alert('Name required', 'Give your spot a name before saving.');
      return;
    }
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Invalid coordinates', 'Enter valid decimal coordinates (e.g. 43.0405, -87.9002).');
      return;
    }
    await saveSecretSpot({ name: addName, notes: addNotes, lat, lng });
    setAddName(''); setAddNotes(''); setManualLat(''); setManualLng('');
    setShowAddForm(false);
    await refreshSecrets();
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddName('');
    setAddNotes('');
    setManualLat('');
    setManualLng('');
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search & Fish</Text>
        <Text style={styles.headerSubtitle}>Wisconsin — Bodies of Water</Text>
      </View>

      {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
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
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="x-circle" size={17} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────────────── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── BETA BANNER ──────────────────────────────────────────────── */}
        <View style={styles.betaBanner}>
          <Feather name="alert-triangle" size={14} color="#fff" style={{ marginTop: 1 }} />
          <Text style={styles.betaBannerText}>
            <Text style={styles.betaBold}>BETA — </Text>
            Locations may not be accurate for public use. Check restrictions before entering locations.
            Please reach out if a location is incorrect.
          </Text>
          <TouchableOpacity
            style={styles.betaReportBtn}
            onPress={() => Linking.openURL('https://github.com/PByra/fishApp/issues')}
            activeOpacity={0.8}
          >
            <Feather name="flag" size={12} color="#fff" />
            <Text style={styles.betaReportText}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* ── MY SECRET SPOTS ──────────────────────────────────────────── */}
        <View style={styles.secretSection}>

          {/* Section header row */}
          <TouchableOpacity
            style={styles.secretHeader}
            onPress={() => setSecretExpanded(v => !v)}
            activeOpacity={0.85}
          >
            <View style={styles.secretHeaderLeft}>
              <Feather name="lock" size={16} color={colors.accent.wasabi} />
              <Text style={styles.secretHeaderTitle}>MY SECRET SPOTS</Text>
              {secretSpots.length > 0 && (
                <View style={styles.secretCountBadge}>
                  <Text style={styles.secretCountText}>{secretSpots.length}</Text>
                </View>
              )}
            </View>
            <View style={styles.secretHeaderRight}>
              <TouchableOpacity
                style={styles.secretAddBtn}
                onPress={() => {
                  setSecretExpanded(true);
                  setShowAddForm(v => !v);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="plus" size={18} color={colors.accent.wasabi} />
              </TouchableOpacity>
              <Feather
                name={secretExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.accent.wasabi}
              />
            </View>
          </TouchableOpacity>

          {/* Add form */}
          {secretExpanded && showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.addFormLabel}>Spot Name</Text>
              <TextInput
                style={styles.addFormInput}
                placeholder="e.g. Bass Cove under the dead oak"
                placeholderTextColor={colors.neutral.gray400}
                value={addName}
                onChangeText={setAddName}
                autoFocus
              />
              <Text style={styles.addFormLabel}>Notes <Text style={styles.addFormOptional}>(optional)</Text></Text>
              <TextInput
                style={[styles.addFormInput, styles.addFormInputMulti]}
                placeholder="Bait, best time of day, depth…"
                placeholderTextColor={colors.neutral.gray400}
                value={addNotes}
                onChangeText={setAddNotes}
                multiline
                numberOfLines={3}
              />
              <View style={styles.addFormActions}>
                <TouchableOpacity
                  style={styles.pinBtn}
                  onPress={handlePinLocation}
                  disabled={addingLocation}
                  activeOpacity={0.85}
                >
                  <Feather name="map-pin" size={15} color="#fff" />
                  <Text style={styles.pinBtnText}>
                    {addingLocation ? 'Getting Location…' : 'Pin My Location'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelAdd}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.manualCoordsSection}>
                <Text style={styles.manualCoordsLabel}>OR enter coordinates manually <Text style={styles.addFormOptional}>(optional)</Text></Text>
                <View style={styles.manualCoordsRow}>
                  <TextInput
                    style={[styles.addFormInput, styles.manualCoordsInput]}
                    placeholder="Latitude (43.0405)"
                    placeholderTextColor={colors.neutral.gray400}
                    value={manualLat}
                    onChangeText={setManualLat}
                    keyboardType="decimal-pad"
                  />
                  <TextInput
                    style={[styles.addFormInput, styles.manualCoordsInput]}
                    placeholder="Longitude (-87.9002)"
                    placeholderTextColor={colors.neutral.gray400}
                    value={manualLng}
                    onChangeText={setManualLng}
                    keyboardType="decimal-pad"
                  />
                </View>
                <TouchableOpacity
                  style={styles.manualSaveBtn}
                  onPress={handleSaveManual}
                  activeOpacity={0.85}
                >
                  <Feather name="save" size={14} color={colors.primary.forest} />
                  <Text style={styles.manualSaveBtnText}>Save with Coordinates</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Spots list */}
          {secretExpanded && (
            secretSpots.length === 0 ? (
              <View style={styles.secretEmpty}>
                <Text style={styles.secretEmptyText}>
                  No secret spots yet — tap + to pin your first one
                </Text>
              </View>
            ) : (
              <View style={styles.secretList}>
                {secretSpots.map((spot, idx) => (
                  <View
                    key={spot.id}
                    style={[
                      styles.secretSpotRow,
                      idx < secretSpots.length - 1 && styles.secretSpotDivider,
                    ]}
                  >
                    <View style={styles.secretSpotMain}>
                      <View style={styles.secretSpotTitleRow}>
                        <Text style={styles.secretSpotEmoji}>🔒</Text>
                        <Text style={styles.secretSpotName}>{spot.name}</Text>
                        <Text style={styles.secretSpotDate}>{fmtDate(spot.date)}</Text>
                      </View>
                      {!!spot.notes && (
                        <Text style={styles.secretSpotNotes}>{spot.notes}</Text>
                      )}
                    </View>
                    <View style={styles.secretSpotActions}>
                      <TouchableOpacity
                        style={styles.secretGoBtn}
                        onPress={() => {
                          const q = `geo:${spot.lat},${spot.lng}?q=${spot.lat},${spot.lng}(${encodeURIComponent(spot.name)})`;
                          launchNavigation(q, spot.name);
                        }}
                        activeOpacity={0.85}
                      >
                        <Feather name="navigation-2" size={13} color="#fff" />
                        <Text style={styles.secretGoBtnText}>GO</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secretDeleteBtn}
                        onPress={() => handleDeleteSecret(spot.id)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Feather name="trash-2" size={15} color={colors.neutral.gray400} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )
          )}
        </View>

        {/* ── REGION TABS ──────────────────────────────────────────────── */}
        {!searchQuery.trim() && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionTabsContent}
            style={styles.regionTabsScroll}
          >
            {REGIONS.map(r => {
              const count = regionCount(r);
              const active = selectedRegion === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.regionTab, active && styles.regionTabActive]}
                  onPress={() => { setSelectedRegion(r); setExpandedWater(null); }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.regionTabText, active && styles.regionTabTextActive]}>
                    {r}
                  </Text>
                  <View style={[styles.regionTabBadge, active && styles.regionTabBadgeActive]}>
                    <Text style={[styles.regionTabBadgeText, active && styles.regionTabBadgeTextActive]}>
                      {count} spots
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ── WATER CARDS ──────────────────────────────────────────────── */}
        <View style={styles.waterList}>
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
                      <Text style={[styles.waterTypeLabel, { color: ts.label }]}>
                        {water.type.toUpperCase()}
                      </Text>
                      {water.dogFriendly && (
                        <View style={styles.dogBadge}>
                          <Text style={styles.dogEmoji}>🐕</Text>
                          <Text style={styles.dogText}>Dog OK</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.waterName}>{water.name}</Text>
                    <Text
                      style={[styles.waterDesc, { color: ts.label + 'CC' }]}
                      numberOfLines={2}
                    >
                      {water.description}
                    </Text>
                  </View>
                  <View style={styles.waterHeadRight}>
                    <View style={[styles.spotBadge, { borderColor: ts.label + '60' }]}>
                      <Text style={[styles.spotBadgeNum, { color: ts.label }]}>
                        {water.spots.length}
                      </Text>
                      <Text style={[styles.spotBadgeLabel, { color: ts.label + '99' }]}>
                        spots
                      </Text>
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

                {/* Spot list */}
                {open && (
                  <View style={styles.spotsWrap}>
                    {water.spots.map((spot, idx) => {
                      const d = DIFF[spot.difficulty] || DIFF.Easy;
                      return (
                        <View
                          key={spot.id}
                          style={[
                            styles.spotCard,
                            idx < water.spots.length - 1 && styles.spotDivider,
                          ]}
                        >
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
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E0CC',
  },

  // ── Header
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

  // ── Search bar
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

  // ── Main scroll list
  list: {
    flex: 1,
    marginTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  // ── Beta banner
  betaBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  betaBannerText: {
    flex: 1,
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
    lineHeight: 16,
  },
  betaBold: { fontWeight: '800' },
  betaReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  betaReportText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Secret spots section
  secretSection: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFDF6',
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    ...shadows.md,
  },
  secretHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary.darkForest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  secretHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  secretHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent.wasabi,
    letterSpacing: 1.2,
  },
  secretCountBadge: {
    backgroundColor: 'rgba(196,160,84,0.25)',
    borderRadius: 8,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  secretCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent.wasabi,
  },
  secretHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  secretAddBtn: {
    padding: spacing.xs,
  },

  // ── Add form
  addForm: {
    backgroundColor: '#F5F0E6',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
    gap: spacing.sm,
  },
  addFormLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary.forest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  addFormOptional: {
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
    color: colors.neutral.textSecondary,
  },
  addFormInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    marginBottom: spacing.sm,
  },
  addFormInputMulti: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: spacing.sm + 2,
  },
  addFormActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  pinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.forest,
    borderRadius: 12,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  pinBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cancelBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.neutral.textSecondary,
  },

  // ── Manual coordinates
  manualCoordsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  manualCoordsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary.forest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manualCoordsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  manualCoordsInput: {
    flex: 1,
    marginBottom: 0,
  },
  manualSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#EEF2EA',
    borderRadius: 12,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
  },
  manualSaveBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },

  // ── Secret spots list
  secretEmpty: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  secretEmptyText: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  secretList: {
    // no extra styles needed — rows handle their own spacing
  },
  secretSpotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  secretSpotDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  secretSpotMain: {
    flex: 1,
    marginRight: spacing.sm,
  },
  secretSpotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  secretSpotEmoji: {
    fontSize: 13,
  },
  secretSpotName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    flexShrink: 1,
  },
  secretSpotDate: {
    fontSize: 11,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  secretSpotNotes: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 2,
  },
  secretSpotActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  secretGoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent.persimmon,
    borderRadius: 10,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  secretGoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  secretDeleteBtn: {
    padding: spacing.xs,
  },

  // ── Region tabs (horizontal scroll)
  regionTabsScroll: {
    // no flex — let it be natural height
  },
  regionTabsContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  regionTab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.neutral.borderLight,
    minWidth: 100,
    ...shadows.sm,
  },
  regionTabActive: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  regionTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  regionTabTextActive: {
    color: '#fff',
  },
  regionTabBadge: {
    backgroundColor: colors.neutral.gray200,
    borderRadius: 8,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  regionTabBadgeActive: {
    backgroundColor: 'rgba(168,198,159,0.25)',
  },
  regionTabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
  },
  regionTabBadgeTextActive: {
    color: colors.accent.wasabi,
  },

  // ── Water list wrapper
  waterList: {
    gap: spacing.md,
  },

  // ── Water card
  waterCard: {
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.md,
  },
  waterHead: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  waterHeadLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  waterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
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
  waterHeadRight: {
    alignItems: 'center',
  },
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

  // ── Fish chips (water level)
  fishRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: '#EEF2EA',
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

  // ── Spots wrap
  spotsWrap: {
    backgroundColor: '#FFFDF6',
  },
  spotCard: {
    padding: spacing.md,
  },
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
  spotHeadLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
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

  // ── Empty state
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
});
