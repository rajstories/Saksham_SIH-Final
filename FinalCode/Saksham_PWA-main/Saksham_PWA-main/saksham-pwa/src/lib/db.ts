import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface SakshamDB extends DBSchema {
  events: {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      date: string;
      location: string;
      gps: { latitude: number; longitude: number };
      expectedTrainees: number;
      status: 'active' | 'completed';
      createdAt: number;
      synced: boolean;
    };
    indexes: { 'by-date': number; 'by-status': string };
  };
  activities: {
    key: string;
    value: {
      id: string;
      eventId: string;
      type: string;
      description: string;
      timestamp: number;
      gps: { latitude: number; longitude: number } | null;
      synced: boolean;
    };
    indexes: { 'by-event': string; 'by-timestamp': number };
  };
  attendance: {
    key: string;
    value: {
      id: string;
      eventId: string;
      traineeId: string;
      traineeName: string;
      status: 'present' | 'absent';
      timestamp: number;
      method: 'manual' | 'qr';
      synced: boolean;
    };
    indexes: { 'by-event': string };
  };
  media: {
    key: string;
    value: {
      id: string;
      eventId: string;
      type: 'photo' | 'video';
      blob: Blob;
      thumbnail?: string;
      timestamp: number;
      gps: { latitude: number; longitude: number } | null;
      synced: boolean;
    };
    indexes: { 'by-event': string; 'by-timestamp': number };
  };
  trainees: {
    key: string;
    value: {
      id: string;
      name: string;
      photo?: string;
      phone?: string;
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: any;
    };
  };
}

const DB_NAME = 'saksham-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SakshamDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<SakshamDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SakshamDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Events store
      if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('by-date', 'createdAt');
        eventStore.createIndex('by-status', 'status');
      }

      // Activities store
      if (!db.objectStoreNames.contains('activities')) {
        const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
        activityStore.createIndex('by-event', 'eventId');
        activityStore.createIndex('by-timestamp', 'timestamp');
      }

      // Attendance store
      if (!db.objectStoreNames.contains('attendance')) {
        const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id' });
        attendanceStore.createIndex('by-event', 'eventId');
      }

      // Media store
      if (!db.objectStoreNames.contains('media')) {
        const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
        mediaStore.createIndex('by-event', 'eventId');
        mediaStore.createIndex('by-timestamp', 'timestamp');
      }

      // Trainees store
      if (!db.objectStoreNames.contains('trainees')) {
        db.createObjectStore('trainees', { keyPath: 'id' });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
};

export const db = {
  // Events
  async addEvent(event: SakshamDB['events']['value']) {
    const database = await initDB();
    return database.add('events', event);
  },

  async getEvent(id: string) {
    const database = await initDB();
    return database.get('events', id);
  },

  async getAllEvents() {
    const database = await initDB();
    return database.getAll('events');
  },

  async getActiveEvents() {
    const database = await initDB();
    const index = database.transaction('events').store.index('by-status');
    return index.getAll('active');
  },

  async updateEvent(event: SakshamDB['events']['value']) {
    const database = await initDB();
    return database.put('events', event);
  },

  // Activities
  async addActivity(activity: SakshamDB['activities']['value']) {
    const database = await initDB();
    return database.add('activities', activity);
  },

  async getActivitiesByEvent(eventId: string) {
    const database = await initDB();
    const index = database.transaction('activities').store.index('by-event');
    return index.getAll(eventId);
  },

  // Attendance
  async addAttendance(attendance: SakshamDB['attendance']['value']) {
    const database = await initDB();
    return database.add('attendance', attendance);
  },

  async getAttendanceByEvent(eventId: string) {
    const database = await initDB();
    const index = database.transaction('attendance').store.index('by-event');
    return index.getAll(eventId);
  },

  async updateAttendance(attendance: SakshamDB['attendance']['value']) {
    const database = await initDB();
    return database.put('attendance', attendance);
  },

  // Media
  async addMedia(media: SakshamDB['media']['value']) {
    const database = await initDB();
    return database.add('media', media);
  },

  async getMediaByEvent(eventId: string) {
    const database = await initDB();
    const index = database.transaction('media').store.index('by-event');
    return index.getAll(eventId);
  },

  async getAllUnsyncedMedia() {
    const database = await initDB();
    const allMedia = await database.getAll('media');
    return allMedia.filter(m => !m.synced);
  },

  // Trainees
  async addTrainee(trainee: SakshamDB['trainees']['value']) {
    const database = await initDB();
    return database.add('trainees', trainee);
  },

  async getTrainee(id: string) {
    const database = await initDB();
    return database.get('trainees', id);
  },

  async getAllTrainees() {
    const database = await initDB();
    return database.getAll('trainees');
  },

  // Settings
  async getSetting(key: string) {
    const database = await initDB();
    const setting = await database.get('settings', key);
    return setting?.value;
  },

  async setSetting(key: string, value: any) {
    const database = await initDB();
    return database.put('settings', { key, value });
  },

  // Sync helpers
  async getUnsyncedItems() {
    const database = await initDB();
    const [events, activities, attendance, media] = await Promise.all([
      database.getAll('events'),
      database.getAll('activities'),
      database.getAll('attendance'),
      database.getAll('media'),
    ]);

    return {
      events: events.filter(e => !e.synced),
      activities: activities.filter(a => !a.synced),
      attendance: attendance.filter(a => !a.synced),
      media: media.filter(m => !m.synced),
    };
  },
};
