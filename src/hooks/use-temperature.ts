import { useState, useEffect } from 'react';
import { setTemperatureUnit as setStoredUnit, getTemperatureUnit } from '@/lib/api';

// Type definition for temperature units
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export function useTemperature() {
  // Initialize state from localStorage
  const [unit, setUnit] = useState<TemperatureUnit>(getTemperatureUnit());

  // Update state and localStorage when unit changes
  const setTemperatureUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    setStoredUnit(newUnit);
  };

  // Convert temperatures between units
  const convertTemperature = (temp: number, fromUnit?: TemperatureUnit, toUnit?: TemperatureUnit): number => {
    const source = fromUnit || unit;
    const target = toUnit || unit;
    
    if (source === target) {
      return Math.round(temp);
    }
    
    if (source === 'fahrenheit' && target === 'celsius') {
      return Math.round((temp - 32) * 5 / 9);
    }
    
    if (source === 'celsius' && target === 'fahrenheit') {
      return Math.round((temp * 9 / 5) + 32);
    }
    
    return Math.round(temp);
  };

  // Format a temperature value with the current unit symbol
  const formatTemperature = (temp: number, fromUnit?: TemperatureUnit): string => {
    const convertedTemp = convertTemperature(temp, fromUnit);
    return `${convertedTemp}°${unit === 'celsius' ? 'C' : 'F'}`;
  };

  // Get the appropriate speed unit based on temperature unit
  const getSpeedUnit = (): string => {
    return unit === 'celsius' ? 'km/h' : 'mph';
  };

  return {
    unit,
    setTemperatureUnit,
    convertTemperature,
    formatTemperature,
    getSpeedUnit,
  };
} 