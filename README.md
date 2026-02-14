# 🏆 SAKSHAM - Runner-Up, SIH 2025

## Smart Alert and Knowledge System for Hazard Awareness and Management

> *Intelligent Disaster Management Platform serving India's vulnerable communities*

---

## ⚡ What is SAKSHAM?

**SAKSHAM** is a comprehensive disaster management platform that won **Runner-Up position at Smart India Hackathon 2025**. It seamlessly integrates AI-powered disaster prediction, real-time alerts, capacity building, and multi-platform accessibility to revolutionize disaster preparedness and response across India.

### The Challenge We Solved
Enable effective disaster management through intelligent prediction systems, multi-platform alert delivery, and capacity building initiatives for vulnerable communities.

### Our Solution
A complete, unified ecosystem of 7 interconnected applications providing:

| Feature | Capability |
|---------|-----------|
| 🤖 **AI Predictions** | Flood, Earthquake, Fire, Cyclone forecasting |
| 📱 **Multi-Platform** | Web, Mobile, USSD, Telegram, PWA |
| 🗺️ **GIS Mapping** | Interactive real-time disaster visualization |
| 📊 **Analytics** | Comprehensive data-driven dashboards |
| 🎓 **Capacity Building** | Training management & resource optimization |
| 🔔 **Real-Time Alerts** | Instant notifications across all platforms |

---

## 🏗️ Architecture Overview

Our system is built as **7 interconnected, scalable modules**:

```
┌─────────────────────────────────────────────────────────────────┐
│               SAKSHAM Disaster Management System                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🤖 AI Engine        📊 Dashboard      🗺️ GIS Mapping           │
│  Predictions         Analytics         Visualization             │
│       ↓                  ↓                   ↓                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    Central Backend API (Node.js + MongoDB + AI)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│       ↓              ↓              ↓              ↓              │
│   📱 Web PWA    🌐 Dashboard   📞 USSD        💬 Telegram      │
│   (All Devices) (Admin Panel)  (Feature Phone)  (Bot Alerts)   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

| Module | Purpose | Technology |
|--------|---------|-----------|
| **AI Prediction Engine** | Disaster forecasting & capacity building | ML + Google AI |
| **Backend API** | Core business logic & data management | Node.js + Express + MongoDB |
| **Web Dashboard** | Admin analytics & real-time monitoring | React + TypeScript + Vite |
| **GIS Mapping** | Interactive disaster visualization | Leaflet + Mapbox |
| **Progressive Web App** | Offline-first mobile experience | PWA + IndexedDB |
| **USSD System** | Feature phone accessibility (no internet) | Node.js |
| **Telegram Bot** | Instant alert delivery | Telegraf + Supabase |

---

## 🚀 Get Started in 5 Minutes

### Prerequisites
```bash
✓ Node.js v18+  ✓ MongoDB  ✓ npm/yarn
```

### Quick Setup

```bash
# 1️⃣ Clone & Navigate
git clone <repository-url>
cd FinalCode

# 2️⃣ Install Backend
cd NDMA-Saksham-BackEnd-main/NDMA-Saksham-BackEnd-main
npm install

# 3️⃣ Install Frontend
cd ../../Saksham_Dashboard-main/Saksham_Dashboard-main
npm install

# 4️⃣ Configure Environment
# Create .env files in each module (see individual READMEs)

