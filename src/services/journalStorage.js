/**
 * Journal storage using AsyncStorage
 * Stores fishing catch entries locally on device
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@fishapp_journal';

/**
 * Load all journal entries
 */
export const loadEntries = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Save a new journal entry
 * @param {Object} entry - { id, date, fishSpecies, location, gearUsed, photoUri, notes }
 */
export const saveEntry = async (entry) => {
  const entries = await loadEntries();
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

/**
 * Delete an entry by id
 */
export const deleteEntry = async (id) => {
  const entries = await loadEntries();
  const updated = entries.filter(e => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
