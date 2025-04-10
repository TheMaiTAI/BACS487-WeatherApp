import React, { createContext, useContext, useState, ReactNode } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
} 