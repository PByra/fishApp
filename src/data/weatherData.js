/**
 * Shared weather data for Milwaukee, WI
 * Both HomeScreen and WeatherScreen import from here — single source of truth.
 * Replace this array with a live API call (OpenWeatherMap / NOAA) in v2.
 */
export const FORECAST = [
  {
    label: 'Today', abbr: 'THU', date: 'Mar 12',
    high: 38, low: 30, feelsLike: 32,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 12, windDir: 'NW', humidity: 68,
    fishing: 'Fair', fishingColor: '#FF9800',
  },
  {
    label: 'Friday', abbr: 'FRI', date: 'Mar 13',
    high: 42, low: 33, feelsLike: 38,
    condition: 'Mostly Sunny', emoji: '🌤️',
    wind: 8, windDir: 'W', humidity: 55,
    fishing: 'Good', fishingColor: '#4CAF50',
  },
  {
    label: 'Saturday', abbr: 'SAT', date: 'Mar 14',
    high: 46, low: 35, feelsLike: 43,
    condition: 'Sunny', emoji: '☀️',
    wind: 6, windDir: 'SW', humidity: 52,
    fishing: 'Excellent', fishingColor: '#2E7D32',
  },
  {
    label: 'Sunday', abbr: 'SUN', date: 'Mar 15',
    high: 49, low: 37, feelsLike: 44,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 11, windDir: 'S', humidity: 60,
    fishing: 'Good', fishingColor: '#4CAF50',
  },
  {
    label: 'Monday', abbr: 'MON', date: 'Mar 16',
    high: 44, low: 36, feelsLike: 38,
    condition: 'Rainy', emoji: '🌧️',
    wind: 17, windDir: 'NE', humidity: 82,
    fishing: 'Fair', fishingColor: '#FF9800',
  },
  {
    label: 'Tuesday', abbr: 'TUE', date: 'Mar 17',
    high: 36, low: 28, feelsLike: 29,
    condition: 'Cloudy', emoji: '☁️',
    wind: 15, windDir: 'N', humidity: 75,
    fishing: 'Poor', fishingColor: '#F44336',
  },
  {
    label: 'Wednesday', abbr: 'WED', date: 'Mar 18',
    high: 40, low: 31, feelsLike: 35,
    condition: 'Partly Cloudy', emoji: '⛅',
    wind: 9, windDir: 'NW', humidity: 65,
    fishing: 'Fair', fishingColor: '#FF9800',
  },
];

export const TODAY = FORECAST[0];
