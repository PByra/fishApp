import axios from 'axios';

// Weather service - can be expanded with real API integration (OpenWeatherMap, NOAA)
class WeatherService {
  constructor() {
    // Replace with your API key
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(latitude, longitude) {
    try {
      // For now, return mock data
      // To integrate real weather, uncomment below and add your API key
      
      /*
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'imperial'
        }
      });
      
      return {
        temperature: response.data.main.temp,
        condition: response.data.weather[0].main,
        windSpeed: response.data.wind.speed,
        windDirection: this.getWindDirection(response.data.wind.deg),
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        uvIndex: await this.getUVIndex(latitude, longitude)
      };
      */
      
      return {
        temperature: 58,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        windDirection: 'NW',
        humidity: 65,
        pressure: 1013,
        uvIndex: 4
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  }

  async getForecast(latitude, longitude) {
    try {
      // Mock forecast data
      return [
        { day: 'Monday', high: 62, low: 48, condition: 'Sunny' },
        { day: 'Tuesday', high: 65, low: 50, condition: 'Cloudy' },
        { day: 'Wednesday', high: 58, low: 45, condition: 'Rainy' },
        { day: 'Thursday', high: 60, low: 48, condition: 'Partly Cloudy' },
        { day: 'Friday', high: 68, low: 52, condition: 'Sunny' },
      ];
    } catch (error) {
      console.error('Forecast API error:', error);
      throw error;
    }
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  async getUVIndex(latitude, longitude) {
    try {
      // Mock UV index
      return 4;
    } catch (error) {
      console.error('UV Index API error:', error);
      return 3;
    }
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
      condition = 'Good';
      recommendation = 'Light winds are ideal for most techniques.';
    }

    if (weather.condition.includes('Rain')) {
      condition = 'Excellent';
      recommendation = 'Fish are more active during rain.';
    } else if (weather.condition.includes('Cloud')) {
      if (condition !== 'Excellent') {
        condition = 'Good';
        recommendation = 'Overcast condition is ideal for fishing.';
      }
    }

    return { condition, recommendation };
  }
}

export default new WeatherService();
