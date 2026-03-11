import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Linking, Platform } from 'react-native';
import { colors, touchTargets, shadows } from '../theme/colors';

/**
 * Premium Navigate Button Component
 * - Large touch target (56dp minimum)
 * - High contrast Persimmon Orange
 * - Compass icon style
 * - Glassmorphism effect overlay on press
 */
export const NavigateButton = ({ latitude, longitude, locationName, size = 'large' }) => {
  const handleNavigate = () => {
    // Apple Maps (iOS)
    const appleMapsUrl = `maps://maps.apple.com/?q=${locationName}&ll=${latitude},${longitude}`;
    // Google Maps (Android)
    const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    const url = Platform.OS === 'ios' ? appleMapsUrl : googleMapsUrl;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
        }
      })
      .catch(err => console.error('Error opening maps:', err));
  };

  const buttonSize = size === 'large' ? touchTargets.large : touchTargets.medium;
  const fontSize = size === 'large' ? 18 : 16;

  return (
    <Pressable
      onPress={handleNavigate}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.accent.darkOrange : colors.accent.persimmon,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 12,
          minHeight: buttonSize,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          shadowColor: colors.accent.persimmon,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          transition: 'all 0.2s ease',
        },
      ]}
    >
      <Text style={{
        color: colors.neutral.white,
        fontSize: fontSize,
        fontWeight: '700',
        marginRight: 8,
        letterSpacing: 0.5,
      }}>
        🧭
      </Text>
      <Text style={{
        color: colors.neutral.white,
        fontSize: fontSize,
        fontWeight: '600',
        letterSpacing: 0.3,
      }}>
        NAVIGATE
      </Text>
    </Pressable>
  );
};

export default NavigateButton;
