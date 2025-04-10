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
import { useFormattedTemperature } from "@/lib/temperature";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      loadForecast();
    } else {
      setIsLoading(false);
      setError("Please select a location first");
    }
  }, [location]);

  const loadForecast = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getForecast(location.lat, location.lon);
      if (data) {
        setForecast(data);
      } else {
        throw new Error("No forecast data received");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load forecast data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
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

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Error Loading Forecast</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={loadForecast}>
          Try Again
        </Button>
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
                    "bg-card/50 backdrop-blur-sm cursor-pointer",
                    selectedDay === index && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedDay(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {useFormattedTemperature(day.temp_day)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {useFormattedTemperature(day.temp_night)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <WeatherIcon condition={day.weather_description} size="lg" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedDay !== null && forecast.daily[selectedDay] && (
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
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">
                        {useFormattedTemperature(forecast.daily[selectedDay].temp_day)}
                      </p>
                      <p className="text-sm text-muted-foreground/80 dark:text-gray-300">
                        Night: {useFormattedTemperature(forecast.daily[selectedDay].temp_night)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Humidity</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">
                        {forecast.daily[selectedDay].humidity}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Wind Speed</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">
                        {Math.round(forecast.daily[selectedDay].wind_speed)} km/h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Precipitation</p>
                      <p className="text-2xl font-medium text-foreground/90 dark:text-gray-100">
                        {Math.round(forecast.daily[selectedDay].pop)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {forecast.hourly.map((hour, index) => (
                <motion.div
                  key={hour.dt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' })}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(hour.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {useFormattedTemperature(hour.temp)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Feels like {useFormattedTemperature(hour.feels_like)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-center">
                        <WeatherIcon condition={hour.weather_description} size="lg" />
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
