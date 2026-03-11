import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wisconsinLocations, getRegions, searchLocations } from '../data/wisconsinWaters';
import { launchNavigation } from '../services/navigationService';
import darkForestTheme from '../theme/darkForest';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const isFlip3 = screenHeight / screenWidth > 2; // 22:9 aspect ratio detection

export default function SearchNavigateScreen({ navigation }) {
  const [selectedRegion, setSelectedRegion] = useState('Milwaukee Shore');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpot, setActiveSpot] = useState(null);

  // Filter locations by region and search query
  const filteredLocations = useMemo(() => {
    let locations = wisconsinLocations.filter(
      loc => loc.region.includes('Milwaukee') || loc.region === selectedRegion
    );

    if (selectedRegion.includes('Mauston')) {
      locations = wisconsinLocations.filter(loc => loc.region === 'Mauston');
    }

    if (searchQuery.trim()) {
      locations = searchLocations(searchQuery).filter(loc => {
        if (selectedRegion.includes('Mauston')) {
          return loc.region === 'Mauston';
        }
        return loc.region.includes('Milwaukee') || loc.region === selectedRegion;
      });
    }

    return locations;
  }, [selectedRegion, searchQuery]);

  const handleNavigation = async (location) => {
    setActiveSpot(location);
    await launchNavigation(location.query, location.name);
  };

  const renderLocationCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.locationCard,
        activeSpot?.id === item.id && styles.locationCardActive,
        { marginRight: (index + 1) % 2 === 0 ? 0 : styles.spacing.md },
      ]}
      onPress={() => setActiveSpot(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.accessPoint}>{item.accessPoint}</Text>
        </View>
        <View style={[styles.difficultyBadge, getDifficultyStyle(item.difficulty)]}>
          <Text style={styles.difficultyText}>{item.difficulty[0]}</Text>
        </View>
      </View>

      <View style={styles.fishList}>
        {item.fish.slice(0, 2).map((f, idx) => (
          <View key={idx} style={styles.fishTag}>
            <Text style={styles.fishTagText}>{f}</Text>
          </View>
        ))}
        {item.fish.length > 2 && (
          <Text style={styles.fishMore}>+{item.fish.length - 2}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.goFishButton}
        onPress={() => handleNavigation(item)}
        activeOpacity={0.8}
      >
        <Feather name="navigation" size={20} color={darkForestTheme.text.primary} />
        <Text style={styles.goFishText}>GO FISH</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return { backgroundColor: darkForestTheme.status.active };
      case 'Intermediate':
        return { backgroundColor: darkForestTheme.accent.burnt_orange };
      case 'Hard':
        return { backgroundColor: darkForestTheme.status.error };
      default:
        return { backgroundColor: darkForestTheme.text.secondary };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SEARCH & FISH</Text>
        <Text style={styles.headerSubtitle}>
          {filteredLocations.length} spots near you
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color={darkForestTheme.text.secondary}
          style={styles.searchIcon}
        />
        <TouchableOpacity
          style={styles.searchInput}
          onPress={() => {}}
        >
          <Text
            style={[
              styles.searchPlaceholder,
              searchQuery && styles.searchText,
            ]}
          >
            {searchQuery || 'Search by name or fish...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Region Filter Toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRegion.includes('Milwaukee') && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedRegion('Milwaukee Shore')}
        >
          <Feather
            name="map-pin"
            size={16}
            color={
              selectedRegion.includes('Milwaukee')
                ? darkForestTheme.accent.burnt_orange
                : darkForestTheme.text.secondary
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              selectedRegion.includes('Milwaukee') &&
                styles.filterButtonTextActive,
            ]}
          >
            Milwaukee
          </Text>
          <Text style={styles.filterDistance}>45 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRegion === 'Mauston' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedRegion('Mauston')}
        >
          <Feather
            name="map-pin"
            size={16}
            color={
              selectedRegion === 'Mauston'
                ? darkForestTheme.accent.burnt_orange
                : darkForestTheme.text.secondary
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              selectedRegion === 'Mauston' && styles.filterButtonTextActive,
            ]}
          >
            Mauston
          </Text>
          <Text style={styles.filterDistance}>90 min</Text>
        </TouchableOpacity>
      </View>

      {/* Active Spot (Flip 3 Optimization) */}
      {activeSpot && isFlip3 && (
        <View style={styles.activeSectionFlip3}>
          <Text style={styles.activeSectionTitle}>CURRENT SPOT</Text>
          <View style={styles.activeSpotCard}>
            <View style={styles.activeSpotInfo}>
              <Text style={styles.activeSpotName}>{activeSpot.name}</Text>
              <View style={styles.activeSpotMeta}>
                <Feather name="navigation" size={14} color={darkForestTheme.accent.burnt_orange} />
                <Text style={styles.activeSpotMetaText}>{activeSpot.accessPoint}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.activeGoFishButton}
              onPress={() => handleNavigation(activeSpot)}
            >
              <Text style={styles.activeGoFishText}>GO FISH →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Location Grid - Bento Box Layout */}
      <Text style={styles.sectionLabel}>NEARBY SPOTS</Text>
      <FlatList
        data={filteredLocations}
        keyExtractor={item => item.id.toString()}
        renderItem={renderLocationCard}
        numColumns={2}
        scrollEnabled={!isFlip3} // Disable scroll if in Flex Mode list
        style={styles.grid}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkForestTheme.background.primary,
  },

  // Header Styles
  header: {
    backgroundColor: darkForestTheme.background.secondary,
    paddingHorizontal: darkForestTheme.spacing.lg,
    paddingTop: darkForestTheme.spacing.lg,
    paddingBottom: darkForestTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkForestTheme.background.tertiary,
  },
  headerTitle: {
    fontSize: darkForestTheme.typography.heading.size,
    fontWeight: '700',
    color: darkForestTheme.accent.burnt_orange,
    letterSpacing: 1,
    marginBottom: darkForestTheme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: darkForestTheme.typography.body.size,
    color: darkForestTheme.text.secondary,
    fontWeight: '500',
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: darkForestTheme.spacing.lg,
    marginVertical: darkForestTheme.spacing.md,
    backgroundColor: darkForestTheme.background.secondary,
    borderRadius: darkForestTheme.borderRadius.medium,
    paddingLeft: darkForestTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkForestTheme.background.tertiary,
  },
  searchIcon: {
    marginRight: darkForestTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: darkForestTheme.spacing.md,
    paddingHorizontal: darkForestTheme.spacing.sm,
  },
  searchPlaceholder: {
    color: darkForestTheme.text.tertiary,
    fontSize: darkForestTheme.typography.body.size,
  },
  searchText: {
    color: darkForestTheme.text.primary,
    fontWeight: '600',
  },

  // Filter Container
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: darkForestTheme.spacing.lg,
    marginBottom: darkForestTheme.spacing.lg,
    gap: darkForestTheme.spacing.md,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkForestTheme.background.secondary,
    borderRadius: darkForestTheme.borderRadius.medium,
    paddingVertical: darkForestTheme.spacing.md,
    paddingHorizontal: darkForestTheme.spacing.sm,
    borderWidth: 2,
    borderColor: darkForestTheme.background.tertiary,
    gap: darkForestTheme.spacing.sm,
  },
  filterButtonActive: {
    borderColor: darkForestTheme.accent.burnt_orange,
    backgroundColor: `${darkForestTheme.accent.burnt_orange}15`,
  },
  filterButtonText: {
    fontSize: darkForestTheme.typography.button.size - 2,
    fontWeight: '700',
    color: darkForestTheme.text.secondary,
  },
  filterButtonTextActive: {
    color: darkForestTheme.accent.burnt_orange,
  },
  filterDistance: {
    fontSize: darkForestTheme.typography.caption.size,
    color: darkForestTheme.text.tertiary,
    fontWeight: '500',
  },

  // Active Section (Flip 3 Only)
  activeSectionFlip3: {
    paddingHorizontal: darkForestTheme.spacing.lg,
    paddingVertical: darkForestTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkForestTheme.background.tertiary,
  },
  activeSectionTitle: {
    fontSize: darkForestTheme.typography.caption.size,
    fontWeight: '700',
    color: darkForestTheme.accent.burnt_orange,
    letterSpacing: 0.5,
    marginBottom: darkForestTheme.spacing.sm,
  },
  activeSpotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkForestTheme.background.secondary,
    borderRadius: darkForestTheme.borderRadius.large,
    padding: darkForestTheme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: darkForestTheme.accent.burnt_orange,
  },
  activeSpotInfo: {
    flex: 1,
  },
  activeSpotName: {
    fontSize: darkForestTheme.typography.body.size,
    fontWeight: '700',
    color: darkForestTheme.text.primary,
    marginBottom: darkForestTheme.spacing.xs,
  },
  activeSpotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkForestTheme.spacing.xs,
  },
  activeSpotMetaText: {
    fontSize: darkForestTheme.typography.caption.size,
    color: darkForestTheme.text.secondary,
    fontWeight: '500',
  },
  activeGoFishButton: {
    backgroundColor: darkForestTheme.accent.burnt_orange,
    borderRadius: darkForestTheme.borderRadius.medium,
    paddingHorizontal: darkForestTheme.spacing.md,
    paddingVertical: darkForestTheme.spacing.sm,
  },
  activeGoFishText: {
    color: darkForestTheme.text.primary,
    fontWeight: '700',
    fontSize: darkForestTheme.typography.caption.size + 1,
    letterSpacing: 0.5,
  },

  // Location Card
  locationCard: {
    flex: 1,
    backgroundColor: darkForestTheme.background.secondary,
    borderRadius: darkForestTheme.borderRadius.large,
    padding: darkForestTheme.spacing.md,
    marginBottom: darkForestTheme.spacing.md,
    ...darkForestTheme.shadow.medium,
    borderWidth: 1,
    borderColor: darkForestTheme.background.tertiary,
    minHeight: 200,
  },
  locationCardActive: {
    borderColor: darkForestTheme.accent.burnt_orange,
    backgroundColor: `${darkForestTheme.accent.burnt_orange}10`,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: darkForestTheme.spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  locationName: {
    fontSize: darkForestTheme.typography.subheading.size - 4,
    fontWeight: '700',
    color: darkForestTheme.text.primary,
    marginBottom: darkForestTheme.spacing.xs,
  },
  accessPoint: {
    fontSize: darkForestTheme.typography.caption.size,
    color: darkForestTheme.text.secondary,
    fontWeight: '500',
  },

  // Difficulty Badge
  difficultyBadge: {
    width: 32,
    height: 32,
    borderRadius: darkForestTheme.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    ...darkForestTheme.shadow.small,
  },
  difficultyText: {
    color: darkForestTheme.text.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  // Fish List
  fishList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: darkForestTheme.spacing.xs,
    marginBottom: darkForestTheme.spacing.md,
    flex: 1,
  },
  fishTag: {
    backgroundColor: `${darkForestTheme.accent.burnt_orange}20`,
    borderRadius: darkForestTheme.borderRadius.small,
    paddingHorizontal: darkForestTheme.spacing.sm,
    paddingVertical: darkForestTheme.spacing.xs,
    borderWidth: 1,
    borderColor: `${darkForestTheme.accent.burnt_orange}40`,
  },
  fishTagText: {
    fontSize: darkForestTheme.typography.caption.size - 1,
    color: darkForestTheme.accent.burnt_orange,
    fontWeight: '600',
  },
  fishMore: {
    fontSize: darkForestTheme.typography.caption.size - 1,
    color: darkForestTheme.text.tertiary,
    fontWeight: '600',
    alignSelf: 'center',
  },

  // GO FISH Button
  goFishButton: {
    backgroundColor: darkForestTheme.accent.burnt_orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkForestTheme.borderRadius.medium,
    paddingVertical: darkForestTheme.spacing.md,
    gap: darkForestTheme.spacing.sm,
    ...darkForestTheme.shadow.medium,
  },
  goFishText: {
    color: darkForestTheme.text.primary,
    fontWeight: '700',
    fontSize: darkForestTheme.typography.button.size - 2,
    letterSpacing: 1,
  },

  // Grid Layout
  sectionLabel: {
    fontSize: darkForestTheme.typography.caption.size,
    fontWeight: '700',
    color: darkForestTheme.accent.burnt_orange,
    letterSpacing: 0.5,
    marginHorizontal: darkForestTheme.spacing.lg,
    marginBottom: darkForestTheme.spacing.md,
  },
  grid: {
    paddingHorizontal: darkForestTheme.spacing.lg,
  },
  gridRow: {
    gap: darkForestTheme.spacing.md,
  },
  gridContent: {
    paddingBottom: darkForestTheme.spacing.xl,
  },
  spacing: darkForestTheme.spacing,
});
