import { Sun, Cloud, CloudRain, CloudSnow, Zap, CloudDrizzle, Eye, EyeOff, DivideIcon as LucideIcon } from 'lucide-react';

export const getWeatherIcon = (condition: string): LucideIcon => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return Sun;
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return CloudRain;
  } else if (conditionLower.includes('drizzle')) {
    return CloudDrizzle;
  } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return CloudSnow;
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return Zap;
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return EyeOff;
  } else {
    return Cloud;
  }
};

export const getBackgroundGradient = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return 'from-blue-400 via-blue-500 to-blue-600';
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return 'from-cyan-900 via-blue-400 to-cyan-300';
  } else if (conditionLower.includes('snow')) {
    return 'from-blue-200 via-blue-300 to-blue-400';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return 'from-purple-600 via-purple-700 to-purple-800';
  } else if (conditionLower.includes('cloud')) {
    return 'from-gray-400 via-gray-500 to-gray-600';
  } else {
    return 'from-blue-400 via-blue-500 to-blue-600';
  }
};