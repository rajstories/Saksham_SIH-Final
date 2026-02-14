import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Link } from 'wouter';
import { db } from '../lib/db';
import type { Event } from '../types';
import { format } from 'date-fns';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const allEvents = await db.getAllEvents();
    setEvents(allEvents.sort((a, b) => b.createdAt - a.createdAt));
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const stats = {
    total: events.length,
    active: events.filter(e => e.status === 'active').length,
    completed: events.filter(e => e.status === 'completed').length,
  };

  return (
    <Layout title="Events">
      <div className="space-y-4 pb-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-indian-blue">{stats.total}</p>
            <p className="text-micro text-gray-600">Total</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-indian-green">{stats.active}</p>
            <p className="text-micro text-gray-600">Active</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            <p className="text-micro text-gray-600">Completed</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-200 rounded-button p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-button transition-all text-small ${filter === 'all'
              ? 'bg-white shadow text-indian-blue font-medium'
              : 'text-gray-600'
              }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 rounded-button transition-all text-small ${filter === 'active'
              ? 'bg-white shadow text-indian-blue font-medium'
              : 'text-gray-600'
              }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 rounded-button transition-all text-small ${filter === 'completed'
              ? 'bg-white shadow text-indian-blue font-medium'
              : 'text-gray-600'
              }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* New Event Button */}
        <Link href="/events/new">
          <Button
            icon={Plus}
            variant="secondary"
            fullWidth
            className="bg-gradient-to-r from-saffron to-amber"
          >
            Start New Event
          </Button>
        </Link>

        {/* Events List */}
        <div>
          <h3 className="text-section-header font-semibold mb-3">
            {filter === 'all' ? 'All Events' : filter === 'active' ? 'Active Events' : 'Completed Events'}
          </h3>

          {filteredEvents.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-body text-gray-500">No events found</p>
                <p className="text-small text-gray-400 mt-1">
                  {filter === 'all'
                    ? 'Start your first event!'
                    : `No ${filter} events yet`}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:shadow-card-elevated transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-body mb-1">{event.name}</h4>
                        <p className="text-small text-gray-600">{event.type}</p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-micro font-medium ${event.status === 'active'
                          ? 'bg-indian-green/10 text-indian-green'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-small text-gray-600">
                        <Calendar size={14} />
                        <span>{format(new Date(event.date), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-small text-gray-600">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-micro text-gray-500">
                      <span>Expected: {event.expectedTrainees} trainees</span>
                      {!event.synced && (
                        <span className="text-amber">● Not synced</span>
                      )}
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
