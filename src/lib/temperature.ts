import { useTemperature } from "./TemperatureContext";

export function convertTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  const temp = convertTemperature(celsius, unit);
  return `${temp}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function useFormattedTemperature(celsius: number): string {
  const { unit } = useTemperature();
  return formatTemperature(celsius, unit);
} 