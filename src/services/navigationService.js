import { Platform, Linking, Alert } from 'react-native';

/**
 * Navigation Service for Search-to-Navigate Feature
 * Supports both browser and native Android Google Maps integration
 * Optimized for Samsung Galaxy Flip 3
 */

/**
 * Launch navigation using search query string
 * @param {string} query - Search query string for Google Maps
 * @param {string} locationName - Display name for error messages
 */
export const launchNavigation = async (query, locationName = 'Location') => {
  try {
    if (!query || query.trim() === '') {
      Alert.alert('Error', 'No search query available for this location');
      return;
    }

    // Android: Use geo: intent to trigger native Google Maps
    if (Platform.OS === 'android') {
      const geoUrl = `geo:0,0?q=${encodeURIComponent(query)}`;
      
      try {
        await Linking.openURL(geoUrl);
      } catch (error) {
        // Fallback to web-based Google Maps if geo intent fails
        console.log('Geo intent failed, falling back to web Maps');
        await openWebMaps(query);
      }
    } else if (Platform.OS === 'ios') {
      // iOS: Try Apple Maps first, fall back to Google Maps
      const appleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(query)}`;
      
      try {
        const canOpen = await Linking.canOpenURL(appleMapsUrl);
        if (canOpen) {
          await Linking.openURL(appleMapsUrl);
        } else {
          await openWebMaps(query);
        }
      } catch (error) {
        await openWebMaps(query);
      }
    } else {
      // Web or other platform: Use web-based Google Maps
      await openWebMaps(query);
    }
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert(
      'Navigation Error',
      `Could not open maps for "${locationName}". Please try again or use the manual search.`,
      [{ text: 'OK' }]
    );
  }
};

/**
 * Open Google Maps in web browser
 * @param {string} query - Search query string
 */
export const openWebMaps = async (query) => {
  try {
    const webMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    await Linking.openURL(webMapsUrl);
  } catch (error) {
    console.error('Web Maps error:', error);
    Alert.alert('Error', 'Could not open Google Maps');
  }
};

/**
 * Build a search query string from location data
 * @param {Object} location - Location object with name and address
 * @returns {string} Formatted search query
 */
export const buildSearchQuery = (location) => {
  if (location.query) {
    return location.query;
  }
  
  // Fallback: Build query from available data
  if (location.name && location.region) {
    return `${location.name} ${location.region} Wisconsin`;
  }
  
  return location.name || '';
};

/**
 * Share location search query
 * @param {Object} location - Location object
 */
export const shareLocation = async (location) => {
  try {
    const query = buildSearchQuery(location);
    const message = `Check out ${location.name} for fishing in Wisconsin!\n\nSearch: ${query}\n\nhttps://maps.google.com/maps/search/${encodeURIComponent(query)}`;
    
    // For React Native, we would use Share API
    // For now, just copy to URL
    return message;
  } catch (error) {
    console.error('Share error:', error);
  }
};

/**
 * Validate search query
 * @param {string} query - Query to validate
 * @returns {boolean}
 */
export const isValidQuery = (query) => {
  return query && query.trim().length > 0;
};

export default {
  launchNavigation,
  openWebMaps,
  buildSearchQuery,
  shareLocation,
  isValidQuery,
};
