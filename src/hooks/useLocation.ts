import { useState } from 'react';
import { Location } from '../types/weather';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      });
    });
  };

  const getLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const newLocation: Location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      setLocation(newLocation);
    } catch (err) {
      let errorMessage = 'Failed to get your location';
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services or search manually.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please search manually.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or search manually.';
            break;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = (newLocation: Location) => {
    setLocation(newLocation);
    setError(null);
  };

  return {
    location,
    loading,
    error,
    getLocation,
    setManualLocation
  };
};