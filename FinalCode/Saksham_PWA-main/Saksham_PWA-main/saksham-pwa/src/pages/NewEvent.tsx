import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { VoiceInputModal } from '../components/VoiceInputModal';
import { MapPin, Loader } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { db } from '../lib/db';
import type { TrainingType } from '../types';

const trainingTypes: TrainingType[] = [
  'Earthquake',
  'Flood',
  'Fire',
  'General Drill',
];

export const NewEvent: React.FC = () => {
  const [, setLocation] = useLocation();
  const { location: gpsLocation, isLoading: gpsLoading, refreshLocation } = useGeolocation(true);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Earthquake' as TrainingType,
    description: '',
    date: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    locationName: '',
    expectedTrainees: '',
  });

  const [voiceField, setVoiceField] = useState<'name' | 'locationName' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoiceResult = (field: 'name' | 'locationName', text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gpsLocation) {
      alert('Please wait for GPS location to be detected');
      return;
    }

    setIsSubmitting(true);

    try {
      const event = {
        id: `event-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        date: formData.date,
        endDate: formData.endDate,
        location: formData.locationName,
        gps: {
          latitude: gpsLocation.latitude,
          longitude: gpsLocation.longitude,
          accuracy: gpsLocation.accuracy,
        },
        expectedTrainees: parseInt(formData.expectedTrainees) || 0,
        status: 'active' as const,
        createdAt: Date.now(),
        synced: false,
      };

      await db.addEvent(event);

      // Log event creation activity
      await db.addActivity({
        id: `activity-${Date.now()}`,
        eventId: event.id,
        type: 'event_created',
        description: `Event "${event.name}" started`,
        timestamp: Date.now(),
        gps: event.gps,
        synced: false,
      });

      setLocation(`/events/${event.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="New Event">
      <div className="py-4">
        <Card>
          <h2 className="text-section-header font-semibold mb-6">Start New Event</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Event Name"
              placeholder="e.g., Morning Fire Drill"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              voiceEnabled
              onVoiceClick={() => setVoiceField('name')}
              required
            />

            <TextArea
              label="Description (Optional)"
              placeholder="Brief description of the training event..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />

            <Select
              label="Training Type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TrainingType }))}
              options={trainingTypes.map(type => ({ value: type, label: type }))}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
              <Input
                label="End Date & Time"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>

            <Input
              label="Location Name"
              placeholder="e.g., Government School, Gurgaon"
              value={formData.locationName}
              onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
              voiceEnabled
              onVoiceClick={() => setVoiceField('locationName')}
              required
            />

            {/* GPS Location Display */}
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                GPS Coordinates
              </label>
              <Card className="bg-gray-50">
                {gpsLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader size={20} className="animate-spin" />
                    <span className="text-small">Detecting GPS location...</span>
                  </div>
                ) : gpsLocation ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="text-indian-green mt-0.5" />
                      <div className="flex-1">
                        <p className="text-small">
                          <span className="font-medium">Latitude:</span> {gpsLocation.latitude.toFixed(6)}° N
                        </p>
                        <p className="text-small">
                          <span className="font-medium">Longitude:</span> {gpsLocation.longitude.toFixed(6)}° E
                        </p>
                        <p className="text-micro text-gray-500">
                          Accuracy: ±{gpsLocation.accuracy.toFixed(0)}m
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={refreshLocation}
                      className="text-small h-8"
                    >
                      Refresh Location
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-danger-red text-small">
                    Failed to get GPS location
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={refreshLocation}
                      className="mt-2 text-small h-8"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <Input
              label="Expected Trainees"
              type="number"
              placeholder="30"
              value={formData.expectedTrainees}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedTrainees: e.target.value }))}
              required
              min="1"
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="danger"
                onClick={() => setLocation('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || gpsLoading || !gpsLocation}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Start Event'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Voice Input Modals */}
      <VoiceInputModal
        isOpen={voiceField === 'name'}
        onClose={() => setVoiceField(null)}
        onResult={(text) => handleVoiceResult('name', text)}
      />
      <VoiceInputModal
        isOpen={voiceField === 'locationName'}
        onClose={() => setVoiceField(null)}
        onResult={(text) => handleVoiceResult('locationName', text)}
      />
    </Layout>
  );
};
