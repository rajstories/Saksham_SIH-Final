# Saksham PWA (Progressive Web App)

## 🎯 Overview

The **Saksham PWA** is a Progressive Web App that provides offline-first disaster alert access for citizens. It enables users to receive critical disaster information even without internet connectivity, making it ideal for areas with poor network coverage or during emergencies when connectivity is disrupted.

## 🌟 Key Features

- 📴 **Offline-First Design** - Works without internet connection
- 💾 **Local Data Storage** - IndexedDB for persistent data
- 🔔 **Push Notifications** - Real-time alerts even when offline
- 📱 **Installable** - Add to home screen like native app
- 🔄 **Background Sync** - Syncs data when connectivity returns
- ⚡ **Fast & Lightweight** - Optimized for low-end devices
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 🌐 **Cross-Platform** - Works on Android, iOS, Desktop

## 📁 Project Structure

```
Saksham_PWA-main/
├── src/
│   ├── components/          # React components
│   │   ├── AlertCard.tsx   # Alert display component
│   │   ├── Header.tsx      # App header
│   │   └── InstallPrompt.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Alerts.tsx
│   │   ├── SavedAlerts.tsx
│   │   └── Settings.tsx
│   ├── db/                 # IndexedDB utilities
│   │   └── database.ts     # IDB wrapper
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Helper utilities
│   ├── App.tsx             # Main app
│   ├── main.tsx            # Entry point
│   └── sw.ts               # Service worker
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── icons/              # App icons
│   └── offline.html        # Offline fallback
├── index.html
├── vite.config.ts
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- Modern browser with PWA support
- npm or yarn

### Installation

1. **Navigate to project directory**
   ```bash
   cd Saksham_PWA-main/Saksham_PWA-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the PWA**
   ```
   http://localhost:5173
   ```

### Installing as PWA

1. Open in browser (Chrome, Edge, Safari)
2. Click "Install" prompt or menu option
3. App will be added to home screen/app drawer
4. Launch like a native app

## 🛠️ Technology Stack

### Core
- **React** v19.2.0 - UI framework
- **TypeScript** ~5.9.3 - Type safety
- **Vite** v7.2.4 - Build tool & PWA plugin

### Routing
- **Wouter** v3.8.0 - Lightweight routing (~1KB)

### Styling
- **Tailwind CSS** v3.4.14 - Utility-first CSS
- **PostCSS** v8.5.6 - CSS processing
- **Autoprefixer** v10.4.22 - Vendor prefixes

### Data Storage
- **IDB** v8.0.3 - IndexedDB wrapper
- **clsx** v2.1.1 - Conditional classNames

### Icons & UI
- **Lucide React** v0.555.0 - Icon library

### PWA
- **Service Worker** - Custom implementation
- **Web App Manifest** - PWA configuration
- **Cache API** - Resource caching
- **Background Sync** - Offline queue

## 💾 Offline Features

### Service Worker
```javascript
// Caching strategies
- Cache First - Static assets (HTML, CSS, JS, images)
- Network First - API calls with fallback
- Stale While Revalidate - Dynamic content

// Offline fallback
- Shows cached alerts when offline
- Queues actions for sync when online
- Displays offline indicator
```

### IndexedDB Storage
```typescript
// Stores
- alerts: Disaster alerts
- savedAlerts: User bookmarks
- settings: User preferences
- syncQueue: Pending actions

// Features
- Automatic cleanup of old data
- Full-text search capability
- Efficient querying
```

### Background Sync
```javascript
// Syncs when connectivity returns
- Queued alert subscriptions
- Deferred notifications
- Pending user actions
```

## 📱 PWA Manifest

```json
{
  "name": "Saksham - Disaster Alerts",
  "short_name": "Saksham",
  "description": "Offline disaster alert system",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔔 Push Notifications

### Setup
```typescript
// Request permission
const permission = await Notification.requestPermission();

// Subscribe to push
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: VAPID_PUBLIC_KEY
});
```

### Notification Types
- 🔴 **CRITICAL** - Immediate danger (sound + vibration)
- 🟠 **HIGH** - Urgent warning (sound)
- 🟡 **MEDIUM** - Advisory (vibration)
- 🟢 **LOW** - Information (silent)

## 🎨 Components

### Core Components
```typescript
// Alert display
<AlertCard alert={alert} onSave={handleSave} />

// Install prompt
<InstallPrompt />

// Offline indicator
<OfflineIndicator />

// Search
<SearchBar onSearch={handleSearch} />

// Filter
<AlertFilter filters={filters} onChange={handleChange} />
```

## 🎯 User Features

### Home Page
- Latest alerts
- Location-based filtering
- Quick actions
- Offline status

### Alerts Page
- All disaster alerts
- Filter by type/severity
- Search functionality
- Real-time updates

### Saved Alerts
- Bookmarked alerts
- Offline access
- Export capability
- Share options

### Settings
- Location preferences
- Notification settings
- Language selection
- Cache management

## 📊 Database Schema

```typescript
// Alert interface
interface Alert {
  id: string;
  type: 'flood' | 'earthquake' | 'fire' | 'cyclone';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: {
    district: string;
    state: string;
    coordinates: [number, number];
  };
  timestamp: Date;
  expiresAt: Date;
  savedLocally?: boolean;
}
```

## 🔧 Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
```

Generates:
- `dist/` - Static files
- Service worker with precaching
- Optimized assets
- PWA manifest

### Deploy Options
- **Netlify** - Automatic HTTPS, easy setup
- **Vercel** - Optimized for modern frameworks
- **Firebase Hosting** - Google infrastructure
- **GitHub Pages** - Free with custom domain

### Post-Deploy
1. Test PWA installability
2. Verify service worker registration
3. Check offline functionality
4. Test push notifications

## 🔐 Security

- HTTPS required for PWA features
- Content Security Policy (CSP)
- Secure service worker scope
- Input sanitization
- Safe storage practices

## 📈 Performance

### Lighthouse Scores (Target)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100
- **PWA**: 100

### Optimizations
- Code splitting by route
- Lazy loading images
- Compressed assets
- Minimal bundle size
- Efficient caching

## 📱 Platform Support

### Desktop
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+

### Mobile
- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ✅ Samsung Internet 14+
- ✅ Opera Mobile 64+

## 🐛 Troubleshooting

### Service Worker Not Registering
```bash
# Check HTTPS (required)
# Clear cache and hard reload
# Verify service worker file path
```

### Offline Not Working
```bash
# Check service worker status in DevTools
# Verify cache strategy
# Test with DevTools offline mode
```

### Push Notifications Failing
```bash
# Verify VAPID keys
# Check notification permission
# Test on HTTPS
```

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## 🎯 Use Cases

### During Disasters
- Access alerts without internet
- Receive critical notifications
- View saved emergency contacts
- Check evacuation routes offline

### Daily Use
- Monitor disaster forecasts
- Receive timely warnings
- Share alerts with family
- Track historical incidents

## 🤝 Contributing

1. Follow React best practices
2. Ensure offline functionality
3. Test on multiple devices
4. Maintain PWA standards
5. Update service worker version

---

**Part of SAKSHAM - SIH 2025 Project**
