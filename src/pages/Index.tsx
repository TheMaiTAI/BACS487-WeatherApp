import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/lib/LocationContext";
import { searchLocationsByQuery, LocationSuggestion, getCurrentWeather } from "@/lib/api";
import { Loader2, Search, MapPin, CornerDownRight, AlertCircle, Sun, Cloud, Wind, Droplets } from "lucide-react";
import { LocationPermissionHelp } from "@/components/LocationPermissionHelp";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherIcon } from "@/components/WeatherIcon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_description: string;
}

interface Feature {
  name: string;
  path: string;
  icon: string;
  description: string;
}

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { location, setLocation, getCurrentLocation, isLoading, error, permissionState, clearLocationError } = useLocation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);

  // Prevent auto-navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentPath = window.location.pathname;
      if (currentPath === '/' && !e.returnValue) {
        e.preventDefault();
        console.log("Prevented automatic navigation");
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Load current weather when location is set
  useEffect(() => {
    if (location) {
      loadCurrentWeather();
    }
  }, [location]);

  const loadCurrentWeather = async () => {
    try {
      const data = await getCurrentWeather(location.lat, location.lon);
      if (data) {
        setCurrentWeather(data);
      }
    } catch (error) {
      console.error('Error loading current weather:', error);
    }
  };

  // Weather features data for the card grid
  const features: Feature[] = [
    {
      name: "Forecast",
      path: "/forecast",
      icon: "partly cloudy",
      description: "Hourly and daily forecasts with detailed weather conditions"
    },
    {
      name: "Weather Radar",
      path: "/radar",
      icon: "cloudy",
      description: "Real-time weather radar and precipitation maps"
    },
    {
      name: "Precipitation",
      path: "/precipitation",
      icon: "rain",
      description: "Precipitation forecasts and rainfall predictions"
    },
    {
      name: "Sun Tracker",
      path: "/sun-tracker",
      icon: "clear",
      description: "Sunrise, sunset, and daylight hours information"
    },
    {
      name: "Air Quality",
      path: "/air-quality",
      icon: "fog",
      description: "Air quality index and pollution levels"
    },
    {
      name: "Weather Alerts",
      path: "/weather-alerts",
      icon: "thunder",
      description: "Severe weather warnings and emergency alerts"
    }
  ];

  // Clear any error toast on component mount
  useEffect(() => {
    if (error) {
      toast({
        title: "Location Error",
        description: error,
        variant: "destructive",
      });
    }
    
    return () => {
      clearLocationError();
    };
  }, [error, toast, clearLocationError]);

  // Debug useEffect to log permission state
  useEffect(() => {
    console.log("Current permission state:", permissionState);
    console.log("Current location:", location);
  }, [permissionState, location]);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocationsByQuery(value);
        setSuggestions(results);
      } catch (error) {
        toast({
          title: "Search Error",
          description: "Failed to fetch location suggestions",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 500);

    setDebounceTimer(timer);
  };

  // Handle current location button click
  const handleCurrentLocation = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await getCurrentLocation();
      if (location) {
        toast({
          title: "Location Updated",
          description: `Weather data for ${location.name} is now available.`,
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Location Error",
        description: "Failed to get your current location. Please try again or enter a location manually.",
        variant: "destructive",
      });
    }
  };

  // Select a location from suggestions
  const handleSelectLocation = (suggestion: LocationSuggestion, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const locationName = suggestion.formattedAddress || 
      `${suggestion.city}, ${suggestion.state || suggestion.country}`;
    
    setLocation({
      name: locationName,
      lat: suggestion.latitude,
      lon: suggestion.longitude
    });
    
    setQuery('');
    setSuggestions([]);
    
    toast({
      title: "Location Updated",
      description: `Weather data for ${locationName} is now available.`,
    });
  };

  // Handle feature card click
  const handleFeatureClick = (path: string) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location first to access this feature",
        variant: "destructive",
      });
      return;
    }
    navigate(path);
  };

  // Prevent navigation without location
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!location) {
        e.preventDefault();
        return '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!location) {
        e.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);

  // Show loading state while getting location
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Get appropriate button variant based on permission state
  const getLocationButtonVariant = () => {
    if (permissionState === 'denied') {
      return "destructive";
    } else if (permissionState === 'granted') {
      return "default";
    }
    return "outline";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocationsByQuery(query);
      if (results.length > 0) {
        handleSelectLocation(results[0], e as unknown as React.MouseEvent);
      } else {
        toast({
          title: "No Results",
          description: "No locations found matching your search",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for location",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Weather App
          </h1>
          <p className="mt-4 text-lg text-muted-foreground/90 dark:text-gray-200">
            Get accurate weather forecasts and detailed information for your location
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto relative"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter city name"
                  value={query}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => handleSelectLocation(suggestion, e)}
                        className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {suggestion.formattedAddress || `${suggestion.city}, ${suggestion.state || suggestion.country}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCurrentLocation}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              Use Current Location
            </Button>
          </form>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={feature.path}>
                <Card className="h-full bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm hover:from-card/60 hover:to-card/40 dark:hover:from-gray-800/60 dark:hover:to-gray-900/40 transition-all duration-300 border border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5">
                        <WeatherIcon 
                          condition={feature.icon} 
                          size={32}
                          animated={true}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground/90 dark:text-gray-100">
                          {feature.name}
                        </h3>
                        <p className="text-sm text-muted-foreground/80 dark:text-gray-300 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Current Weather Card */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-medium text-foreground/90 dark:text-gray-100">Current Weather</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <WeatherIcon 
                        condition={currentWeather.weather_description} 
                        size={24}
                        animated={true}
                      />
                      <p className="text-muted-foreground/90 dark:text-gray-200 capitalize">
                        {currentWeather.weather_description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-foreground/90 dark:text-gray-100">
                      {Math.round(currentWeather.temperature)}°C
                    </p>
                    <p className="text-sm text-muted-foreground/90 dark:text-gray-200">
                      Feels like {Math.round(currentWeather.feels_like)}°C
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500/70 dark:text-blue-400" />
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Humidity</p>
                    </div>
                    <p className="text-xl font-medium text-foreground/90 dark:text-gray-100">
                      {currentWeather.humidity}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-cyan-500/70 dark:text-cyan-400" />
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">Wind Speed</p>
                    </div>
                    <p className="text-xl font-medium text-foreground/90 dark:text-gray-100">
                      {Math.round(currentWeather.wind_speed)} km/h
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500/70 dark:text-yellow-400" />
                      <p className="text-sm text-muted-foreground/90 dark:text-gray-300">UV Index</p>
                    </div>
                    <p className="text-xl font-medium text-foreground/90 dark:text-gray-100">
                      Moderate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
