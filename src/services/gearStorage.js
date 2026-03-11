import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@fishapp_my_gear_v2';

/**
 * Each entry: { id: string, name: string, tag: string, addedDate: string }
 * Tags: Rod, Reel, Line, Lure, Bait, Terminal Tackle, Net, Electronics, Clothing, Other
 */

export const loadMyGear = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addGearItem = async ({ name, tag }) => {
  const items = await loadMyGear();
  const newItem = { id: Date.now().toString(), name: name.trim(), tag, addedDate: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify([newItem, ...items]));
  return newItem;
};

export const deleteGearItem = async (id) => {
  const items = await loadMyGear();
  await AsyncStorage.setItem(KEY, JSON.stringify(items.filter(i => i.id !== id)));
};
