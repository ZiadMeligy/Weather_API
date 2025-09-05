import React from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherIcons';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sun, 
  Sunrise, 
  Sunset 
} from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'C' | 'F';
  onUnitToggle: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  weather, 
  unit, 
  onUnitToggle 
}) => {
  const WeatherIcon = getWeatherIcon(weather.condition);
  
  const convertTemp = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : temp;
  };

  const metrics = [
    { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
    { icon: Wind, label: 'Wind Speed', value: `${weather.windSpeed} km/h` },
    { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa` },
    { icon: Eye, label: 'Visibility', value: `${weather.visibility} km` },
    { icon: Sun, label: 'UV Index', value: weather.uvIndex.toString() },
  ];

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{weather.location}</h1>
          <p className="text-white/80">{weather.country}</p>
        </div>
        <button
          onClick={onUnitToggle}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-white font-medium transition-all duration-200"
        >
          °{unit}
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <WeatherIcon className="w-16 h-16 text-white" />
          <div>
            <p className="text-5xl font-bold text-white">
              {convertTemp(weather.temperature)}°
            </p>
            <p className="text-white/90 text-lg">{weather.condition}</p>
            <p className="text-white/70 text-sm">{weather.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-200"
          >
            <metric.icon className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-white/80 text-xs mb-1">{metric.label}</p>
            <p className="text-white font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Sunrise className="w-5 h-5 text-yellow-300" />
          <div>
            <p className="text-white/80 text-sm">Sunrise</p>
            <p className="text-white font-medium">{weather.sunrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sunset className="w-5 h-5 text-orange-300" />
          <div>
            <p className="text-white/80 text-sm">Sunset</p>
            <p className="text-white font-medium">{weather.sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
};