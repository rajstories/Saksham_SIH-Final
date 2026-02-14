export interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  endDate?: string; // For multi-day events
  description?: string;
  location: string;
  gps: GPSCoordinates; // Allowed location for geofencing
  expectedTrainees: number;
  status: 'active' | 'completed';
  createdAt: number;
  synced: boolean;
}

export interface DailyReport {
  id: string;
  eventId: string;
  dayNumber: number; // Day 1, Day 2, etc.
  date: string;
  attendanceCount: number;
  notes?: string;
  photos: string[]; // Array of photo IDs or URLs
  submittedAt: number;
  submissionLocation: GPSCoordinates; // Location where report was submitted
  isGeofenceValid: boolean; // Was the user at the correct location?
  synced: boolean;
}

export interface Activity {
  id: string;
  eventId: string;
  type: string;
  description: string;
  timestamp: number;
  gps: GPSCoordinates | null;
  synced: boolean;
}

export interface Attendance {
  id: string;
  eventId: string;
  traineeId: string;
  traineeName: string;
  status: 'present' | 'absent';
  timestamp: number;
  method: 'manual' | 'qr';
  synced: boolean;
}

export interface Media {
  id: string;
  eventId: string;
  type: 'photo' | 'video';
  blob: Blob;
  thumbnail?: string;
  timestamp: number;
  gps: GPSCoordinates | null;
  synced: boolean;
}

export interface Trainee {
  id: string;
  name: string;
  photo?: string;
  phone?: string;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type TrainingType =
  | 'Earthquake'
  | 'Flood'
  | 'Fire'
  | 'General Drill';

export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te';
