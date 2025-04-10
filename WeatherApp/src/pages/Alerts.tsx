import { useState, useEffect } from "react";
import { useLocation } from "@/lib/LocationContext";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "extreme";
  startTime: string;
  endTime: string;
}

export default function Alerts() {
  const { location } = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (location) {
      // Simulate fetching alerts
      // In a real app, you would fetch this from an API
      const mockAlerts: Alert[] = [
        {
          id: "1",
          title: "Heat Advisory",
          description: "Extreme heat expected. Take precautions to avoid heat-related illnesses.",
          severity: "high",
          startTime: "2024-04-10T12:00:00",
          endTime: "2024-04-10T18:00:00"
        },
        {
          id: "2",
          title: "Thunderstorm Watch",
          description: "Severe thunderstorms possible. Stay alert for changing conditions.",
          severity: "medium",
          startTime: "2024-04-10T15:00:00",
          endTime: "2024-04-10T21:00:00"
        }
      ];
      setAlerts(mockAlerts);
    }
  }, [location]);

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "extreme":
        return "bg-red-500";
    }
  };

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
            Weather Alerts
          </h1>
          <p className="mt-4 text-lg text-muted-foreground/90 dark:text-gray-200">
            Current weather warnings and emergency alerts
          </p>
        </motion.div>

        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-2 h-full rounded-full ${getSeverityColor(alert.severity)}`}></div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-foreground/90 dark:text-gray-100">
                          {alert.title}
                        </h3>
                        <span className="text-sm text-muted-foreground/90 dark:text-gray-200">
                          {new Date(alert.startTime).toLocaleTimeString()} - {new Date(alert.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground/90 dark:text-gray-200">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 