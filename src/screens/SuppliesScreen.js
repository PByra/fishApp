import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinSupplies } from '../data/wisconsinSupplies';
import { colors, spacing, shadows, typography } from '../theme/colors';

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
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary.forest,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.accent.wasabi,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  categoryScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral.white,
    marginBottom: spacing.md,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 198, 159, 0.15)',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent.wasabi,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  categoryButtonText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  categoryButtonTextActive: {
    color: colors.neutral.white,
  },
  supplyCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 24,
    padding: spacing.md,
    ...shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.wasabi,
    minHeight: 56,
  },
  supplyCardActive: {
    backgroundColor: '#f9f8f6',
    borderLeftColor: colors.accent.persimmon,
  },
  supplyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supplyInfo: {
    flex: 1,
  },
  supplyName: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.primary.forest,
    letterSpacing: 0.3,
  },
  supplyBrand: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingStars: {
    fontSize: 14,
    color: '#FFB300',
    marginRight: spacing.xs,
  },
  rating: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    fontWeight: '500',
  },
  price: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.accent.persimmon,
    textAlign: 'right',
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.borderLight,
  },
  wisconsinBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(168, 198, 159, 0.1)',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.wasabi,
  },
  wisconsinText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    marginLeft: spacing.md,
    flex: 1,
    fontWeight: '600',
  },
  fishContainerSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  fishContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fishBadge: {
    backgroundColor: '#F9F8F6',
    borderColor: colors.accent.wasabi,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  fishBadgeText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.forest,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  visitButton: {
    backgroundColor: colors.accent.persimmon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    minHeight: 48,
  },
  visitButtonText: {
    color: colors.neutral.white,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginLeft: spacing.sm,
    letterSpacing: 0.3,
  },
  supportWisconsin: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F2',
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.persimmon,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  supportText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  supportTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.accent.persimmon,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  supportDescription: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
  licenseReminder: {
    flexDirection: 'row',
    backgroundColor: 'rgba(168, 198, 159, 0.1)',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.wasabi,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  licenseText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  licenseTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.accent.wasabi,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  licenseDescription: {
    fontSize: typography.caption.fontSize,
    color: colors.neutral.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
});
