import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusDot } from '../components/ui/Badge';
import { Edit3, CheckSquare, Camera, FileText, MapPin, Clock, Calendar } from 'lucide-react';
import { db } from '../lib/db';
import type { Event, Activity } from '../types';
import { format, differenceInDays, addDays, parseISO } from 'date-fns';

export const EventDetail: React.FC = () => {
  const [, params] = useRoute('/events/:id');
  const [, setLocation] = useLocation();
  const [event, setEvent] = useState<Event | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    if (params?.id) {
      loadEvent(params.id);
    }
  }, [params?.id]);

  useEffect(() => {
    if (event && event.status === 'active') {
      const interval = setInterval(() => {
        const elapsed = Date.now() - event.createdAt;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        setDuration(`${hours}h ${minutes}m`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [event]);

  const loadEvent = async (id: string) => {
    const eventData = await db.getEvent(id);
    if (eventData) {
      setEvent(eventData);
      const activitiesData = await db.getActivitiesByEvent(id);
      setActivities(activitiesData.sort((a, b) => b.timestamp - a.timestamp));
    }
  };

  const handleCompleteEvent = async () => {
    if (!event) return;

    const updatedEvent = { ...event, status: 'completed' as const };
    await db.updateEvent(updatedEvent);

    await db.addActivity({
      id: `activity-${Date.now()}`,
      eventId: event.id,
      type: 'event_completed',
      description: `Event "${event.name}" completed`,
      timestamp: Date.now(),
      gps: null,
      synced: false,
    });

    setLocation('/');
  };

  // Calculate number of days for multi-day events
  const getDaysList = () => {
    if (!event.endDate) return [{ dayNumber: 1, date: event.date }];

    const startDate = parseISO(event.date);
    const endDate = parseISO(event.endDate);
    const totalDays = differenceInDays(endDate, startDate) + 1;

    return Array.from({ length: totalDays }, (_, index) => ({
      dayNumber: index + 1,
      date: addDays(startDate, index).toISOString(),
    }));
  };

  if (!event) {
    return (
      <Layout title="Event">
        <div className="py-8 text-center">
          <p className="text-body text-gray-500">Loading event...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={event.name}>
      <div className="space-y-4 pb-4">
        {/* Event Header */}
        <Card elevated>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-card-title font-bold mb-1">{event.name}</h2>
              <p className="text-body text-gray-600">{event.type}</p>
            </div>
            {event.status === 'active' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indian-green/10 rounded-full">
                <StatusDot variant="active" pulse />
                <span className="text-small font-medium text-indian-green">Active</span>
              </div>
            )}
          </div>

          {event.status === 'active' && (
            <div className="flex items-center gap-2 mb-4 text-indian-blue">
              <Clock size={18} />
              <span className="text-body font-medium">{duration}</span>
            </div>
          )}

          <div className="space-y-2 text-small">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="text-micro text-gray-500">
              {event.gps.latitude.toFixed(6)}° N, {event.gps.longitude.toFixed(6)}° E
            </div>
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            onClick={() => setLocation(`/events/${event.id}/activities`)}
            className="text-center cursor-pointer"
          >
            <Edit3 size={32} className="mx-auto mb-2 text-indian-blue" />
            <p className="text-small font-medium">Log Activity</p>
          </Card>

          <Card
            onClick={() => setLocation('/attendance')}
            className="text-center cursor-pointer"
          >
            <CheckSquare size={32} className="mx-auto mb-2 text-indian-green" />
            <p className="text-small font-medium">Mark Attendance</p>
          </Card>

          <Card
            onClick={() => setLocation('/media')}
            className="text-center cursor-pointer"
          >
            <Camera size={32} className="mx-auto mb-2 text-saffron" />
            <p className="text-small font-medium">Upload Media</p>
          </Card>

          <Card className="text-center cursor-pointer">
            <FileText size={32} className="mx-auto mb-2 text-amber" />
            <p className="text-small font-medium">Add Notes</p>
          </Card>
        </div>

        {/* Day-wise Reports */}
        <div>
          <h3 className="text-section-header font-semibold mb-3">
            <Calendar size={20} className="inline mr-2" />
            Daily Reports
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {getDaysList().map((day) => (
              <Card
                key={day.dayNumber}
                onClick={() => setLocation(`/events/${event.id}/day/${day.dayNumber}`)}
                className="cursor-pointer hover:shadow-card-elevated transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body font-semibold text-indian-blue">
                      Day {day.dayNumber}
                    </p>
                    <p className="text-small text-gray-600">
                      {format(parseISO(day.date), 'EEEE, MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={24} className="text-gray-400" />
                    <span className="text-small text-gray-500">→</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h3 className="text-section-header font-semibold mb-3">Event Timeline</h3>
          {activities.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-4">No activities logged yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="relative pl-8">
                  <div className="absolute left-4 top-5 w-3 h-3 rounded-full bg-indian-blue" />
                  <div className="absolute left-[22px] top-8 bottom-0 w-0.5 bg-gray-200" />

                  <p className="text-body font-medium mb-1">{activity.description}</p>
                  <p className="text-small text-gray-600 mb-1">{activity.type.replace('_', ' ')}</p>
                  <div className="flex items-center gap-4 text-micro text-gray-500">
                    <span>{format(new Date(activity.timestamp), 'MMM dd, HH:mm:ss')}</span>
                    {activity.gps && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        GPS Logged
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Complete Event Button */}
        {event.status === 'active' && (
          <Button
            variant="success"
            onClick={handleCompleteEvent}
            fullWidth
            className="mt-6"
          >
            Complete Event
          </Button>
        )}
      </div>
    </Layout>
  );
};
