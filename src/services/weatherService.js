/**
 * Live weather via Open-Meteo (free, no API key)
 * Returns a 7-day FORECAST array in the same shape used by WeatherScreen/HomeScreen.
 */

const DEFAULT_LAT = 43.0389;
const DEFAULT_LNG = -87.9065;

// WMO Weather Interpretation Codes → display values
const WMO = {
  0:  { condition: 'Clear',          emoji: '☀️' },
  1:  { condition: 'Mostly Clear',   emoji: '🌤️' },
  2:  { condition: 'Partly Cloudy',  emoji: '⛅' },
  3:  { condition: 'Overcast',       emoji: '☁️' },
  45: { condition: 'Foggy',          emoji: '🌫️' },
  48: { condition: 'Freezing Fog',   emoji: '🌫️' },
  51: { condition: 'Light Drizzle',  emoji: '🌦️' },
  53: { condition: 'Drizzle',        emoji: '🌦️' },
  55: { condition: 'Heavy Drizzle',  emoji: '🌧️' },
  61: { condition: 'Light Rain',     emoji: '🌧️' },
  63: { condition: 'Rainy',          emoji: '🌧️' },
  65: { condition: 'Heavy Rain',     emoji: '🌧️' },
  71: { condition: 'Light Snow',     emoji: '🌨️' },
  73: { condition: 'Snowy',          emoji: '🌨️' },
  75: { condition: 'Heavy Snow',     emoji: '❄️' },
  77: { condition: 'Snow Grains',    emoji: '🌨️' },
  80: { condition: 'Showers',        emoji: '🌦️' },
  81: { condition: 'Rain Showers',   emoji: '🌧️' },
  82: { condition: 'Heavy Showers',  emoji: '🌧️' },
  85: { condition: 'Snow Showers',   emoji: '🌨️' },
  86: { condition: 'Heavy Snow',     emoji: '❄️' },
  95: { condition: 'Thunderstorm',   emoji: '⛈️' },
  96: { condition: 'Thunderstorm',   emoji: '⛈️' },
  99: { condition: 'Thunderstorm',   emoji: '⛈️' },
};

function fishingRating(wmo, wind, high) {
  if ([95, 96, 99, 65, 75, 82, 86].includes(wmo) || wind > 25)
    return { fishing: 'Poor',      fishingColor: '#F44336' };
  if ([61, 63, 73, 80, 81, 85, 55].includes(wmo) || wind > 18)
    return { fishing: 'Fair',      fishingColor: '#FF9800' };
  if ([0, 1, 2].includes(wmo) && wind < 12 && high > 40)
    return { fishing: 'Excellent', fishingColor: '#2E7D32' };
  if ([0, 1, 2, 3, 51, 53].includes(wmo) && wind < 18)
    return { fishing: 'Good',      fishingColor: '#4CAF50' };
  return { fishing: 'Fair', fishingColor: '#FF9800' };
}

const DIRS  = ['N','NE','E','SE','S','SW','W','NW'];
const DAYS  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const ABBRS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const degToDir = (deg) => DIRS[Math.round((deg % 360) / 45) % 8];

export async function fetchWeather(lat = DEFAULT_LAT, lng = DEFAULT_LNG) {
  const params = [
    `latitude=${lat}`,
    `longitude=${lng}`,
    'daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,wind_speed_10m_max,wind_direction_10m_dominant,relative_humidity_2m_mean',
    'wind_speed_unit=mph',
    'temperature_unit=fahrenheit',
    'timezone=America%2FChicago',
    'forecast_days=7',
  ].join('&');

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const { daily } = await res.json();

  return daily.time.map((isoDate, i) => {
    const d    = new Date(isoDate + 'T12:00:00');
    const wmo  = daily.weather_code[i];
    const info = WMO[wmo] ?? { condition: 'Unknown', emoji: '🌡️' };
    const high = Math.round(daily.temperature_2m_max[i]);
    const low  = Math.round(daily.temperature_2m_min[i]);
    const wind = Math.round(daily.wind_speed_10m_max[i]);
    const { fishing, fishingColor } = fishingRating(wmo, wind, high);

    return {
      label:       i === 0 ? 'Today'  : DAYS[d.getDay()],
      abbr:        i === 0 ? 'TODAY'  : ABBRS[d.getDay()],
      date:        `${MONS[d.getMonth()]} ${d.getDate()}`,
      high,
      low,
      feelsLike:   Math.round(daily.apparent_temperature_max[i]),
      condition:   info.condition,
      emoji:       info.emoji,
      wind,
      windDir:     degToDir(daily.wind_direction_10m_dominant[i]),
      humidity:    Math.round(daily.relative_humidity_2m_mean[i]),
      fishing,
      fishingColor,
    };
  });
}
