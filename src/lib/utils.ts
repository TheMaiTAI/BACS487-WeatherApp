import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert 24h format to 12h format with AM/PM
export function formatTime(hour: number): string {
  if (hour === 0 || hour === 24) {
    return "12:00 AM"
  } else if (hour === 12) {
    return "12:00 PM"
  } else if (hour > 12) {
    return `${hour - 12}:00 PM`
  } else {
    return `${hour}:00 AM`
  }
}

// Format date as day of week
export function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * Format a timestamp into a readable date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a timestamp into a readable time string
 */
export function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Get weather icon URL
export function getWeatherIconUrl(iconCode: string, size: 2 | 4 = 2): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}x.png`
}

// Get AQI description based on index
export function getAqiDescription(aqi: number): { label: string; color: string; bgGradient: string } {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        color: "bg-green-500",
        bgGradient: "bg-gradient-to-b from-green-50/50 to-background dark:from-green-900/20 dark:to-background"
      };
    case 2:
      return {
        label: "Fair",
        color: "bg-blue-500",
        bgGradient: "bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-900/20 dark:to-background"
      };
    case 3:
      return {
        label: "Moderate",
        color: "bg-yellow-500",
        bgGradient: "bg-gradient-to-b from-yellow-50/50 to-background dark:from-yellow-900/20 dark:to-background"
      };
    case 4:
      return {
        label: "Poor",
        color: "bg-orange-500",
        bgGradient: "bg-gradient-to-b from-orange-50/50 to-background dark:from-orange-900/20 dark:to-background"
      };
    case 5:
      return {
        label: "Very Poor",
        color: "bg-red-500",
        bgGradient: "bg-gradient-to-b from-red-50/50 to-background dark:from-red-900/20 dark:to-background"
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-500",
        bgGradient: "bg-gradient-to-b from-gray-50/50 to-background dark:from-gray-900/20 dark:to-background"
      };
  }
}
