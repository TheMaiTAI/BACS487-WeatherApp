import { Button } from "@/components/ui/button";
import { useTemperature } from "@/lib/TemperatureContext";
import { Thermometer } from "lucide-react";

export function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleUnit}
      className="hover:bg-accent/50"
      aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <div className="flex items-center gap-1">
        <Thermometer className="h-5 w-5" />
        <span className="text-sm font-medium">
          °{unit === 'celsius' ? 'C' : 'F'}
        </span>
      </div>
    </Button>
  );
} 