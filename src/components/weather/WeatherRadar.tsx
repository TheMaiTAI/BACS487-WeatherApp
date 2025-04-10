import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OPENWEATHER_API_KEY } from '@/lib/api';

// Fixing Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const WeatherRadar = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { currentLocation } = useLocation();
  
  // Create and configure the map
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;
    
    // Clear previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    
    // Create new map instance
    const map = L.map(mapRef.current).setView(
      [currentLocation.lat, currentLocation.lon], 
      8
    );
    
    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add location marker
    L.marker([currentLocation.lat, currentLocation.lon])
      .addTo(map)
      .bindPopup(`${currentLocation.name}`);
    
    // Store map instance for cleanup
    mapInstanceRef.current = map;
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentLocation]);
  
  // Function to add/remove weather layers
  const setWeatherLayer = (layerType: string) => {
    if (!mapInstanceRef.current || !currentLocation) return;
    
    // Remove any existing weather layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer && layer.options.attribution?.includes('OpenWeatherMap')) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });
    
    // Add the selected weather layer
    if (layerType !== 'none') {
      const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`, {
        attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a>',
        maxZoom: 19
      });
      
      weatherLayer.addTo(mapInstanceRef.current);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Radar</CardTitle>
        <CardDescription>
          View different weather conditions on the map
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="precipitation" className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="none" onClick={() => setWeatherLayer('none')}>None</TabsTrigger>
            <TabsTrigger value="clouds" onClick={() => setWeatherLayer('clouds_new')}>Clouds</TabsTrigger>
            <TabsTrigger value="precipitation" onClick={() => setWeatherLayer('precipitation_new')}>Precipitation</TabsTrigger>
            <TabsTrigger value="temp" onClick={() => setWeatherLayer('temp_new')}>Temperature</TabsTrigger>
            <TabsTrigger value="wind" onClick={() => setWeatherLayer('wind_new')}>Wind</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-md overflow-hidden"
        />
      </CardContent>
    </Card>
  );
};

export default WeatherRadar; 