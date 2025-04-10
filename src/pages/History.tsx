import { useState, useEffect } from "react";
import { useLocation } from "@/lib/LocationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface HistoricalData {
  date: string;
  temperature: {
    high: number;
    low: number;
    average: number;
  };
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export default function History() {
  const { location } = useLocation();
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    if (location) {
      // Simulate fetching historical data
      // In a real app, you would fetch this from an API
      const mockData: HistoricalData[] = [
        {
          date: "2024-04-03",
          temperature: {
            high: 25,
            low: 15,
            average: 20
          },
          precipitation: 0,
          humidity: 65,
          windSpeed: 12
        },
        {
          date: "2024-04-04",
          temperature: {
            high: 27,
            low: 16,
            average: 21.5
          },
          precipitation: 0,
          humidity: 60,
          windSpeed: 10
        },
        {
          date: "2024-04-05",
          temperature: {
            high: 24,
            low: 14,
            average: 19
          },
          precipitation: 5,
          humidity: 75,
          windSpeed: 15
        }
      ];
      setHistoricalData(mockData);
    }
  }, [location]);

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
            Historical Data
          </h1>
          <p className="mt-4 text-lg text-muted-foreground/90 dark:text-gray-200">
            Past weather data and climate trends
          </p>
        </motion.div>

        <Tabs defaultValue="week" className="w-full" onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Last Week</TabsTrigger>
            <TabsTrigger value="month">Last Month</TabsTrigger>
            <TabsTrigger value="year">Last Year</TabsTrigger>
          </TabsList>
          <TabsContent value={timeRange}>
            <div className="space-y-4">
              {historicalData.map((data, index) => (
                <motion.div
                  key={data.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground/90 dark:text-gray-200">Date</p>
                          <p className="text-lg font-medium text-foreground/90 dark:text-gray-100">
                            {new Date(data.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground/90 dark:text-gray-200">Temperature</p>
                          <p className="text-lg font-medium text-foreground/90 dark:text-gray-100">
                            {data.temperature.high}°C / {data.temperature.low}°C
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground/90 dark:text-gray-200">Precipitation</p>
                          <p className="text-lg font-medium text-foreground/90 dark:text-gray-100">
                            {data.precipitation}mm
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground/90 dark:text-gray-200">Wind Speed</p>
                          <p className="text-lg font-medium text-foreground/90 dark:text-gray-100">
                            {data.windSpeed} km/h
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 