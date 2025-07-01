import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun,
  RefreshCw
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  loading: boolean;
  onRefresh: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, loading, onRefresh }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/15">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{weatherData.location.name}</h2>
            <p className="text-white/70">{weatherData.location.region}, {weatherData.location.country}</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={weatherData.current.icon} 
              alt={weatherData.current.condition}
              className="w-16 h-16"
            />
            <div>
              <div className="text-4xl font-bold text-white">{weatherData.current.temp}°C</div>
              <div className="text-white/70">{weatherData.current.condition}</div>
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-white/70 text-sm">Feels like</div>
            <div className="text-2xl text-white">{weatherData.current.feelsLike}°C</div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-300" />
              <span className="text-white/70 text-sm">Humidity</span>
            </div>
            <div className="text-white font-semibold">{weatherData.current.humidity}%</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-green-300" />
              <span className="text-white/70 text-sm">Wind</span>
            </div>
            <div className="text-white font-semibold">{weatherData.current.windSpeed} km/h</div>
            <div className="text-white/50 text-xs">{weatherData.current.windDirection}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-yellow-300" />
              <span className="text-white/70 text-sm">Pressure</span>
            </div>
            <div className="text-white font-semibold">{weatherData.current.pressure} mb</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-300" />
              <span className="text-white/70 text-sm">Visibility</span>
            </div>
            <div className="text-white font-semibold">{weatherData.current.visibility} km</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-orange-300" />
              <span className="text-white/70 text-sm">UV Index</span>
            </div>
            <div className="text-white font-semibold">{weatherData.current.uvIndex}</div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {weatherData.forecast.map((day, index) => (
            <div 
              key={day.date}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-white/70 w-16 text-sm">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </span>
                <img 
                  src={day.icon} 
                  alt={day.condition}
                  className="w-8 h-8"
                />
                <span className="text-white text-sm">{day.condition}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-blue-300">
                  <Droplets className="w-3 h-3" />
                  <span className="text-xs">{day.chanceOfRain}%</span>
                </div>
                <div className="text-white">
                  <span className="font-semibold">{day.maxTemp}°</span>
                  <span className="text-white/60 ml-1">{day.minTemp}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;