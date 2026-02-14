import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Camera, MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { db } from '../lib/db';
import type { Event, DailyReport as DailyReportType, GPSCoordinates } from '../types';
import { validateGeofence, getCurrentLocation } from '../lib/geofence';
import { format } from 'date-fns';

export const DailyReport: React.FC = () => {
  const [, params] = useRoute('/events/:eventId/day/:dayNumber');
  const [, setLocation] = useLocation();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendanceCount, setAttendanceCount] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geofenceError, setGeofenceError] = useState<string | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GPSCoordinates | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params?.eventId) {
      loadEvent(params.eventId);
    }
  }, [params?.eventId]);

  const loadEvent = async (eventId: string) => {
    const eventData = await db.getEvent(eventId);
    if (eventData) {
      setEvent(eventData);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !params?.dayNumber) {
      alert('Event information missing');
      return;
    }

    setIsSubmitting(true);
    setGeofenceError(null);
    setIsCheckingLocation(true);

    try {
      // Step 1: Get current GPS location
      const currentGPS = await getCurrentLocation();
      setCurrentLocation(currentGPS);

      // Step 2: Validate geofence (user must be within 200m of event location)
      const geofenceValidation = validateGeofence(currentGPS, event.gps, 200);

      if (!geofenceValidation.isValid) {
        setGeofenceError(
          `You are ${geofenceValidation.distance}m away from the training location. You must be within 200m to submit this report.`
        );
        setIsSubmitting(false);
        setIsCheckingLocation(false);
        return;
      }

      setIsCheckingLocation(false);

      // Step 3: Upload photos to storage (simulated - in production, upload to server/cloud)
      const photoIds: string[] = [];
      for (const photo of photos) {
        const photoId = `photo-${Date.now()}-${Math.random()}`;
        // In production: upload photo and get URL
        photoIds.push(photoId);
      }

      // Step 4: Create and save daily report
      const report: DailyReportType = {
        id: `report-${Date.now()}`,
        eventId: event.id,
        dayNumber: parseInt(params.dayNumber),
        date: new Date().toISOString(),
        attendanceCount: parseInt(attendanceCount) || 0,
        notes,
        photos: photoIds,
        submittedAt: Date.now(),
        submissionLocation: currentGPS,
        isGeofenceValid: true,
        synced: false,
      };

      // Save to IndexedDB (you'll need to add this to db.ts)
      // await db.addDailyReport(report);

      // Log activity
      await db.addActivity({
        id: `activity-${Date.now()}`,
        eventId: event.id,
        type: 'daily_report_submitted',
        description: `Day ${params.dayNumber} report submitted with ${report.attendanceCount} attendees`,
        timestamp: Date.now(),
        gps: currentGPS,
        synced: false,
      });

      alert('Daily report submitted successfully!');
      setLocation(`/events/${event.id}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      if (error instanceof GeolocationPositionError) {
        setGeofenceError('Failed to get your GPS location. Please enable location services.');
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setIsCheckingLocation(false);
    }
  };

  if (!event || !params?.dayNumber) {
    return (
      <Layout title="Daily Report">
        <div className="py-8 text-center">
          <p className="text-body text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  const dayNumber = parseInt(params.dayNumber);

  return (
    <Layout title={`Day ${dayNumber} Report`}>
      <div className="space-y-4 pb-4">
        {/* Event Info Card */}
        <Card elevated>
          <h2 className="text-card-title font-bold mb-2">{event.name}</h2>
          <p className="text-body text-gray-600 mb-3">{event.type}</p>
          <div className="flex items-center gap-2 text-small text-gray-600">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <p className="text-small text-indian-blue font-medium mt-2">
            Day {dayNumber} Report
          </p>
        </Card>

        {/* Geofence Status */}
        {currentLocation && (
          <Card className="bg-green-50 border-2 border-indian-green">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-indian-green mt-0.5" />
              <div>
                <p className="font-medium text-indian-green">Location Verified</p>
                <p className="text-small text-gray-700">
                  You are at the training location ({currentLocation.latitude.toFixed(6)}°, {currentLocation.longitude.toFixed(6)}°)
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Geofence Error */}
        {geofenceError && (
          <Card className="bg-red-50 border-2 border-danger-red">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-danger-red mt-0.5" />
              <div>
                <p className="font-medium text-danger-red">Location Error</p>
                <p className="text-small text-gray-700">{geofenceError}</p>
                <p className="text-micro text-gray-600 mt-2">
                  Required location: {event.gps.latitude.toFixed(6)}°, {event.gps.longitude.toFixed(6)}°
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Report Form */}
        <Card>
          <h3 className="text-section-header font-semibold mb-4">Submit Daily Report</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Attendance Count"
              type="number"
              placeholder="Number of trainees present today"
              value={attendanceCount}
              onChange={(e) => setAttendanceCount(e.target.value)}
              required
              min="0"
            />

            <TextArea
              label="Notes (Optional)"
              placeholder="Any observations or incidents to report..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />

            {/* Photo Upload */}
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                Photos of Session
              </label>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => photoInputRef.current?.click()}
                icon={Camera}
                fullWidth
              >
                Add Photos ({photos.length})
              </Button>

              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-danger-red text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isCheckingLocation}
                fullWidth
                className="h-14"
              >
                {isCheckingLocation ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Verifying Location...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
              <p className="text-micro text-gray-500 text-center mt-2">
                Your location will be verified before submission
              </p>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};
