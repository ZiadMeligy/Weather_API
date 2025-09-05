import React from 'react';
import { ForecastDay } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherIcons';
import { Droplets, Wind, CloudRain } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastDay;
  unit: 'C' | 'F';
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, unit }) => {
  const WeatherIcon = getWeatherIcon(forecast.condition);
  
  const convertTemp = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : temp;
  };

  return (
    <div className="backdrop-blur-md bg-white/20 rounded-2xl p-5 border border-white/10 shadow-xl hover:bg-white/20 transition-all duration-300 group">
      <div className="text-center mb-4">
        <h3 className="text-white font-semibold text-lg mb-1">{forecast.dayName}</h3>
        <p className="text-white/70 text-sm">{new Date(forecast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>

      <div className="flex flex-col items-center mb-4">
        <WeatherIcon className="w-12 h-12 text-white mb-3 group-hover:scale-110 transition-transform duration-200" />
        <p className="text-white/90 text-sm mb-2 text-center">{forecast.condition}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-white/70 text-xs mb-1">High</p>
          <p className="text-white font-bold text-xl">{convertTemp(forecast.high)}°</p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-xs mb-1">Low</p>
          <p className="text-white/80 font-semibold text-lg">{convertTemp(forecast.low)}°</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-300" />
            <span className="text-white/80">Rain</span>
          </div>
          <span className="text-white font-medium">{forecast.precipitation}%</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span className="text-white/80">Humidity</span>
          </div>
          <span className="text-white font-medium">{forecast.humidity}%</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-300" />
            <span className="text-white/80">Wind</span>
          </div>
          <span className="text-white font-medium">{forecast.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};