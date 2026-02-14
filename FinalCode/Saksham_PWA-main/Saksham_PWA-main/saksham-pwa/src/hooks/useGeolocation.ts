import { useState, useEffect, useCallback } from 'react';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationReturn {
  location: GeolocationData | null;
  error: string | null;
  isLoading: boolean;
  refreshLocation: () => void;
}

export const useGeolocation = (autoFetch = true): GeolocationReturn => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, [autoFetch, fetchLocation]);

  return {
    location,
    error,
    isLoading,
    refreshLocation: fetchLocation,
  };
};
