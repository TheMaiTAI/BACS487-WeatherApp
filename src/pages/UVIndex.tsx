import { useState, useEffect } from "react";
import { useLocation } from "@/lib/LocationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface UVData {
  value: number;
  riskLevel: string;
  recommendations: string[];
}

export default function UVIndex() {
  const { location } = useLocation();
  const [uvData, setUVData] = useState<UVData | null>(null);

  useEffect(() => {
    if (location) {
      // Simulate fetching UV data
      // In a real app, you would fetch this from an API
      const mockUVData: UVData = {
        value: 7.5,
        riskLevel: "High",
        recommendations: [
          "Seek shade during midday hours",
          "Wear protective clothing",
          "Apply SPF 30+ sunscreen",
          "Wear a wide-brimmed hat",
          "Use UV-blocking sunglasses"
        ]
      };
      setUVData(mockUVData);
    }
  }, [location]);

  const getUVColor = (value: number) => {
    if (value <= 2) return "bg-green-500";
    if (value <= 5) return "bg-yellow-500";
    if (value <= 7) return "bg-orange-500";
    if (value <= 10) return "bg-red-500";
    return "bg-purple-500";
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
            UV Index
          </h1>
          <p className="mt-4 text-lg text-muted-foreground/90 dark:text-gray-200">
            Current UV radiation levels and protection recommendations
          </p>
        </motion.div>

        {uvData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">{uvData.value}</div>
                    <div className="text-xl font-medium text-muted-foreground/90 dark:text-gray-200">
                      {uvData.riskLevel} Risk
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground/90 dark:text-gray-200">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <Progress
                      value={(uvData.value / 11) * 100}
                      className={`h-2 ${getUVColor(uvData.value)}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground/90 dark:text-gray-100">
                      Protection Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {uvData.recommendations.map((recommendation, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 text-muted-foreground/90 dark:text-gray-200"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
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