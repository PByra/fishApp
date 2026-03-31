import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import SeasonalScreen from './src/screens/SeasonalScreen';
import SuppliesScreen from './src/screens/SuppliesScreen';
import SearchNavigateScreen from './src/screens/SearchNavigateScreen';
import JournalScreen from './src/screens/JournalScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: 'home',
  Search: 'search',
  Map: 'map',
  Seasonal: 'calendar',
  Weather: 'cloud',
  Supplies: 'shopping-cart',
  Journal: 'book-open',
};

function AppNavigator() {
  const insets = useSafeAreaInsets();
  // Android gesture nav bar can be 0 (full gesture) to ~48dp (3-button).
  // Fall back to 16 minimum so labels don't hug the hardware edge.
  const bottomInset = Math.max(insets.bottom, 16);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICONS[route.name] || 'circle'} size={size} color={color} />
        ),
        tabBarActiveTintColor: '#3B4B48',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#F5F1E8',
          borderTopColor: '#E0D7CE',
          height: 58 + bottomInset,
          paddingBottom: 6 + bottomInset,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        // Map screen is full-bleed — let the screen itself manage its top inset
        // so the status bar doesn't clip the map or the filter bar
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}          options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search"   component={SearchNavigateScreen} options={{ tabBarLabel: 'Spots' }} />
      <Tab.Screen name="Map"      component={MapScreen}            options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="Seasonal" component={SeasonalScreen}       options={{ tabBarLabel: 'WI Fish' }} />
      <Tab.Screen name="Journal"  component={JournalScreen}        options={{ tabBarLabel: 'Journal' }} />
      <Tab.Screen name="Weather"  component={WeatherScreen}        options={{ tabBarLabel: 'Weather' }} />
      <Tab.Screen name="Supplies" component={SuppliesScreen}       options={{ tabBarLabel: 'Gear' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
