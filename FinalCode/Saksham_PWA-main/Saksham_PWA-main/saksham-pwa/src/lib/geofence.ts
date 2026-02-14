import type { GPSCoordinates } from '../types';

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param coord1 First GPS coordinate
 * @param coord2 Second GPS coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

/**
 * Validate if current location is within geofence radius of target location
 * @param currentLocation Current GPS coordinates
 * @param targetLocation Target/allowed GPS coordinates
 * @param radiusMeters Allowed radius in meters (default: 200m)
 * @returns Object with isValid boolean and distance in meters
 */
export function validateGeofence(
  currentLocation: GPSCoordinates,
  targetLocation: GPSCoordinates,
  radiusMeters: number = 200
): { isValid: boolean; distance: number } {
  const distance = calculateDistance(currentLocation, targetLocation);
  const isValid = distance <= radiusMeters;

  return {
    isValid,
    distance: Math.round(distance), // Round to whole meters
  };
}

/**
 * Get current device location
 * @returns Promise with GPS coordinates or error
 */
export function getCurrentLocation(): Promise<GPSCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
