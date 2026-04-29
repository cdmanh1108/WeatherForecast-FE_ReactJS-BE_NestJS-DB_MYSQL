import React from 'react';
import { Card } from '../ui/card';
import { 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  Sun
} from 'lucide-react';
import { formatTemperature } from '../../utils/formatters';

interface WeatherCardProps {
  condition: string;
  temperature: number;
  description?: string;
  large?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  condition,
  temperature,
  description,
  large = false,
}) => {
  const getWeatherIcon = (condition: string) => {
    const iconProps = { className: large ? 'h-24 w-24' : 'h-12 w-12' };
    
    switch (condition) {
      case 'Clear':
        return <Sun {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'Clouds':
        return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
      case 'Rain':
        return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'Drizzle':
        return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-400`} />;
      case 'Thunderstorm':
        return <CloudLightning {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      case 'Snow':
        return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-200`} />;
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <CloudFog {...iconProps} className={`${iconProps.className} text-gray-300`} />;
      default:
        return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${large ? 'gap-4 py-8' : 'gap-2 py-4'}`}>
      {getWeatherIcon(condition)}
      <div className="text-center">
        <div className={large ? 'text-5xl font-bold' : 'text-2xl font-semibold'}>
          {formatTemperature(temperature)}
        </div>
        {description && (
          <p className={`text-muted-foreground ${large ? 'text-lg mt-2' : 'text-sm mt-1'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
