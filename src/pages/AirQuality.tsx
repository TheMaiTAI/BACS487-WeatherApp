import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/lib/LocationContext";
import { getAirQuality, AirQualityData } from "@/lib/api";
import { getAqiDescription } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function AirQuality() {
  const { location } = useLocation();
  const { toast } = useToast();
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      loadAirQualityData();
    } else {
      setLoading(false);
    }
  }, [location]);

  const loadAirQualityData = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const data = await getAirQuality(location.lat, location.lon);
      
      if (data) {
        setAirQuality(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load air quality data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading air quality data:', error);
      toast({
        title: "Error",
        description: "Failed to load air quality data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine the progress value based on AQI
  const getAirQualityProgress = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 60;
      case 4:
        return 80;
      case 5:
        return 100;
      default:
        return 0;
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
          Please select a location on the home page to view air quality data.
        </p>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Air Quality Data Unavailable</h2>
        <p className="text-muted-foreground mb-4">
          Air quality data is not available for this location.
        </p>
      </div>
    );
  }

  // Get AQI description and color
  const aqiInfo = getAqiDescription(airQuality.aqi);
  const airQualityProgress = getAirQualityProgress(airQuality.aqi);

  return (
    <div className={`min-h-screen space-y-8 animate-fade-in ${aqiInfo.bgGradient}`}>
      <div className="text-center pt-8">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          Air Quality for {location.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">Current air quality conditions and health recommendations</p>
      </div>

      <WeatherCard className="p-8 backdrop-blur-sm bg-background/80 border-0 shadow-xl">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Air Quality Index
            </h2>
            <div className={`inline-block px-10 py-4 rounded-full text-2xl font-bold ${aqiInfo.color} text-white shadow-lg backdrop-blur-sm`}>
              {aqiInfo.label}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Good</span>
              <span>Very Poor</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200/50 dark:bg-gray-700/50 relative shadow-inner backdrop-blur-sm">
              <div className={`absolute h-3 rounded-full ${aqiInfo.color} shadow-md backdrop-blur-sm`} style={{ width: `${airQualityProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-base text-muted-foreground">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">Ozone (O₃)</div>
              <div className="text-2xl font-bold">{airQuality.o3} μg/m³</div>
            </div>
            
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">PM2.5</div>
              <div className="text-2xl font-bold">{airQuality.pm2_5} μg/m³</div>
            </div>
            
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">PM10</div>
              <div className="text-2xl font-bold">{airQuality.pm10} μg/m³</div>
            </div>
            
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">NO₂</div>
              <div className="text-2xl font-bold">{airQuality.no2} μg/m³</div>
            </div>
            
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">SO₂</div>
              <div className="text-2xl font-bold">{airQuality.so2} μg/m³</div>
            </div>
            
            <div className="p-6 border rounded-xl text-center bg-background/50 hover:bg-background/80 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <div className="text-lg text-muted-foreground mb-2">CO</div>
              <div className="text-2xl font-bold">{airQuality.co} mg/m³</div>
            </div>
          </div>
        </div>
      </WeatherCard>

      <WeatherCard className="backdrop-blur-sm bg-background/80 border-0 shadow-xl">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Health Recommendations
          </h3>
          
          <div className="space-y-6">
            {airQuality.aqi <= 2 && (
              <div className="flex items-start gap-4 p-6 bg-green-50/50 dark:bg-green-900/20 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <Badge className="bg-green-600 h-8 w-8 flex items-center justify-center rounded-full p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                </Badge>
                <div>
                  <p className="text-xl font-semibold text-green-800 dark:text-green-300">It's a good day to be active outside</p>
                  <p className="text-base text-green-700 dark:text-green-400 mt-2">Air quality is considered satisfactory, and air pollution poses little or no risk.</p>
                </div>
              </div>
            )}
            
            {airQuality.aqi === 3 && (
              <div className="flex items-start gap-4 p-6 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <Badge className="bg-yellow-600 h-8 w-8 flex items-center justify-center rounded-full p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </Badge>
                <div>
                  <p className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">Moderate air quality</p>
                  <p className="text-base text-yellow-700 dark:text-yellow-400 mt-2">Sensitive groups may experience health effects. Consider reducing prolonged or heavy exertion outdoors.</p>
                </div>
              </div>
            )}
            
            {airQuality.aqi >= 4 && (
              <div className="flex items-start gap-4 p-6 bg-red-50/50 dark:bg-red-900/20 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <Badge className="bg-red-600 h-8 w-8 flex items-center justify-center rounded-full p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </Badge>
                <div>
                  <p className="text-xl font-semibold text-red-800 dark:text-red-300">Poor air quality</p>
                  <p className="text-base text-red-700 dark:text-red-400 mt-2">Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activities.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </WeatherCard>
    </div>
  );
}
