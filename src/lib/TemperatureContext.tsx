import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const savedUnit = localStorage.getItem('temperature-unit');
    return (savedUnit as TemperatureUnit) || 'celsius';
  });

  useEffect(() => {
    localStorage.setItem('temperature-unit', unit);
  }, [unit]);

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