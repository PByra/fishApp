import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async () => {
    try {
      // Mock weather data for Wisconsin
      const mockWeatherData = {
        location: 'Madison, WI',
        temperature: 58,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        windDirection: 'NW',
        humidity: 65,
        pressure: 1013,
        uvIndex: 4,
        fishingCondition: 'Good',
        recommendation: 'Light overcast is ideal for fishing. Wind is acceptable for most techniques.',
        forecast: [
          { day: 'Monday', high: 62, low: 48, condition: 'Sunny', windSpeed: 8 },
          { day: 'Tuesday', high: 65, low: 50, condition: 'Cloudy', windSpeed: 10 },
          { day: 'Wednesday', high: 58, low: 45, condition: 'Rainy', windSpeed: 15 },
          { day: 'Thursday', high: 60, low: 48, condition: 'Partly Cloudy', windSpeed: 12 },
          { day: 'Friday', high: 68, low: 52, condition: 'Sunny', windSpeed: 6 },
        ]
      };
      
      setWeather(mockWeatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#004E89" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {weather && (
        <>
          <View style={styles.currentWeather}>
            <View style={styles.locationHeader}>
              <Feather name="map-pin" size={18} color="#666" />
              <Text style={styles.location}>{weather.location}</Text>
            </View>

            <View style={styles.temperatureDisplay}>
              <Feather name="cloud" size={64} color="#004E89" />
              <View style={styles.tempInfo}>
                <Text style={styles.temperature}>{weather.temperature}°F</Text>
                <Text style={styles.condition}>{weather.condition}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Feather name="wind" size={20} color="#004E89" />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} mph {weather.windDirection}</Text>
              </View>
              <View style={styles.detailBox}>
                <Feather name="droplets" size={20} color="#004E89" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.detailBox}>
                <Feather name="gauge" size={20} color="#004E89" />
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{weather.pressure} mb</Text>
              </View>
              <View style={styles.detailBox}>
                <Feather name="sun" size={20} color="#004E89" />
                <Text style={styles.detailLabel}>UV Index</Text>
                <Text style={styles.detailValue}>{weather.uvIndex}</Text>
              </View>
            </View>

            <View style={styles.fishingCondition}>
              <View style={styles.fishingHeader}>
                <Feather name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.fishingStatus}>{weather.fishingCondition}</Text>
              </View>
              <Text style={styles.recommendation}>{weather.recommendation}</Text>
            </View>
          </View>

          <View style={styles.forecast}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            {weather.forecast.map((day, idx) => (
              <View key={idx} style={styles.forecastCard}>
                <Text style={styles.forecastDay}>{day.day}</Text>
                <Text style={styles.forecastCondition}>{day.condition}</Text>
                <Text style={styles.forecastTemp}>{day.high}° / {day.low}°</Text>
                <Text style={styles.forecastWind}>💨 {day.windSpeed} mph</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  currentWeather: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  temperatureDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  tempInfo: {
    marginLeft: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#004E89',
  },
  condition: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  fishingCondition: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  fishingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fishingStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  recommendation: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  forecast: {
    padding: 16,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  forecastCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 60,
  },
  forecastCondition: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginLeft: 8,
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '600',
    color: '#004E89',
    minWidth: 60,
  },
  forecastWind: {
    fontSize: 12,
    color: '#666',
    minWidth: 50,
  },
});
