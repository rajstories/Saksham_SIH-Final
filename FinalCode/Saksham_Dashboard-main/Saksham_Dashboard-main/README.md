# Saksham Dashboard

## 🎯 Overview

The **Saksham Dashboard** is the main web-based administrative interface for disaster management officials and coordinators. It provides comprehensive analytics, real-time monitoring, and data visualization for effective disaster response and preparedness.

## 🌟 Key Features

- 📊 **Data Visualization** - Interactive charts with Recharts
- 🗺️ **Map Integration** - Leaflet-based interactive maps
- 📈 **Real-time Analytics** - Live disaster statistics
- 🔔 **Alert Management** - Create and manage alerts
- 👥 **User Management** - Role-based access control
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, intuitive interface with Lucide icons

## 📁 Project Structure

```
Saksham_Dashboard-main/
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   ├── utils/             # Helper utilities
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

1. **Navigate to project directory**
   ```bash
   cd Saksham_Dashboard-main/Saksham_Dashboard-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (if needed)
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_MAPBOX_TOKEN=your_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
   ```
   http://localhost:5173
   ```

## 🛠️ Technology Stack

### Core
- **React** v19.2.0 - UI framework
- **TypeScript** ~5.9.3 - Type safety
- **Vite** v7.2.4 - Build tool and dev server

### UI & Visualization
- **Recharts** v2.10.0 - Chart library
- **React Leaflet** v4.2.1 - Map components
- **Leaflet** v1.9.4 - Mapping library
- **Lucide React** v0.400.0 - Icon library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - React fast refresh

## 📊 Dashboard Features

### Analytics Dashboard
- **Disaster Statistics** - Total incidents, casualties, affected areas
- **Trend Analysis** - Historical data visualization
- **Performance Metrics** - Response times, coverage rates
- **Resource Utilization** - Equipment and personnel tracking

### Map Dashboard
- **Interactive Maps** - View disaster locations
- **Heat Maps** - Intensity visualization
- **Resource Markers** - Emergency services locations
- **Real-time Updates** - Live disaster tracking

### Alert Management
- **Create Alerts** - Issue new disaster warnings
- **Alert History** - View past notifications
- **Priority Levels** - CRITICAL, HIGH, MEDIUM, LOW
- **Multi-channel** - Push to all platforms

### User Management
- **Role Assignment** - Admin, Coordinator, Viewer
- **Access Control** - Permission-based features
- **Activity Logs** - Track user actions
- **Team Management** - Organize response teams

## 🎨 Components

### Key Components
```typescript
// Dashboard cards
<StatCard title="Active Alerts" value={42} trend="+12%" />

// Charts
<LineChart data={trendData} />
<BarChart data={categoryData} />
<PieChart data={distributionData} />

// Map
<MapView disasters={disasters} resources={resources} />

// Data tables
<DataTable columns={columns} data={data} />

// Alert forms
<AlertForm onSubmit={handleSubmit} />
```

## 📡 API Integration

### Service Layer
```typescript
// services/api.ts
export const dashboardAPI = {
  getStatistics: () => axios.get('/api/statistics'),
  getAlerts: () => axios.get('/api/alerts'),
  getDisasters: () => axios.get('/api/disasters'),
  createAlert: (data) => axios.post('/api/alerts', data)
};
```

## 🎯 User Roles

### Administrator
- Full system access
- User management
- Configuration settings
- System analytics

### Coordinator
- Alert creation
- Resource management
- Team coordination
- Report generation

### Viewer
- Read-only access
- View dashboards
- Download reports
- Monitor alerts

## 📱 Responsive Design

- **Desktop** (1920px+) - Full dashboard layout
- **Laptop** (1366px - 1920px) - Optimized layout
- **Tablet** (768px - 1366px) - Stacked components
- **Mobile** (< 768px) - Single column, drawer navigation

## 🔧 Scripts

```bash
# Development server with hot reload
npm run dev

# Type check
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
```

Output directory: `dist/`

### Deploy
```bash
# Preview before deployment
npm run preview

# Deploy to hosting (example: Vercel)
vercel deploy
```

### Recommended Hosting
- **Vercel** - Optimized for Vite
- **Netlify** - Easy deployment
- **Cloudflare Pages** - Fast CDN
- **GitHub Pages** - Free static hosting

## 🎨 Theming & Customization

### Color Scheme
```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

### Custom Components
Create reusable components in `src/components/`

## 🔐 Security

- Environment variables for sensitive data
- Input validation on forms
- XSS protection
- CSRF tokens for API calls
- Role-based route protection

## 📈 Performance

- Code splitting with React.lazy()
- Optimized chart rendering
- Memoized components
- Virtualized long lists
- Image lazy loading

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

### Type Errors
```bash
# Check TypeScript
npm run build
```

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts Examples](https://recharts.org/)
- [Leaflet Tutorials](https://leafletjs.com/examples.html)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use ESLint configuration
3. Write meaningful component names
4. Comment complex logic
5. Test responsive design

---

**Part of SAKSHAM - SIH 2025 Project**
