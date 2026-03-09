import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import SeasonalScreen from './src/screens/SeasonalScreen';
import SuppliesScreen from './src/screens/SuppliesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map';
            } else if (route.name === 'Weather') {
              iconName = focused ? 'cloud' : 'cloud';
            } else if (route.name === 'Seasonal') {
              iconName = focused ? 'calendar' : 'calendar';
            } else if (route.name === 'Supplies') {
              iconName = focused ? 'shopping-cart' : 'shopping-cart';
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1B5E20',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#F5F1E8',
            borderTopColor: '#E0D7CE',
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1B5E20',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Wisconsin Fishing' }} />
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Fish Map' }} />
        <Tab.Screen name="Weather" component={WeatherScreen} options={{ title: 'Forecast' }} />
        <Tab.Screen name="Seasonal" component={SeasonalScreen} options={{ title: 'In Season' }} />
        <Tab.Screen name="Supplies" component={SuppliesScreen} options={{ title: 'Gear' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
