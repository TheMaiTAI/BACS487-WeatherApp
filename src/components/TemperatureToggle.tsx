import { Button } from "@/components/ui/button";
import { useTemperature } from "@/lib/TemperatureContext";
import { Thermometer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleUnit}
            className="hover:bg-accent/50 px-3"
            aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              <span className="text-sm font-medium">
                °{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 