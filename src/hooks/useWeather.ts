import { useState, useEffect } from 'react';
import { WeatherData, Location } from '../types/weather';
import { weatherService } from '../services/weatherService';

export const useWeather = (location: Location | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc: Location) => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherService.getCurrentWeather(loc);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location]);

  const refetch = () => {
    if (location) {
      fetchWeather(location);
    }
  };

  return {
    weatherData,
    loading,
    error,
    refetch
  };
};