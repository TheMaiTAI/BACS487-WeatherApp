import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Snowflake, 
  Sun, 
  Moon,
  CloudMoon,
  CloudOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  condition: string;
  className?: string;
  size?: number;
  animated?: boolean;
}

export function WeatherIcon({ 
  condition, 
  className, 
  size = 24,
  animated = false 
}: WeatherIconProps) {
  const getIcon = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return <Sun className="text-weather-sunny" />;
    }
    if (lowerCondition.includes("night") || lowerCondition.includes("clear night")) {
      return <Moon className="text-gray-400" />;
    }
    if (lowerCondition.includes("partly cloudy") && lowerCondition.includes("night")) {
      return <CloudMoon className="text-gray-400" />;
    }
    if (lowerCondition.includes("partly cloudy")) {
      return <CloudSun className="text-weather-light-blue" />;
    }
    if (lowerCondition.includes("cloudy") || lowerCondition.includes("overcast")) {
      return <Cloud className="text-weather-cloudy" />;
    }
    if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
      return <CloudFog className="text-weather-fog" />;
    }
    if (lowerCondition.includes("thunder") || lowerCondition.includes("lightning")) {
      return <CloudLightning className="text-weather-storm" />;
    }
    if (lowerCondition.includes("snow") || lowerCondition.includes("sleet")) {
      return <CloudSnow className="text-weather-snow" />;
    }
    if (lowerCondition.includes("flurries")) {
      return <Snowflake className="text-weather-snow" />;
    }
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle") || lowerCondition.includes("shower")) {
      return <CloudRain className="text-weather-rain" />;
    }
    
    // Default icon
    return <CloudOff className="text-muted-foreground" />;
  };

  return (
    <div className={cn(
      "flex items-center justify-center", 
      animated && "animate-float",
      className
    )} style={{ width: size, height: size }}>
      {getIcon()}
    </div>
  );
}
