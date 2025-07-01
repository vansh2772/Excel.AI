export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    feelsLike: number;
  };
  forecast: DayForecast[];
}

export interface DayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  chanceOfRain: number;
}

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    vis_km: number;
    uv: number;
    feelslike_c: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
      };
    }>;
  };
}