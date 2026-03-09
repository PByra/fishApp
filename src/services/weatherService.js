// Weather service - using mock data to avoid API crashes
// In production, integrate with NOAA or Weather.gov API

class WeatherService {
  constructor() {
    // Wisconsin weather patterns by location
    this.wisconsinWeatherProfiles = {
      'madison': {
        temperature: 58,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        windDirection: 'NW',
        humidity: 65,
        pressure: 1013,
        uvIndex: 4
      },
      'green_bay': {
        temperature: 55,
        condition: 'Cloudy',
        windSpeed: 14,
        windDirection: 'NE',
        humidity: 70,
        pressure: 1010,
        uvIndex: 3
      },
      'lake_michigan': {
        temperature: 52,
        condition: 'Cloudy',
        windSpeed: 16,
        windDirection: 'E',
        humidity: 75,
        pressure: 1012,
        uvIndex: 2
      }
    };

    this.mockForecast = [
      { day: 'Monday', high: 62, low: 48, condition: 'Sunny', windSpeed: 8, fishingRating: '⭐⭐⭐⭐' },
      { day: 'Tuesday', high: 65, low: 50, condition: 'Cloudy', windSpeed: 10, fishingRating: '⭐⭐⭐⭐⭐' },
      { day: 'Wednesday', high: 58, low: 45, condition: 'Rainy', windSpeed: 15, fishingRating: '⭐⭐⭐⭐' },
      { day: 'Thursday', high: 60, low: 48, condition: 'Partly Cloudy', windSpeed: 12, fishingRating: '⭐⭐⭐' },
      { day: 'Friday', high: 68, low: 52, condition: 'Sunny', windSpeed: 6, fishingRating: '⭐⭐' },
    ];
  }

  async getCurrentWeather(latitude, longitude) {
    try {
      // Determine Wisconsin region and return appropriate mock data
      let region = 'madison'; // default
      
      if (latitude > 44.5) {
        region = 'green_bay';
      } else if (longitude < -87.5) {
        region = 'lake_michigan';
      }
      
      return this.wisconsinWeatherProfiles[region];
    } catch (error) {
      console.warn('Weather service error, using default:', error.message);
      return this.wisconsinWeatherProfiles['madison'];
    }
  }

  async getForecast(latitude, longitude) {
    try {
      return this.mockForecast;
    } catch (error) {
      console.warn('Forecast error:', error.message);
      return this.mockForecast;
    }
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  // Determine if conditions are good for fishing
  getFishingCondition(weather) {
    let condition = 'Good';
    let recommendation = '';

    if (weather.windSpeed > 20) {
      condition = 'Poor';
      recommendation = 'High winds make casting difficult.';
    } else if (weather.windSpeed > 15) {
      condition = 'Fair';
      recommendation = 'Moderate winds - okay for fishing.';
    } else if (weather.windSpeed < 5) {
      condition = 'Excellent';
      recommendation = 'Calm conditions - ideal for most techniques.';
    } else {
      condition = 'Good';
      recommendation = 'Decent conditions for fishing.';
    }

    if (weather.condition.includes('Rain')) {
      condition = 'Excellent';
      recommendation = 'Fish are more active during light rain!';
    } else if (weather.condition.includes('Cloud')) {
      if (condition !== 'Excellent') {
        condition = 'Excellent';
        recommendation = 'Overcast conditions are perfect for fishing!';
      }
    } else if (weather.condition.includes('Sunny')) {
      if (condition !== 'Excellent') {
        condition = 'Fair';
        recommendation = 'Fish may be deeper due to sunlight.';
      }
    }

    return { condition, recommendation };
  }
}

export default new WeatherService();
