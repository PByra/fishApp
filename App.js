import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
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
            if (route.name === 'Map') {
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
          tabBarActiveTintColor: '#004E89',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#004E89',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Fish Map' }} />
        <Tab.Screen name="Weather" component={WeatherScreen} options={{ title: 'Weather' }} />
        <Tab.Screen name="Seasonal" component={SeasonalScreen} options={{ title: 'In Season' }} />
        <Tab.Screen name="Supplies" component={SuppliesScreen} options={{ title: 'Supplies' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
