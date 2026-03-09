import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to Wisconsin Fishing App</Text>
        <Text style={styles.welcomeSubtitle}>
          Your guide to fishing Wisconsin's best waters
        </Text>
      </View>
      
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🗺️</Text>
          <Text style={styles.featureName}>Fish Map</Text>
          <Text style={styles.featureDesc}>Explore Wisconsin waters</Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🌤️</Text>
          <Text style={styles.featureName}>Weather</Text>
          <Text style={styles.featureDesc}>Real-time conditions</Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>📅</Text>
          <Text style={styles.featureName}>Seasonal</Text>
          <Text style={styles.featureDesc}>What's in season</Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🛍️</Text>
          <Text style={styles.featureName}>Supplies</Text>
          <Text style={styles.featureDesc}>Wisconsin gear & brands</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeCard: {
    backgroundColor: '#004E89',
    padding: 24,
    margin: 12,
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 8,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    margin: 6,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
