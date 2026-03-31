import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, shadows, typography } from '../theme/colors';
import { loadEntries, saveEntry, deleteEntry } from '../services/journalStorage';

// Fish species list (matches seasonalData)
const FISH_SPECIES = [
  'Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'Pike', 'Musky',
  'Lake Trout', 'Chinook Salmon', 'Coho Salmon', 'Yellow Perch',
  'Crappie', 'Catfish', 'Steelhead', 'Other',
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(isoString) {
  const d = new Date(isoString);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ── Memoized entry card ────────────────────────────────────────────────────
// Prevents all cards from re-rendering when one expands/collapses
const EntryCard = memo(function EntryCard({ entry, isExpanded, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => onToggle(entry.id)}
      activeOpacity={0.85}
    >
      <View style={styles.entryHeader}>
        <View style={styles.entryHeaderLeft}>
          <Text style={styles.entryFish}>{entry.fishSpecies}</Text>
          <View style={styles.entryMeta}>
            <Feather name="map-pin" size={12} color={colors.neutral.textSecondary} />
            <Text style={styles.entryLocation}>{entry.location}</Text>
          </View>
          <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
        </View>
        {entry.photoUri ? (
          <Image source={{ uri: entry.photoUri }} style={styles.entryThumb} />
        ) : (
          <View style={styles.noPhotoThumb}>
            <Text style={styles.noPhotoIcon}>🐟</Text>
          </View>
        )}
      </View>

      {isExpanded && (
        <View style={styles.entryExpanded}>
          {entry.photoUri && (
            <Image source={{ uri: entry.photoUri }} style={styles.entryPhoto} resizeMode="cover" />
          )}
          {entry.gearUsed ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>GEAR USED</Text>
              <Text style={styles.detailValue}>{entry.gearUsed}</Text>
            </View>
          ) : null}
          {entry.notes ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>NOTES</Text>
              <Text style={styles.detailValue}>{entry.notes}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(entry.id)}>
            <Feather name="trash-2" size={14} color={colors.accent.persimmon} />
            <Text style={styles.deleteBtnText}>Delete Entry</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
});

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>🎣</Text>
    <Text style={styles.emptyTitle}>No catches yet</Text>
    <Text style={styles.emptySubtitle}>Tap the + button to log your first catch</Text>
  </View>
);

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);

  // Form state
  const [formFish, setFormFish] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formGear, setFormGear] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formPhotoUri, setFormPhotoUri] = useState(null);
  const [showSpeciesPicker, setShowSpeciesPicker] = useState(false);

  const refresh = useCallback(async () => {
    const data = await loadEntries();
    setEntries(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handlePickPhoto = async () => {
    try {
      // Dynamic import so app doesn't crash if expo-image-picker isn't installed
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow photo access to attach a picture of your catch.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) {
        setFormPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Photo unavailable', 'Install expo-image-picker to attach photos.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow camera access to take a photo of your catch.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) {
        setFormPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Camera unavailable', 'Install expo-image-picker to use the camera.');
    }
  };

  const handleSave = async () => {
    if (!formFish) {
      Alert.alert('Required', 'Select a fish species.');
      return;
    }
    if (!formLocation.trim()) {
      Alert.alert('Required', 'Enter where you caught it.');
      return;
    }
    await saveEntry({
      fishSpecies: formFish,
      location: formLocation.trim(),
      gearUsed: formGear.trim(),
      notes: formNotes.trim(),
      photoUri: formPhotoUri,
    });
    // Reset form
    setFormFish('');
    setFormLocation('');
    setFormGear('');
    setFormNotes('');
    setFormPhotoUri(null);
    setShowModal(false);
    await refresh();
  };

  const handleToggleEntry = useCallback((id) => {
    setExpandedEntry(prev => prev === id ? null : id);
  }, []);

  const handleDelete = useCallback((id) => {
    Alert.alert('Delete Entry', 'Remove this catch from your journal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(id);
          await refresh();
          setExpandedEntry(prev => prev === id ? null : prev);
        },
      },
    ]);
  }, [refresh]);

  const openModal = useCallback(() => {
    setFormFish('');
    setFormLocation('');
    setFormGear('');
    setFormNotes('');
    setFormPhotoUri(null);
    setShowModal(true);
  }, []);

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={styles.headerTitle}>My Catch Journal</Text>
          <Text style={styles.headerSubtitle}>{entries.length} catch{entries.length !== 1 ? 'es' : ''} logged</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <Feather name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── ENTRY LIST ── */}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            isExpanded={expandedEntry === item.id}
            onToggle={handleToggleEntry}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={5}
      />

      {/* ── ADD ENTRY MODAL ── */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log a Catch</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Feather name="x" size={24} color={colors.primary.forest} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Photo */}
            <Text style={styles.fieldLabel}>PHOTO</Text>
            {formPhotoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: formPhotoUri }} style={styles.photoPreview} resizeMode="cover" />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setFormPhotoUri(null)}>
                  <Feather name="x" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPickerRow}>
                <TouchableOpacity style={styles.photoBtn} onPress={handleTakePhoto}>
                  <Feather name="camera" size={20} color={colors.primary.forest} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
                  <Feather name="image" size={20} color={colors.primary.forest} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Fish Species */}
            <Text style={styles.fieldLabel}>FISH SPECIES *</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowSpeciesPicker(!showSpeciesPicker)}
            >
              <Text style={[styles.pickerBtnText, !formFish && styles.pickerPlaceholder]}>
                {formFish || 'Select species…'}
              </Text>
              <Feather name={showSpeciesPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.neutral.textSecondary} />
            </TouchableOpacity>
            {showSpeciesPicker && (
              <View style={styles.speciesList}>
                {FISH_SPECIES.map(f => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.speciesItem, formFish === f && styles.speciesItemActive]}
                    onPress={() => { setFormFish(f); setShowSpeciesPicker(false); }}
                  >
                    <Text style={[styles.speciesText, formFish === f && styles.speciesTextActive]}>{f}</Text>
                    {formFish === f && <Feather name="check" size={16} color={colors.primary.forest} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Location */}
            <Text style={styles.fieldLabel}>LOCATION *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. McKinley Pier, Milwaukee"
              placeholderTextColor={colors.neutral.textSecondary}
              value={formLocation}
              onChangeText={setFormLocation}
            />

            {/* Gear */}
            <Text style={styles.fieldLabel}>GEAR USED</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Medium spinning rod, live minnow"
              placeholderTextColor={colors.neutral.textSecondary}
              value={formGear}
              onChangeText={setFormGear}
            />

            {/* Notes */}
            <Text style={styles.fieldLabel}>NOTES</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Conditions, time of day, anything worth remembering…"
              placeholderTextColor={colors.neutral.textSecondary}
              value={formNotes}
              onChangeText={setFormNotes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Feather name="bookmark" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save Catch</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary.forest,
    paddingHorizontal: spacing.lg,
    // paddingTop set inline with insets.top
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.persimmon,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },

  // List
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
  },
  emptySubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Entry card
  entryCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  entryHeaderLeft: { flex: 1, marginRight: spacing.md },
  entryFish: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    marginBottom: spacing.xs,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  entryLocation: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  entryDate: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.gray400,
    fontWeight: '500',
    marginTop: 2,
  },
  entryThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.neutral.borderLight,
  },
  noPhotoThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#EEF2EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
  },
  noPhotoIcon: { fontSize: 32 },

  // Expanded
  entryExpanded: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  entryPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  detailRow: { gap: spacing.xs },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    fontWeight: '500',
    lineHeight: 20,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  deleteBtnText: {
    fontSize: typography.caption.fontSize,
    color: colors.accent.persimmon,
    fontWeight: '600',
  },

  // Modal
  modal: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
    ...shadows.sm,
  },
  modalTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
  },
  modalScroll: { flex: 1 },

  // Form fields
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerBtn: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
  },
  pickerBtnText: {
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    fontWeight: '500',
  },
  pickerPlaceholder: {
    color: colors.neutral.textSecondary,
    fontWeight: '400',
  },
  speciesList: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  speciesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.borderLight,
  },
  speciesItemActive: {
    backgroundColor: '#EEF2EA',
  },
  speciesText: {
    fontSize: typography.body.fontSize,
    color: colors.primary.forest,
    fontWeight: '500',
  },
  speciesTextActive: {
    fontWeight: '700',
    color: colors.primary.forest,
  },

  // Photo
  photoPickerRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral.borderLight,
    ...shadows.sm,
  },
  photoBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary.forest,
  },
  photoPreviewContainer: {
    marginHorizontal: spacing.lg,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Save button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.forest,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
    ...shadows.md,
  },
  saveBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
