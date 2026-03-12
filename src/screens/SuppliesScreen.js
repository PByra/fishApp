import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Alert, TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinSupplies } from '../data/wisconsinSupplies';
import { colors, spacing, shadows, typography } from '../theme/colors';
import { loadMyGear, addGearItem, deleteGearItem } from '../services/gearStorage';

const SUPPLY_CATS = ['All', 'Rods', 'Reels', 'Fishing Line', 'Lures & Bait', 'Tackle Organization', 'Clothing'];

const GEAR_TAGS = ['Rod', 'Reel', 'Line', 'Lure', 'Bait', 'Terminal Tackle', 'Net', 'Electronics', 'Clothing', 'Other'];

const TAG_STYLE = {
  Rod:              { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  Reel:             { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  Line:             { bg: '#F3E5F5', text: '#6A1B9A', border: '#CE93D8' },
  Lure:             { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  Bait:             { bg: '#FCE4EC', text: '#B71C1C', border: '#F48FB1' },
  'Terminal Tackle':{ bg: '#E0F7FA', text: '#006064', border: '#80DEEA' },
  Net:              { bg: '#F9FBE7', text: '#558B2F', border: '#C5E1A5' },
  Electronics:      { bg: '#E8EAF6', text: '#283593', border: '#9FA8DA' },
  Clothing:         { bg: '#FBE9E7', text: '#BF360C', border: '#FFAB91' },
  Other:            { bg: '#F5F5F5', text: '#424242', border: '#BDBDBD' },
};

const ts = (tag) => TAG_STYLE[tag] || TAG_STYLE.Other;

const PRICE_STYLE = {
  'Entry/Budget':    { bg: '#E8F5E9', text: '#2E7D32' },
  'Medium':          { bg: '#E3F2FD', text: '#1565C0' },
  'Medium/High-End': { bg: '#FFF3E0', text: '#E65100' },
  'High-End':        { bg: '#FCE4EC', text: '#B71C1C' },
};
const ps = (r) => PRICE_STYLE[r] || { bg: '#F5F5F5', text: '#616161' };

export default function SuppliesScreen() {
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory]     = useState('All');

  // My Gear state
  const [myGear, setMyGear]         = useState([]);
  const [inputText, setInputText]   = useState('');
  const [selectedTag, setSelectedTag] = useState('Rod');
  const [showTagPicker, setShowTagPicker] = useState(false);

  const refreshGear = useCallback(async () => setMyGear(await loadMyGear()), []);
  useEffect(() => { refreshGear(); }, [refreshGear]);

  const handleAdd = async () => {
    if (!inputText.trim()) return;
    await addGearItem({ name: inputText, tag: selectedTag });
    setInputText('');
    await refreshGear();
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Item', 'Remove this from your gear bag?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => { await deleteGearItem(id); await refreshGear(); } },
    ]);
  };

  const displayed = category === 'All'
    ? wisconsinSupplies
    : wisconsinSupplies.filter(s => s.category === category);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fishing Gear</Text>
        <Text style={styles.headerSub}>My Bag · Wisconsin Brands</Text>
      </View>

      {/* ══════════════════════════════════════════════════════
          MY GEAR BAG
      ══════════════════════════════════════════════════════ */}
      <View style={styles.bagSection}>
        <View style={styles.bagSectionHead}>
          <View style={styles.bagHeadLeft}>
            <Text style={styles.bagEmoji}>🎒</Text>
            <View>
              <Text style={styles.bagTitle}>My Gear Bag</Text>
              <Text style={styles.bagSub}>{myGear.length} item{myGear.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>

        {/* Add item row */}
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="e.g. St. Croix 7' Medium Rod"
            placeholderTextColor={colors.neutral.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.tagPickerBtn}
            onPress={() => setShowTagPicker(!showTagPicker)}
          >
            <View style={[styles.tagPill, { backgroundColor: ts(selectedTag).bg, borderColor: ts(selectedTag).border }]}>
              <Text style={[styles.tagPillText, { color: ts(selectedTag).text }]}>{selectedTag}</Text>
              <Feather name="chevron-down" size={11} color={ts(selectedTag).text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, !inputText.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!inputText.trim()}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tag picker */}
        {showTagPicker && (
          <View style={styles.tagGrid}>
            {GEAR_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagOption, { backgroundColor: ts(tag).bg, borderColor: ts(tag).border },
                  selectedTag === tag && styles.tagOptionActive]}
                onPress={() => { setSelectedTag(tag); setShowTagPicker(false); }}
              >
                <Text style={[styles.tagOptionText, { color: ts(tag).text }]}>{tag}</Text>
                {selectedTag === tag && <Feather name="check" size={11} color={ts(tag).text} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Gear list */}
        {myGear.length === 0 ? (
          <Text style={styles.bagEmpty}>Add the gear you own above — type a name, pick a tag, hit +</Text>
        ) : (
          <View style={styles.gearList}>
            {myGear.map(item => {
              const t = ts(item.tag);
              return (
                <View key={item.id} style={styles.gearItem}>
                  <View style={[styles.gearTagBadge, { backgroundColor: t.bg, borderColor: t.border }]}>
                    <Text style={[styles.gearTagBadgeText, { color: t.text }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.gearItemName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.gearDeleteBtn}>
                    <Feather name="x" size={15} color={colors.neutral.gray400} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ══════════════════════════════════════════════════════
          WISCONSIN BRANDS
      ══════════════════════════════════════════════════════ */}
      <View style={styles.brandsSection}>
        <View style={styles.brandsSectionHead}>
          <View style={[styles.accentBar]} />
          <Text style={styles.brandsSectionTitle}>WISCONSIN BRANDS</Text>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ marginBottom: spacing.md }}
          contentContainerStyle={styles.catRow}
        >
          {SUPPLY_CATS.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, category === cat && styles.catBtnActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards */}
        <View style={styles.cardList}>
          {displayed.map(supply => {
            const open = selectedId === supply.id;
            const p    = ps(supply.priceRange);
            return (
              <View key={supply.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardTop}
                  onPress={() => setSelectedId(open ? null : supply.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{supply.name}</Text>
                    <Text style={styles.cardBrand}>{supply.brand} · {supply.location}</Text>
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardRating}>★ {supply.rating}</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.cardCat}>{supply.category}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.pricePill, { backgroundColor: p.bg }]}>
                      <Text style={[styles.priceText, { color: p.text }]}>{supply.price}</Text>
                    </View>
                    <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.neutral.gray400} />
                  </View>
                </TouchableOpacity>

                {open && (
                  <View style={styles.cardBody}>
                    <View style={styles.wiRow}>
                      <Feather name="award" size={14} color={colors.primary.forest} />
                      <Text style={styles.wiText}>{supply.wisconsinConnection}</Text>
                    </View>
                    {supply.forFish?.length > 0 && (
                      <View>
                        <Text style={styles.expandLabel}>BEST FOR</Text>
                        <View style={styles.forFishWrap}>
                          {supply.forFish.map((f, i) => (
                            <View key={i} style={styles.forFishChip}>
                              <Text style={styles.forFishText}>{f}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => Linking.openURL(supply.link).catch(() => Alert.alert('Error', 'Could not open link'))}
                    >
                      <Feather name="external-link" size={15} color="#fff" />
                      <Text style={styles.linkBtnText}>Visit Website</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerCard}>
          <Feather name="heart" size={16} color={colors.accent.persimmon} />
          <Text style={styles.footerText}>Support Wisconsin brands — keeps money in the communities where you fish.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E0CC' },

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
    fontWeight: '600',
    marginTop: 3,
  },

  // ── MY GEAR BAG ────────────────────────────────────────
  bagSection: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 20,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.wasabi,
    ...shadows.md,
  },
  bagSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bagHeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  bagEmoji: { fontSize: 30 },
  bagTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '800',
    color: colors.primary.forest,
    marginBottom: 2,
  },
  bagSub: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },

  // Add row
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#F5F8F5',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
  },
  tagPickerBtn: {},
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  tagPillText: { fontSize: 12, fontWeight: '700' },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary.forest,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  addBtnDisabled: { backgroundColor: colors.neutral.gray300 },

  // Tag picker grid
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tagOptionActive: { opacity: 1 },
  tagOptionText: { fontSize: 12, fontWeight: '700' },

  // Gear list
  bagEmpty: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontStyle: 'italic',
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  gearList: { gap: spacing.xs, marginTop: spacing.xs },
  gearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE6',
  },
  gearTagBadge: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  gearTagBadgeText: { fontSize: 10, fontWeight: '800' },
  gearItemName: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary.forest,
  },
  gearDeleteBtn: { padding: 4 },

  // ── WISCONSIN BRANDS ───────────────────────────────────
  brandsSection: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  brandsSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.accent.persimmon,
  },
  brandsSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary.forest,
    letterSpacing: 1,
  },

  catRow: { gap: spacing.sm, paddingBottom: spacing.xs },
  catBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.neutral.borderLight,
  },
  catBtnActive: { backgroundColor: colors.primary.forest, borderColor: colors.primary.forest },
  catBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary.forest },
  catBtnTextActive: { color: '#fff' },

  cardList: { gap: spacing.md, paddingBottom: 0 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 1.5,
    borderColor: colors.neutral.borderLight,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: 3,
  },
  cardBrand: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardRating: { fontSize: 12, color: '#F9A825', fontWeight: '700' },
  metaDot: { fontSize: 12, color: colors.neutral.gray300 },
  cardCat: { fontSize: 12, color: colors.neutral.textSecondary, fontWeight: '500' },
  cardRight: { alignItems: 'center', gap: spacing.sm },
  pricePill: { borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  priceText: { fontSize: 11, fontWeight: '700' },

  cardBody: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
    gap: spacing.md,
  },
  wiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#F0F7F4',
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
  },
  wiText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    fontWeight: '600',
    lineHeight: 17,
  },
  expandLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  forFishWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  forFishChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  forFishText: { fontSize: 12, fontWeight: '600', color: '#2E7D32' },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.persimmon,
    borderRadius: 12,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  linkBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },

  footer: { padding: spacing.md, paddingBottom: spacing.xl },
  footerCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.persimmon,
    ...shadows.sm,
  },
  footerText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
    lineHeight: 17,
  },
});
