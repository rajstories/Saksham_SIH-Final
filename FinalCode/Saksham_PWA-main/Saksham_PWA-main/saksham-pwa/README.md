# SAKSHAM - NDMA Training Monitor

![SAKSHAM Logo](public/icon.svg)

**SAKSHAM** is a voice-first, offline-capable Progressive Web App (PWA) designed for NDMA (National Disaster Management Authority) ground staff instructors to monitor disaster management training drills in real-time across India, including remote rural areas with poor connectivity.

## 🎯 Project Overview

- **Competition:** Smart India Hackathon 2025 Grand Finale
- **Team:** GeoVision
- **Target Users:** NDMA Ground Staff/Instructors
- **Use Case:** Real-time disaster management training monitoring system

## ✨ Key Features

### 🎤 Voice-First Interface
- **Hindi + English support** with automatic language detection
- Voice input for event names, locations, and notes
- Real-time speech-to-text transcription
- Voice confirmations after actions

### 📴 Offline-First Architecture
- **Complete offline functionality** - all features work without internet
- IndexedDB for local data storage
- Automatic sync when connectivity returns
- Service Worker caching for instant load times
- PWA installable on Android and iOS

### 📍 GPS Location Tracking
- Auto-capture GPS coordinates for events
- Location tracking for all activities
- Accuracy indicators (±10m precision)
- Embedded maps with Leaflet.js

### 📸 Media Management
- Camera capture with thumbnail generation
- Video recording support
- Gallery upload functionality
- Offline media queue with auto-sync
- GPS tagging for all media

### ✅ Attendance System
- **Manual entry mode** with search and filters
- **QR code scanning** for instant attendance
- Bulk "Mark All Present" functionality
- Real-time attendance statistics
- Present/Absent tracking with timestamps

### 📊 Event Logging
- Create and manage training events
- Real-time activity timeline
- Event duration tracking
- Multiple training types (Fire Drill, Earthquake, Flood Response, etc.)
- Event completion reports

### 🌐 Multilingual Support
- English, Hindi (हिंदी), Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు)

## 🎨 Design System

### Government-Appropriate Theme
- **Indian Blue:** `#000080` (Primary)
- **Saffron Orange:** `#FF9933` (Actions)
- **Indian Green:** `#138808` (Success)
- Mobile-first responsive design
- Touch-friendly 48px minimum targets

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Wouter, Lucide React
- **Storage:** IndexedDB (idb), Service Workers (Workbox)
- **APIs:** Web Speech API, Geolocation API, Camera API, html5-qrcode
- **Maps:** Leaflet.js

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Quick Start

1. Open [http://localhost:5173](http://localhost:5173) in your browser
2. Allow microphone and location permissions
3. Start exploring the app features!

## 📱 PWA Installation

### Android (Chrome):
Menu (⋮) → "Install app"

### iOS (Safari):
Share button → "Add to Home Screen"

## 📂 Project Structure

```
saksham-pwa/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities (IndexedDB)
│   └── types/         # TypeScript types
├── public/            # Static assets
└── dist/              # Production build
```

## 🎯 Smart India Hackathon Features

✅ Voice-first interface for low-literacy users
✅ Offline-capable for rural areas
✅ GPS tracking for location verification
✅ Real-time monitoring of training drills
✅ Multi-language support for pan-India deployment
✅ Mobile-first design for field staff
✅ QR code scanning for quick attendance
✅ Media capture for evidence and reporting

## 👥 Team GeoVision

Built with ❤️ for NDMA and disaster management training across India

**🙏 Namaste** - Thank you for using SAKSHAM!
