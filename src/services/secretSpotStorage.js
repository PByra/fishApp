/**
 * My Secret Spots — AsyncStorage CRUD
 * Each entry: { id, name, notes, lat, lng, date }
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@fishapp_secret_spots_v1';

export const loadSecretSpots = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveSecretSpot = async ({ name, notes = '', lat, lng }) => {
  const spots = await loadSecretSpots();
  const newSpot = {
    id: Date.now().toString(),
    name: name.trim(),
    notes: notes.trim(),
    lat,
    lng,
    date: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify([newSpot, ...spots]));
  return newSpot;
};

export const deleteSecretSpot = async (id) => {
  const spots = await loadSecretSpots();
  await AsyncStorage.setItem(KEY, JSON.stringify(spots.filter(s => s.id !== id)));
};
