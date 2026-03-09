import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinSupplies } from '../data/wisconsinSupplies';

export default function SuppliesScreen() {
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Rods', 'Reels', 'Fishing Line', 'Lures & Bait', 'Tackle Organization', 'Clothing'];

  const filteredSupplies = filterCategory === 'All' 
    ? wisconsinSupplies 
    : wisconsinSupplies.filter(s => s.category === filterCategory);

  const handleVisitLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wisconsin Fishing Supplies</Text>
        <Text style={styles.headerSubtitle}>Quality brands and local favorites</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, filterCategory === cat && styles.categoryButtonActive]}
            onPress={() => setFilterCategory(cat)}
          >
            <Text style={[styles.categoryButtonText, filterCategory === cat && styles.categoryButtonTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredSupplies.map((supply) => (
        <TouchableOpacity
          key={supply.id}
          style={[styles.supplyCard, selectedSupply?.id === supply.id && styles.supplyCardActive]}
          onPress={() => setSelectedSupply(selectedSupply?.id === supply.id ? null : supply)}
        >
          <View style={styles.supplyHeader}>
            <View style={styles.supplyInfo}>
              <Text style={styles.supplyName}>{supply.name}</Text>
              <Text style={styles.supplyBrand}>{supply.brand}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>★</Text>
                <Text style={styles.rating}>{supply.rating} • {supply.category}</Text>
              </View>
            </View>
            <Text style={styles.price}>{supply.price}</Text>
          </View>

          {selectedSupply?.id === supply.id && (
            <View style={styles.expandedContent}>
              <View style={styles.wisconsinBadge}>
                <Feather name="award" size={16} color="#1B5E20" />
                <Text style={styles.wisconsinText}>{supply.wisconsinConnection}</Text>
              </View>

              {supply.forFish.length > 0 && (
                <View style={styles.fishContainerSection}>
                  <Text style={styles.sectionTitle}>Best For:</Text>
                  <View style={styles.fishContainer}>
                    {supply.forFish.map((fish, idx) => (
                      <View key={idx} style={styles.fishBadge}>
                        <Text style={styles.fishBadgeText}>{fish}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={styles.visitButton}
                onPress={() => handleVisitLink(supply.link)}
              >
                <Feather name="external-link" size={18} color="#fff" />
                <Text style={styles.visitButtonText}>Visit Website</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.supportWisconsin}>
        <Feather name="heart" size={24} color="#E65100" />
        <View style={styles.supportText}>
          <Text style={styles.supportTitle}>Support Wisconsin</Text>
          <Text style={styles.supportDescription}>
            When possible, choose Wisconsin-based and Wisconsin-friendly fishing suppliers to support local businesses and the communities where you fish.
          </Text>
        </View>
      </View>

      <View style={styles.licenseReminder}>
        <Feather name="alert-circle" size={20} color="#01579B" />
        <View style={styles.licenseText}>
          <Text style={styles.licenseTitle}>Don't Forget Your License!</Text>
          <Text style={styles.licenseDescription}>
            A Wisconsin fishing license is required for all anglers. Get yours today from the DNR.
          </Text>
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
  header: {
    padding: 16,
    backgroundColor: '#1B5E20',
    paddingVertical: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  categoryScroll: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1B5E20',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#1B5E20',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  supplyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  supplyCardActive: {
    backgroundColor: '#F0F7F0',
    borderLeftColor: '#1B5E20',
  },
  supplyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supplyInfo: {
    flex: 1,
  },
  supplyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  supplyBrand: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingStars: {
    fontSize: 14,
    color: '#FFB300',
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'right',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  wisconsinBadge: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  wisconsinText: {
    fontSize: 12,
    color: '#1B5E20',
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  fishContainerSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  fishContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fishBadge: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  fishBadgeText: {
    fontSize: 11,
    color: '#1B5E20',
    fontWeight: '600',
  },
  visitButton: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  supportWisconsin: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E65100',
    alignItems: 'flex-start',
  },
  supportText: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  licenseReminder: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    margin: 12,
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#01579B',
    alignItems: 'flex-start',
  },
  licenseText: {
    flex: 1,
    marginLeft: 12,
  },
  licenseTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#01579B',
    marginBottom: 4,
  },
  licenseDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
