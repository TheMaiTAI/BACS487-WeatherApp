import { useState, useEffect } from "react";
import { useLocation } from "@/lib/LocationContext";
import { getForecast, HourlyForecast, DailyForecast } from "@/lib/api";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherIcon } from "@/components/WeatherIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, Sun, Cloud, Droplets, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ForecastData = {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

export default function Forecast() {
  const { location } = useLocation();
  const { toast } = useToast();
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (location) {
      loadForecast();
    }
  }, [location]);

  const loadForecast = async () => {
    try {
      setIsLoading(true);
      const data = await getForecast(location.lat, location.lon);
      if (data) {
        setForecast(data);
      } else {
        throw new Error("No forecast data received");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load forecast data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Forecast Data</h2>
        <p className="text-muted-foreground">
          Unable to load forecast data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20 dark:bg-gray-800/20 backdrop-blur-sm">
          <TabsTrigger 
            value="daily" 
            className="data-[state=active]:bg-background/30 dark:data-[state=active]:bg-gray-600/30 dark:text-gray-100 dark:data-[state=active]:text-white"
          >
            Daily Forecast
          </TabsTrigger>
          <TabsTrigger 
            value="hourly"
            className="data-[state=active]:bg-background/30 dark:data-[state=active]:bg-gray-600/30 dark:text-gray-100 dark:data-[state=active]:text-white"
          >
            Hourly Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecast.daily.map((day, index) => (
              <motion.div
                key={day.dt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:bg-muted/30 dark:hover:bg-gray-800/30",
                    selectedDay === index && "ring-2 ring-primary bg-muted/20 dark:bg-gray-800/20"
                  )}
                  onClick={() => setSelectedDay(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground/90 dark:text-gray-100">
                          {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                        </h3>
                        <p className="text-sm text-muted-foreground/90 dark:text-gray-200">
                          {new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-muted-foreground/80 dark:text-gray-300 mt-1 capitalize">
                          {day.weather_description}
                        </p>
                      </div>
                      <WeatherIcon 
                        condition={day.weather_description} 
                        size={32}
                        animated={true}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-1">
                        <Sun className="h-4 w-4 text-amber-500/70 dark:text-amber-400" />
                        <span className="text-sm text-foreground/90 dark:text-gray-200">{Math.round(day.temp_day)}°C</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Droplets className="h-4 w-4 text-blue-500/70 dark:text-blue-400" />
                        <span className="text-sm text-foreground/90 dark:text-gray-200">{day.humidity}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wind className="h-4 w-4 text-cyan-500/70 dark:text-cyan-400" />
                        <span className="text-sm text-foreground/90 dark:text-gray-200">{Math.round(day.wind_speed)} km/h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Cloud className="h-4 w-4 text-gray-500/70 dark:text-gray-400" />
                        <span className="text-sm text-foreground/90 dark:text-gray-200">{Math.round(day.pop)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedDay !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="bg-card/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-medium text-foreground/90 dark:text-gray-100">
                        {new Date(forecast.daily[selectedDay].dt * 1000).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <p className="text-base text-muted-foreground/90 dark:text-gray-200 mt-1 capitalize">
                        {forecast.daily[selectedDay].weather_description}
                      </p>
                    </div>
                    <WeatherIcon 
                      condition={forecast.daily[selectedDay].weather_description} 
                      size={48}
                      animated={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Temperature</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">{Math.round(forecast.daily[selectedDay].temp_day)}°C</p>
                      <p className="text-sm text-muted-foreground/80 dark:text-gray-300">
                        Night: {Math.round(forecast.daily[selectedDay].temp_night)}°C
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Humidity</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">{forecast.daily[selectedDay].humidity}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Wind Speed</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">{Math.round(forecast.daily[selectedDay].wind_speed)} km/h</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Precipitation</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">{Math.round(forecast.daily[selectedDay].pop)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <ScrollArea className="h-[400px] rounded-md border dark:border-gray-700">
            <div className="p-4 space-y-4">
              {forecast.hourly.map((hour, index) => (
                <motion.div
                  key={hour.dt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-card/30 dark:bg-gray-800/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground/90 dark:text-gray-100">
                            {new Date(hour.dt * 1000).toLocaleTimeString('en-US', { 
                              hour: 'numeric',
                              hour12: true
                            })}
                          </h3>
                          <p className="text-sm text-muted-foreground/80 dark:text-gray-300 mt-1 capitalize">
                            {hour.weather_description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <WeatherIcon 
                            condition={hour.weather_description} 
                            size={24}
                            animated={true}
                          />
                          <span className="font-medium text-foreground/90 dark:text-gray-100">{Math.round(hour.temp)}°C</span>
                          <div className="flex items-center space-x-1">
                            <Droplets className="h-4 w-4 text-blue-500/70 dark:text-blue-400" />
                            <span className="text-sm text-foreground/90 dark:text-gray-200">{hour.humidity}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wind className="h-4 w-4 text-cyan-500/70 dark:text-cyan-400" />
                            <span className="text-sm text-foreground/90 dark:text-gray-200">{Math.round(hour.wind_speed)} km/h</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
