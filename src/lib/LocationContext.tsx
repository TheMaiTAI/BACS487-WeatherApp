import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoredLocation, saveLocation, getLocationFromCoordinates, LocationCoordinates } from './api';

interface LocationContextType {
  location: LocationCoordinates | null;
  setLocation: (location: LocationCoordinates) => void;
  isLoading: boolean;
  error: string | null;
  permissionState: PermissionState;
  getCurrentLocation: () => Promise<void>;
  clearLocationError: () => void;
}

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'unknown';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');

  // Load location from localStorage on initial render
  useEffect(() => {
    const storedLocation = getStoredLocation();
    if (storedLocation) {
      setLocationState(storedLocation);
    }

    // Check for permission state if supported
    checkPermissionState();
  }, []);

  // Check current permission state for geolocation
  const checkPermissionState = async () => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionState(result.state as PermissionState);

        // Set up listener for permission changes
        result.addEventListener('change', () => {
          setPermissionState(result.state as PermissionState);
          
          // Clear error if permission is now granted
          if (result.state === 'granted') {
            setError(null);
          }
        });
      } catch (err) {
        console.error('Error checking permissions:', err);
        setPermissionState('unknown');
      }
    }
  };

  // Set location and save to localStorage
  const setLocation = (location: LocationCoordinates) => {
    setLocationState(location);
    saveLocation(location);
  };

  // Clear location error
  const clearLocationError = () => {
    setError(null);
  };

  // Get current location using browser's geolocation API
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setPermissionState('unavailable');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Requesting geolocation...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        // Add timeout option (15 seconds)
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Geolocation granted:', position);
            resolve(position);
          },
          (err) => {
            console.log('Geolocation error:', err.code, err.message);
            // Handle specific geolocation errors
            if (err.code === 1) {
              setPermissionState('denied');
              reject(new Error('Permission denied. Please allow location access in your browser settings.'));
            } else if (err.code === 2) {
              reject(new Error('Location unavailable. Please try again or enter your location manually.'));
            } else if (err.code === 3) {
              reject(new Error('Location request timed out. Please try again or check your connection.'));
            } else {
              reject(err);
            }
          },
          options
        );
      });

      // Update permission state since we successfully got location
      setPermissionState('granted');

      const { latitude, longitude } = position.coords;
      console.log('Getting location data for:', latitude, longitude);
      const locationData = await getLocationFromCoordinates(latitude, longitude);

      if (locationData) {
        console.log('Location data received:', locationData);
        setLocation(locationData);
      } else {
        setError('Could not determine your location name. Please try entering it manually.');
      }
    } catch (err) {
      console.error('Error in getCurrentLocation:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error getting your location. Please try again or enter it manually.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation, 
      isLoading, 
      error, 
      permissionState,
      getCurrentLocation,
      clearLocationError
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 