import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherIcon } from "@/components/WeatherIcon";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "@/lib/LocationContext";
import { Button } from "@/components/ui/button";
import { getForecast } from "@/lib/api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Precipitation = () => {
  const { location } = useLocation();
  const { toast } = useToast();
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      loadPrecipitationData();
    } else {
      setLoading(false);
    }
  }, [location]);

  const loadPrecipitationData = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const data = await getForecast(location.lat, location.lon);
      if (data) {
        setForecast(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load precipitation data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading precipitation data:', error);
      toast({
        title: "Error",
        description: "Failed to load precipitation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          Please select a location on the home page to view precipitation data.
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

  const currentCondition = forecast?.daily[0]?.weather_description || "clear sky";
  const currentPop = forecast?.daily[0]?.pop || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Precipitation Forecast</h1>
        <p className="text-muted-foreground mt-2">{location.name}</p>
      </div>

      <WeatherCard className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WeatherIcon condition={currentCondition} size={36} />
            <div>
              <Badge variant="outline">Currently</Badge>
              <p className="text-lg font-medium mt-1 capitalize">{currentCondition}</p>
            </div>
          </div>
          <div>
            <Badge 
              variant="outline" 
              className={`${
                currentPop > 0 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              {currentPop > 0 ? `${currentPop}% chance of precipitation` : "No precipitation expected"}
            </Badge>
          </div>
        </div>
      </WeatherCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecast?.daily.map((day: any, idx: number) => (
          <WeatherCard key={idx} className="p-4">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{format(new Date(day.dt * 1000), "EEE, MMM d")}</h3>
                  <div className="flex items-center mt-2">
                    <WeatherIcon condition={day.weather_description} size={28} className="mr-2" />
                    <span className="text-muted-foreground capitalize">{day.weather_description}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Probability</span>
                    <span>{day.pop}%</span>
                  </div>
                  <Progress value={day.pop} className="h-2" />
                </div>
              </div>
            </div>
          </WeatherCard>
        ))}
      </div>
    </div>
  );
};

export default Precipitation;
