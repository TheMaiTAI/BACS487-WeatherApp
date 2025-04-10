import { WeatherCard } from "@/components/WeatherCard";
import { Separator } from "@/components/ui/separator";
import { MapPin, Sun, Sunrise, Sunset, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "@/lib/LocationContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getCurrentWeather } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SunTracker = () => {
  const { location } = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    if (location) {
      loadWeatherData();
    } else {
      setLoading(false);
    }
  }, [location]);

  const loadWeatherData = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const data = await getCurrentWeather(location.lat, location.lon);
      if (data) {
        setWeatherData(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load weather data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
      toast({
        title: "Error",
        description: "Failed to load weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate the percentage of daylight passed
  const calculateDaylightProgress = () => {
    if (!weatherData) return 0;

    const now = new Date();
    const sunrise = new Date(weatherData.sunrise * 1000);
    const sunset = new Date(weatherData.sunset * 1000);
    
    const totalDaylight = sunset.getTime() - sunrise.getTime();
    const elapsedDaylight = now.getTime() - sunrise.getTime();
    
    let progressPercentage = (elapsedDaylight / totalDaylight) * 100;
    
    // Clamp value between 0 and 100
    progressPercentage = Math.max(0, Math.min(100, progressPercentage));
    
    return progressPercentage;
  };

  const daylightProgress = calculateDaylightProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Location Selected</h2>
        <p className="text-muted-foreground mb-4">
          Please select a location on the home page to view sun tracker data.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
        >
          Go to Home Page
        </Button>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Weather Data Unavailable</h2>
        <p className="text-muted-foreground mb-4">
          Weather data is not available for this location.
        </p>
      </div>
    );
  }

  // Calculate current sun position
  const now = new Date();
  const sunrise = new Date(weatherData.sunrise * 1000);
  const sunset = new Date(weatherData.sunset * 1000);
  const dayLength = sunset.getTime() - sunrise.getTime();
  const elapsedTime = now.getTime() - sunrise.getTime();
  const progress = elapsedTime / dayLength;
  
  // Calculate azimuth (simplified)
  const azimuth = Math.round(180 + (progress * 180));
  
  // Calculate elevation (simplified)
  const elevation = Math.round(Math.sin(progress * Math.PI) * 90);
  
  // Calculate remaining daylight
  const remainingTime = sunset.getTime() - now.getTime();
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format times
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Sun Tracker</h1>
        <div className="flex items-center text-muted-foreground mt-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location.name}</span>
        </div>
      </div>

      <WeatherCard className="p-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sun className="h-8 w-8 text-weather-sunny animate-pulse-slow" />
          <h2 className="text-xl font-semibold">Current Sun Position</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-muted-foreground mb-1">Azimuth</div>
            <div className="text-2xl font-bold">{azimuth}°</div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-muted-foreground mb-1">Elevation</div>
            <div className="text-2xl font-bold">{elevation}°</div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-muted-foreground mb-1">Daylight Remaining</div>
            <div className="text-2xl font-bold">{hours}h {minutes}m</div>
          </div>
        </div>
      </WeatherCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherCard>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-weather-blue" />
            <h3 className="text-lg font-semibold">Sun Times</h3>
          </div>
          
          <div className="space-y-4 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Sunrise className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Sunrise</span>
              </div>
              <span className="font-medium">{formatTime(sunrise)}</span>
            </div>
            
            <div className="relative">
              <Separator className="my-2" />
              <div className="h-2 w-2 rounded-full bg-yellow-500 absolute" style={{ left: `${daylightProgress}%`, top: '-4px' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Sunset className="h-5 w-5 mr-2 text-orange-500" />
                <span>Sunset</span>
              </div>
              <span className="font-medium">{formatTime(sunset)}</span>
            </div>
          </div>
        </WeatherCard>

        <WeatherCard>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">UV Index</h3>
          </div>
          
          <div className="space-y-4 px-4">
            <div className="flex justify-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full font-bold text-xl">
                {weatherData.uvi || 0}
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-medium">
                {weatherData.uvi < 3 ? "Low" : 
                 weatherData.uvi < 6 ? "Moderate" : 
                 weatherData.uvi < 8 ? "High" : 
                 weatherData.uvi < 11 ? "Very High" : "Extreme"}
              </div>
              <p className="text-sm text-red-500 mt-1">
                {weatherData.uvi < 3 ? "No protection required" : 
                 weatherData.uvi < 6 ? "Protection recommended" : 
                 weatherData.uvi < 8 ? "Protection essential" : 
                 weatherData.uvi < 11 ? "Extra protection required" : "Avoid sun exposure"}
              </p>
            </div>
            
            <Progress value={(weatherData.uvi || 0) * 10} className="h-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </WeatherCard>
      </div>

      <WeatherCard>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sun className="h-6 w-6 text-weather-blue" />
          <h3 className="text-lg font-semibold">Additional Information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-muted-foreground mb-1">Day Length</div>
            <div className="text-xl font-medium">
              {Math.floor(dayLength / (1000 * 60 * 60))}h {Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60))}m
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Solar Noon</div>
            <div className="text-xl font-medium">
              {formatTime(new Date(sunrise.getTime() + dayLength / 2))}
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Sun Transit Time</div>
            <div className="text-xl font-medium">
              {Math.floor(dayLength / (1000 * 60 * 60))}h {Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60))}m
            </div>
          </div>
        </div>
      </WeatherCard>
    </div>
  );
};

export default SunTracker;