# 5️⃣ Run the System
npm start  # Backend runs on :3000
npm run dev  # Frontend runs on :5173
```

> **📖 Detailed setup:** See individual module READMEs in each folder

---

## 📦 Module Breakdown

### 🤖 **AI Prediction Engine**
Real-time disaster forecasting with machine learning
- 🌊 Flood prediction with flow analysis
- 📍 Earthquake detection & impact zones
- 🔥 Forest fire monitoring & spread prediction
- 🌪️ Cyclone trajectory forecasting
- 🎓 Intelligent training gap analysis

### 🔌 **Backend API**
Robust, scalable central command center
- RESTful API (100+ endpoints)
- MongoDB data persistence
- Clerk authentication & authorization
- Google Generative AI integration
- Real-time data streaming

### 📊 **Web Dashboard**
Powerful admin control center
- React 19 + TypeScript
- Real-time analytics with Recharts
- User & resource management
- Alert configuration & monitoring
- Report generation

### 🗺️ **GIS Mapping System**
Interactive disaster visualization
- Real-time Leaflet/Mapbox integration
- Heat map clustering
- Weather overlays & satellite imagery
- Emergency resource location mapping
- Disaster zone highlighting

### 📱 **Progressive Web App**
Works everywhere—online or offline
- Offline-first architecture with IndexedDB
- Push notification support
- Service worker caching (works on 2G!)
- Mobile-responsive design
- Install as native app

### 📞 **USSD System**
*Reaches everyone, even without internet*
- Feature phone compatible (2G networks)
- SMS-based alerts
- Simple menu navigation
- Location-based services
- Zero data required

### 💬 **Telegram Bot**
*Instant, universal notification platform*
- Real-time disaster alerts
- Location-based filtering
- Multi-language support
- Supabase-powered reliability
- Works on all devices

---

## 🛠️ Technology Stack

### **Frontend Excellence**
```
React 19.2.0     TypeScript      Vite (Lightning Fast)
Tailwind CSS     Leaflet Maps    Recharts Dashboard
```

### **Backend Power**
```
Node.js          Express.js      MongoDB Atlas
Mongoose ODM     Clerk Auth      Socket.io (Real-time)
Google AI API    PDFKit          Supabase
```

### **DevOps & Tools**
```
Telegraf Bot     Service Workers  IndexedDB (Offline)
CORS             JWT Auth        Middleware Stack
```

---

## ✨ Key Features at a Glance

| Core Features | Advanced Capabilities |
|---------------|----------------------|
| ✅ Multi-disaster prediction | 🔔 Push notifications |
| ✅ Real-time alert system | 🗺️ Advanced GIS visualization |
| ✅ Interactive mapping | 📈 Predictive analytics |
| ✅ Capacity building analysis | 🤖 AI recommendations |
| ✅ Historical data analytics | 📱 Offline functionality |
| ✅ Mobile-first design | 💬 Telegram integration |
| ✅ Offline support | 📞 USSD on feature phones |
| ✅ Multi-platform access | 📄 Automated PDF reports |

---

## 🏆 Why SAKSHAM Won Runner-Up at SIH 2025

### ✓ **Accessibility First**
Multi-platform support ensures no one gets left behind—from smartphones to feature phones to USSD.

### ✓ **Inclusive Design**
Works without internet, targets India's most vulnerable communities, speaks local languages.

### ✓ **Data-Driven Intelligence**
AI-powered predictions save lives. Machine learning models trained on real disaster data.

### ✓ **Scalable Architecture**
Modular design means government can adopt modules independently and scale nationwide.

### ✓ **Real-Time Response**
Instant alerts across all platforms mean precious minutes saved in disaster response.

### ✓ **Capacity Building**
Not just alerts—we train communities and optimize resource allocation intelligently.

---

## 📄 License & Credits

Developed for **Smart India Hackathon 2025** | **🥈 Runner-Up**

Built with ❤️ for India's disaster management infrastructure.

**Official Partners:** National Disaster Management Authority (NDMA)

---

## 🤝 Get Involved

**Interested in contributing?** We welcome improvements, bug fixes, and feature additions.

```bash
# Found a bug? Create an issue
# Have an idea? Submit a pull request
# Questions? Start a discussion
```

---

## 📞 Support & Contact

**Need help?** Check out:
- 📖 Individual module READMEs
- 🐛 Issues section
- 💬 GitHub Discussions

---

<div align="center">

### 🌟 Made with Vision for Safer India 🌟

**SIH 2025 Runner-Up** | **Disaster Management** | **AI-Powered** | **Nationwide Reach**

</div>

