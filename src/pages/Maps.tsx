import { useState, useEffect } from "react";
import { useLocation } from "@/lib/LocationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Maps() {
  const { location } = useLocation();
  const [mapType, setMapType] = useState("radar");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (location) {
      // Update map URL based on selected type and location
      const baseUrl = "https://tile.openweathermap.org/map";
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const url = `${baseUrl}/${mapType}/${location.lat}/${location.lon}.png?appid=${apiKey}`;
      setMapUrl(url);
    }
  }, [location, mapType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Weather Maps
          </h1>
          <p className="mt-4 text-lg text-muted-foreground/90 dark:text-gray-200">
            Interactive weather maps and radar views
          </p>
        </motion.div>

        <Tabs defaultValue="radar" className="w-full" onValueChange={setMapType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="clouds">Clouds</TabsTrigger>
          </TabsList>
          <TabsContent value="radar">
            <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  {mapUrl && (
                    <img
                      src={mapUrl}
                      alt="Weather Radar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="precipitation">
            <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  {mapUrl && (
                    <img
                      src={mapUrl}
                      alt="Precipitation Map"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clouds">
            <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  {mapUrl && (
                    <img
                      src={mapUrl}
                      alt="Clouds Map"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 