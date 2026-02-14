import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Calendar, Users, Camera, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { db } from '../lib/db';
import type { Event } from '../types';
import { format } from 'date-fns';

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalTrainees: 0,
    photosUploaded: 0,
    pendingSyncs: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const events = await db.getAllEvents();
    const activeEvents = events.filter(e => e.status === 'active');
    const unsyncedItems = await db.getUnsyncedItems();
    const allMedia = await db.getAllUnsyncedMedia();

    // Calculate total trainees from today's events
    const today = new Date().toDateString();
    const todayEvents = events.filter(e => new Date(e.date).toDateString() === today);
    const totalTrainees = todayEvents.reduce((sum, e) => sum + e.expectedTrainees, 0);

    setStats({
      activeEvents: activeEvents.length,
      totalTrainees,
      photosUploaded: allMedia.length,
      pendingSyncs: Object.values(unsyncedItems).flat().length,
    });

    setRecentEvents(events.slice(0, 5).sort((a, b) => b.createdAt - a.createdAt));
  };

  return (
    <Layout title="SAKSHAM">
      <div className="space-y-6 pb-4">
        {/* Welcome Card */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron to-amber flex items-center justify-center text-2xl">
              🙏
            </div>
            <div>
              <h2 className="text-card-title font-semibold">Namaste, Instructor</h2>
              <p className="text-small text-gray-600">Welcome back to SAKSHAM</p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <Calendar size={32} className="mx-auto mb-2 text-indian-blue" />
            <p className="text-2xl font-bold text-indian-blue">{stats.activeEvents}</p>
            <p className="text-small text-gray-600">Active Events Today</p>
          </Card>

          <Card className="text-center">
            <Users size={32} className="mx-auto mb-2 text-indian-green" />
            <p className="text-2xl font-bold text-indian-green">{stats.totalTrainees}</p>
            <p className="text-small text-gray-600">Trainees Present</p>
          </Card>

          <Card className="text-center">
            <Camera size={32} className="mx-auto mb-2 text-saffron" />
            <p className="text-2xl font-bold text-saffron">{stats.photosUploaded}</p>
            <p className="text-small text-gray-600">Photos Uploaded</p>
          </Card>

          <Card className="text-center">
            <RefreshCw size={32} className="mx-auto mb-2 text-amber" />
            <p className="text-2xl font-bold text-amber">{stats.pendingSyncs}</p>
            <p className="text-small text-gray-600">Pending Syncs</p>
          </Card>
        </div>

        {/* Start New Event Button */}
        <Link href="/events/new">
          <Button
            icon={Plus}
            variant="secondary"
            fullWidth
            className="bg-gradient-to-r from-saffron to-amber text-white h-16 text-lg shadow-lg"
          >
            Start New Event
          </Button>
        </Link>

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-section-header font-semibold">Recent Events</h3>
            <Link href="/events">
              <a className="text-small text-indian-blue font-medium">View All</a>
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                No events yet. Start your first event!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:shadow-card-elevated transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-body mb-1">{event.name}</h4>
                        <p className="text-small text-gray-600 mb-1">{event.type}</p>
                        <p className="text-micro text-gray-500">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded text-micro font-medium ${event.status === 'active'
                            ? 'bg-indian-green/10 text-indian-green'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {event.status}
                        </span>
                        <p className="text-micro text-gray-500 mt-1">
                          {format(new Date(event.date), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
