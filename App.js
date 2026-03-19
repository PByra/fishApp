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

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: 'home',
  Search: 'search',
  Seasonal: 'calendar',
  Weather: 'cloud',
  Supplies: 'shopping-cart',
  Journal: 'book-open',
};

function AppNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 24;
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
          height: 60 + bottomInset,
          paddingBottom: 8 + bottomInset,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search" component={SearchNavigateScreen} options={{ tabBarLabel: 'Spots' }} />
      <Tab.Screen name="Seasonal" component={SeasonalScreen} options={{ tabBarLabel: 'WI Fish' }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ tabBarLabel: 'Journal' }} />
      <Tab.Screen name="Weather" component={WeatherScreen} options={{ tabBarLabel: 'Weather' }} />
      <Tab.Screen name="Supplies" component={SuppliesScreen} options={{ tabBarLabel: 'Gear' }} />
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
