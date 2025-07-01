import { WeatherData, WeatherApiResponse, Location } from '../types/weather';

const API_KEY = 'dd73edfa91864ba7ac445105252806';
const BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherService {
  private transformApiResponse(data: WeatherApiResponse): WeatherData {
    return {
      location: {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region
      },
      current: {
        temp: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        icon: `https:${data.current.condition.icon}`,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        windDirection: data.current.wind_dir,
        pressure: Math.round(data.current.pressure_mb),
        visibility: Math.round(data.current.vis_km),
        uvIndex: data.current.uv,
        feelsLike: Math.round(data.current.feelslike_c)
      },
      forecast: data.forecast.forecastday.map(day => ({
        date: day.date,
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        condition: day.day.condition.text,
        icon: `https:${day.day.condition.icon}`,
        chanceOfRain: day.day.daily_chance_of_rain
      }))
    };
  }

  async getCurrentWeather(location: Location): Promise<WeatherData> {
    try {
      const query = location.name || `${location.lat},${location.lon}`;
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=5&aqi=no&alerts=no`
      );
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Invalid location. Please try a different search.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid or expired.');
        } else if (response.status === 403) {
          throw new Error('API key has exceeded the allowed quota.');
        } else {
          throw new Error('Weather data not available for this location.');
        }
      }
      
      const data: WeatherApiResponse = await response.json();
      return this.transformApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data. Please check your internet connection.');
    }
  }

  async searchLocation(query: string): Promise<Location[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key is invalid or expired.');
        }
        throw new Error('Location search failed.');
      }
      
      const data = await response.json();
      return data.map((item: any) => ({
        lat: item.lat,
        lon: item.lon,
        name: `${item.name}, ${item.region}, ${item.country}`
      })).slice(0, 5); // Limit to 5 results
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }
}

export const weatherService = new WeatherService();