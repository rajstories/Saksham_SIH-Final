<div align="center">

# 🏛️ SAKSHAM
### Smart Alert and Knowledge System for Hazard Awareness and Management
**🥈 Runner-Up @ Smart India Hackathon (SIH) 2025**

[![SIH 2025](https://img.shields.io/badge/SIH-2025_Runner--Up-gold?style=for-the-badge&logo=github)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

---

> *"An intelligent, multi-platform ecosystem designed to revolutionize disaster preparedness and response for Bharat."*

[Explore Modules](#-the-saksham-suite) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Why We Won](#-winning-edge)

</div>

---

## ⚡ What is SAKSHAM?

**SAKSHAM** is a mission-critical disaster management ecosystem developed for **SIH 2025**. It bridges the gap between high-tech AI predictions and ground-level accessibility. Whether you're an official in a command center or a citizen with a 2G feature phone, SAKSHAM keeps you safe.

### 🎯 Key Impact Areas
| Impact | Description |
| :--- | :--- |
| 🛡️ **Prevention** | AI predicts floods, earthquakes, and fires before they strike. |
| 📢 **Propagation** | Alerts reach Web, Mobile, Telegram, and USSD (No Internet needed). |
| 🤝 **Preparedness** | Gap analysis for local training and resource capacity building. |
| 📊 **Policy** | Data-driven dashboards for NDMA/SDMA officials. |

---

## 📦 The SAKSHAM Suite

We built **7 specialized modules** that work in perfect harmony:

| Icon | Module | Core Functionality | Platform |
| :---: | :--- | :--- | :--- |
| 🤖 | **AI Prediction** | ML models for Flood, Fire & Earthquake | Cloud Engine |
| ⚙️ | **Central API** | The "Brain" - Secured with Clerk & JWT | Backend |
| 📊 | **Admin Desk** | Real-time analytics & resource tracking | Web (Admin) |
| 🗺️ | **GIS Map** | Live disaster visualization & heatmaps | Interactive Web |
| 📱 | **Citizen PWA** | Offline-ready app for alerts & reporting | Mobile Web |
| 📞 | **USSD Portal** | Internet-free emergency access (*888#) | Feature Phone |
| 💬 | **Telegram Bot** | Instant localized push notifications | Messaging |

---

## 🚀 Get Started

### 🛠️ Global Prerequisites
*   **Node.js** (v18.x+)
*   **MongoDB** (Local or Atlas)
*   **Git** (For cloning)

### ⚡ Rapid Installation

```bash
# 1. Clone the entire ecosystem
git clone https://github.com/rajstories/Saksham_SIH-Final.git
cd Saksham_SIH-Final

# 2. Setup Backend (The Brain)
cd FinalCode/NDMA-Saksham-BackEnd-main/NDMA-Saksham-BackEnd-main
npm install && npm start

# 3. Launch Dashboard (The Eyes)
cd ../../Saksham_Dashboard-main/Saksham_Dashboard-main
npm install && npm run dev
```

---

## 🏗️ Technical Architecture

```mermaid
graph TD
    A[Citizen Reporting / Sensors] -->|PWA / USSD| B(Central API)
    B --> C{AI Prediction Engine}
    C -->|Forecasts| B
    B --> D[Admin Dashboard]
    B --> E[Public Interactive Map]
    B -->|Push| F[Telegram Bot]
    B -->|Offline| G[USSD / SMS Gateway]
```

---

## 🛠️ Tech Stack

### 🎨 Frontend & UI
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)
![PostCSS](https://img.shields.io/badge/postcss-%23DD3A0A.svg?style=flat-square&logo=postcss&logoColor=white)

### ⚙️ Backend & AI
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=flat-square&logo=google&logoColor=white)

### 🔧 Utilities & Tools
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat-square&logo=mapbox&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat-square&logo=telegram&logoColor=white)

---

## 🏆 Winning Edge

**What set SAKSHAM apart at SIH 2025?**

*   **🌐 True Multi-Platformity**: We don't just target iPhone users. Our **USSD engine** ensures the person in the remotest village of Odisha gets an alert on their Nokia 1100.
*   **⚡ Offline-First Philosophy**: Disasters destroy infrastructure. Our PWA uses **IndexedDB** to local-cache data and sync when the network returns.
*   **🤖 Responsible AI**: We use generative AI not just for predictions, but for **training gap analysis**, recommending specific drills for specific districts.
*   **📍 Hyper-Local GIS**: Our maps don't just show disasters; they show the nearest **NDRF units, blood banks, and food shelters** in real-time.

---

## 🌪️ Disaster Coverage Matrix
| Hazard | Prediction Model | Alert Trigger | Strategy |
| :--- | :---: | :---: | :--- |
| **Flood** | RNN-LSTM | Threshold Cross | Evacuation Routes |
| **Earthquake** | Seismic ML | Wave Detection | Shelter Mapping |
| **Forest Fire** | Thermal Imaging | Heat Anomaly | Fire Containment |
| **Cyclone** | Path Matrix | Wind Velocity | Coastline Shield |

---

## 🤝 Roadmap & Contributing

1.  **Phase 1**: Regional Language Support (Hindi, Bengali, Marathi, etc.) 🏗️
2.  **Phase 2**: Real-time Satellite Imagery Integration 🛰️
3.  **Phase 3**: IoT Sensor Network Mesh 📡

We love contributors! If you have an idea to make India safer, **Fork & PR!**

---

<div align="center">

### 🌟 Give this project a STAR if you liked it! 🌟

**Developed with 🧡 for SIH 2025**
[Contact Us](https://github.com/rajstories) • [Report Bug](https://github.com/rajstories/Saksham_SIH-Final/issues)

</div>

