// API keys
const OPENWEATHER_API_KEY = 'c1ebc435fc4c558d9501e772be6e7a35';
const RADAR_API_KEY = 'prj_live_pk_6660a43192d5efc2aceeaf662ade73a04a2ea0a4';

// Location interfaces
export interface LocationCoordinates {
  lat: number;
  lon: number;
  name: string;
}

export interface LocationSuggestion {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

// Save and retrieve location from localStorage
export const saveLocation = (location: LocationCoordinates): void => {
  localStorage.setItem('weatherLocation', JSON.stringify(location));
};

export const getStoredLocation = (): LocationCoordinates | null => {
  const location = localStorage.getItem('weatherLocation');
  return location ? JSON.parse(location) : null;
};

// Location search
export const searchLocationsByQuery = async (query: string): Promise<LocationSuggestion[]> => {
  // Check if input is a zip code (5 digits)
  const isZipCode = /^\d{5}$/.test(query);
  
  if (isZipCode) {
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${query},US&appid=${OPENWEATHER_API_KEY}`);
      const data = await response.json();
      if (data.name) {
        return [{
          city: data.name,
          state: '',
          country: 'US',
          latitude: data.lat,
          longitude: data.lon
        }];
      }
      return [];
    } catch (error) {
      console.error('Error fetching zip code data:', error);
      return [];
    }
  }
  
  // City search with Radar.io autocomplete
  try {
    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(query)}&layers=locality,address&country=US`, 
      {
        headers: {
          'Authorization': RADAR_API_KEY
        }
      }
    );
    const data = await response.json();
    
    if (data.addresses && data.addresses.length > 0) {
      return data.addresses.map((address: any) => ({
        city: address.city || '',
        state: address.state || '',
        country: address.country || 'US',
        latitude: address.latitude,
        longitude: address.longitude,
        formattedAddress: address.formattedAddress
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Get location from coordinates
export const getLocationFromCoordinates = async (lat: number, lon: number): Promise<LocationCoordinates | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat,
        lon,
        name: `${data[0].name}, ${data[0].country}`
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location from coordinates:', error);
    return null;
  }
};

// Weather data interfaces
export interface CurrentWeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_description: string;
  weather_icon: string;
  sunrise: number;
  sunset: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_description: string;
  weather_icon: string;
}

export interface DailyForecast {
  dt: number;
  temp_day: number;
  temp_night: number;
  humidity: number;
  wind_speed: number;
  weather_description: string;
  weather_icon: string;
  pop: number; // Probability of precipitation
}

// Fetch weather data
export const getCurrentWeather = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'imperial'): Promise<CurrentWeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_direction: data.wind.deg,
      weather_description: data.weather[0].description,
      weather_icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
};

export const getForecast = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'imperial'): Promise<{ hourly: HourlyForecast[], daily: DailyForecast[] } | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    // Process hourly forecast (first 8 items)
    const hourly = data.list.slice(0, 8).map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      weather_description: item.weather[0].description,
      weather_icon: item.weather[0].icon
    }));
    
    // Process daily forecast (group by day)
    const dailyMap = new Map();
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
      if (!dailyMap.has(date) || (new Date(item.dt * 1000).getHours() >= 12 && new Date(item.dt * 1000).getHours() <= 15)) {
        dailyMap.set(date, {
          dt: item.dt,
          temp_day: item.main.temp,
          temp_night: item.main.temp_min,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          weather_description: item.weather[0].description,
          weather_icon: item.weather[0].icon,
          pop: item.pop * 100
        });
      }
    });
    
    // Convert map to array and limit to 5 days
    const daily = Array.from(dailyMap.values()).slice(0, 5);
    
    return { hourly, daily };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
};

// Air Quality Index
export interface AirQualityData {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityData | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    return {
      aqi: data.list[0].main.aqi,
      co: data.list[0].components.co,
      no: data.list[0].components.no,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      so2: data.list[0].components.so2,
      pm2_5: data.list[0].components.pm2_5,
      pm10: data.list[0].components.pm10,
      nh3: data.list[0].components.nh3
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return null;
  }
};

// Weather Alerts
export interface WeatherAlert {
  headline: string;
  description: string;
  effective: string;
  expires: string;
  severity: string;
  certainty: string;
  urgency: string;
  areaDesc: string;
}

export async function getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/geo+json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts');
    }
    
    const data = await response.json();
    return data.features?.map((feature: any) => ({
      headline: feature.properties.headline,
      description: feature.properties.description,
      effective: feature.properties.effective,
      expires: feature.properties.expires,
      severity: feature.properties.severity,
      certainty: feature.properties.certainty,
      urgency: feature.properties.urgency,
      areaDesc: feature.properties.areaDesc
    })) || [];
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return [];
  }
}

// Temperature unit utilities
export const setTemperatureUnit = (unit: 'celsius' | 'fahrenheit'): void => {
  localStorage.setItem('temperatureUnit', unit);
};

export const getTemperatureUnit = (): 'celsius' | 'fahrenheit' => {
  return (localStorage.getItem('temperatureUnit') as 'celsius' | 'fahrenheit') || 'fahrenheit';
};

export const convertTemperature = (temp: number, toUnit?: 'celsius' | 'fahrenheit'): number => {
  const unit = toUnit || getTemperatureUnit();
  if (unit === 'celsius') {
    return Math.round((temp - 32) * 5 / 9);
  }
  return Math.round(temp);
}; 