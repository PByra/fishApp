import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCurrentInSeasonFish } from '../data/seasonalData';

export default function HomeScreen({ navigation }) {
  const [inSeasonFish, setInSeasonFish] = useState([]);

  useEffect(() => {
    const allFish = getCurrentInSeasonFish();
    setInSeasonFish(allFish);
  }, []);

  // Mock weather for Milwaukee
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

  // Get in-season fish (up to 3 for gear display)
  const topInSeasonFish = inSeasonFish.filter(f => f.seasonStatus === 2).slice(0, 3);
  
  // Collect unique gear from in-season fish
  const allGear = new Set();
  inSeasonFish.forEach(fish => {
    if (fish.seasonStatus === 2 && fish.recommendedGear) {
      fish.recommendedGear.forEach(gear => allGear.add(gear));
    }
  });
  const gearList = Array.from(allGear).slice(0, 6);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* TODAY'S WEATHER SECTION */}
      <View style={styles.weatherContainer}>
        <View style={styles.weatherTop}>
          <Text style={styles.sectionLabel}>TODAY'S WEATHER</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Weather')}>
            <Text style={styles.seeMore}>View Forecast →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <Text style={styles.tempDisplay}>{todayWeather.temperature}°</Text>
            <Text style={styles.condition}>{todayWeather.condition}</Text>
            <Text style={styles.location}>{todayWeather.location}</Text>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherEmoji}>{todayWeather.emoji}</Text>
            <View style={styles.weatherDetails}>
              <Text style={styles.detail}>💨 {todayWeather.windSpeed} mph</Text>
              <Text style={styles.detail}>💧 {todayWeather.humidity}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.fishingConditionBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.conditionText}>Fishing: <Text style={{ fontWeight: 'bold' }}>{todayWeather.fishingCondition}</Text></Text>
        </View>
      </View>

      {/* IN-SEASON FISH SECTION */}
      {topInSeasonFish.length > 0 && (
        <View style={styles.inSeasonContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>🎣 IN SEASON NOW</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Seasonal')}>
              <Text style={styles.seeMore}>See All →</Text>
            </TouchableOpacity>
          </View>

          {topInSeasonFish.map((fish, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.fishCard}
              onPress={() => navigation.navigate('Seasonal')}
            >
              <View style={styles.fishCardContent}>
                <View style={styles.fishNameSection}>
                  <Text style={styles.fishName}>{fish.fish}</Text>
                  <Text style={styles.fishSize}>{fish.avgSize} avg</Text>
                </View>
                <View style={styles.fishRightSection}>
                  <Text style={styles.depthLabel}>Depth</Text>
                  <Text style={styles.depth}>{fish.depth}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* RECOMMENDED GEAR SECTION */}
      {gearList.length > 0 && (
        <View style={styles.gearContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>🎽 BRING THIS GEAR</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Supplies')}>
              <Text style={styles.seeMore}>Shop Gear →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gearGrid}>
            {gearList.map((gear, idx) => (
              <View key={idx} style={styles.gearItem}>
                <View style={styles.gearIcon}>
                  <Text style={styles.gearEmoji}>
                    {gear.includes('Rod') || gear.includes('Reel') ? '🎣' :
                     gear.includes('Line') || gear.includes('Hook') ? '📏' :
                     gear.includes('Bait') || gear.includes('Plastic') ? '🪝' :
                     gear.includes('Spoon') || gear.includes('Spinner') ? '✨' :
                     gear.includes('Net') ? '🥅' : '📦'}
                  </Text>
                </View>
                <Text style={styles.gearName}>{gear}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* QUICK LINKS SECTION */}
      <View style={styles.quickLinksContainer}>
        <Text style={styles.sectionLabel}>EXPLORE</Text>
        
        <View style={styles.linkGrid}>
          <TouchableOpacity 
            style={[styles.linkCard, { borderLeftColor: '#1B5E20' }]}
            onPress={() => navigation.navigate('Map')}
          >
            <Feather name="map" size={28} color="#1B5E20" />
            <Text style={styles.linkLabel}>Fishing Waters</Text>
            <Text style={styles.linkSub}>11 locations</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkCard, { borderLeftColor: '#E65100' }]}
            onPress={() => navigation.navigate('Supplies')}
          >
            <Feather name="shopping-cart" size={28} color="#E65100" />
            <Text style={styles.linkLabel}>Local Suppliers</Text>
            <Text style={styles.linkSub}>Wisconsin brands</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* INFO BOXES */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Feather name="alert-circle" size={18} color="#01579B" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>License Required</Text>
            <Text style={styles.infoDesc}>Wisconsin fishing license required for all anglers</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={18} color="#E65100" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Check Regulations</Text>
            <Text style={styles.infoDesc}>Season dates and bag limits vary by species</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },

  // ============ TODAY'S WEATHER ============
  weatherContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 8,
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    letterSpacing: 0.5,
  },
  seeMore: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  weatherCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  weatherLeft: {
    flex: 1,
  },
  tempDisplay: {
    fontSize: 52,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 60,
  },
  condition: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#B8E6B8',
    marginTop: 2,
  },
  weatherRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  weatherEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  weatherDetails: {
    gap: 4,
  },
  detail: {
    fontSize: 12,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  fishingConditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
  },
  conditionText: {
    fontSize: 12,
    color: '#1B5E20',
  },

  // ============ IN-SEASON FISH ============
  inSeasonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fishCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fishCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fishNameSection: {
    flex: 1,
  },
  fishName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
  },
  fishSize: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  fishRightSection: {
    alignItems: 'flex-end',
  },
  depthLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  depth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 2,
  },

  // ============ RECOMMENDED GEAR ============
  gearContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  gearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gearItem: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  gearIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gearEmoji: {
    fontSize: 24,
  },
  gearName: {
    fontSize: 10,
    color: '#1B5E20',
    fontWeight: '600',
    textAlign: 'center',
  },

  // ============ QUICK LINKS ============
  quickLinksContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  linkGrid: {
    gap: 12,
  },
  linkCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
  },
  linkSub: {
    fontSize: 11,
    color: '#888',
  },

  // ============ INFO BOXES ============
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
});
