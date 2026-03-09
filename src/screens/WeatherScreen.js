import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function WeatherScreen() {
  // Mock weather data - no API calls, no async, no crashes
  const todayWeather = {
    location: 'Milwaukee, WI',
    temperature: 58,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NW',
    humidity: 65,
    fishingCondition: 'Good',
    emoji: '⛅'
  };

  const forecast = [
    { day: 'Tomorrow', high: 62, low: 48, condition: 'Sunny', windSpeed: 8, emoji: '☀️', rating: '⭐⭐⭐⭐' },
    { day: 'Wednesday', high: 65, low: 50, condition: 'Cloudy', windSpeed: 10, emoji: '☁️', rating: '⭐⭐⭐⭐⭐' },
    { day: 'Thursday', high: 58, low: 45, condition: 'Rainy', windSpeed: 15, emoji: '🌧️', rating: '⭐⭐⭐' },
  ];

  const getFishingColor = (condition) => {
    switch (condition) {
      case 'Good': return '#2E7D32';
      case 'Excellent': return '#1B5E20';
      case 'Fair': return '#E65100';
      default: return '#01579B';
    }
  };

  return (
    <View style={styles.container}>
      {/* Today's Weather - Large */}
      <View style={styles.todayContainer}>
        <View style={styles.todayTop}>
          <Text style={styles.emoji}>{todayWeather.emoji}</Text>
          <View style={styles.todayInfo}>
            <Text style={styles.condition}>{todayWeather.condition}</Text>
            <Text style={styles.location}>{todayWeather.location}</Text>
          </View>
        </View>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>{todayWeather.temperature}°F</Text>
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Feather name="wind" size={18} color="#1B5E20" />
              <Text style={styles.detailText}>{todayWeather.windSpeed} mph</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="droplets" size={18} color="#1B5E20" />
              <Text style={styles.detailText}>{todayWeather.humidity}%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.fishingBadge, { backgroundColor: getFishingColor(todayWeather.fishingCondition) }]}>
          <Text style={styles.fishingEmoji}>🎣</Text>
          <View style={styles.fishingBadgeText}>
            <Text style={styles.fishingLabel}>Fishing: {todayWeather.fishingCondition}</Text>
          </View>
        </View>
      </View>

      {/* Next 3 Days - Compact */}
      <View style={styles.forecastRibbon}>
        {forecast.map((day, idx) => (
          <View key={idx} style={styles.dayCard}>
            <Text style={styles.dayEmoji}>{day.emoji}</Text>
            <Text style={styles.dayName}>{day.day}</Text>
            <Text style={styles.dayTemp}>{day.high}°/{day.low}°</Text>
            <Text style={styles.dayWind}>💨 {day.windSpeed}mph</Text>
            <Text style={styles.dayRating}>{day.rating}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    paddingVertical: 16,
  },
  todayContainer: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  todayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginRight: 12,
  },
  todayInfo: {
    flex: 1,
  },
  condition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 2,
  },
  temperatureSection: {
    marginBottom: 16,
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#E8F5E9',
    fontWeight: '600',
  },
  fishingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  fishingEmoji: {
    fontSize: 20,
  },
  fishingBadgeText: {
    justifyContent: 'center',
  },
  fishingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  forecastRibbon: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 10,
  },
  dayCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  dayEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  dayTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  dayWind: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  dayRating: {
    fontSize: 12,
  },
});
