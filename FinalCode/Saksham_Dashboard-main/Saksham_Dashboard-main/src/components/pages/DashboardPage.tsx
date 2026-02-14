import { KPIGrid } from '../dashboard/KPIGrid';
import { RecentActivities } from '../dashboard/RecentActivities';
import { QuickActions } from '../dashboard/QuickActions';
import { useState, useEffect } from 'react';

// Conditionally load map only when needed
let IndiaMapComponent: any = null;

const loadMap = async () => {
  try {
    const module = await import('../dashboard/IndiaMap');
    IndiaMapComponent = module.IndiaMap;
    return true;
  } catch (error) {
    console.error('Failed to load map:', error);
    return false;
  }
};

export const DashboardPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    loadMap().then((success) => {
      setMapLoaded(success);
      if (!success) setMapError(true);
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* KPI Cards */}
      <KPIGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Interactive India Map with Training Locations */}
        <div className="lg:col-span-2">
          {mapError ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
                Training Locations Map
              </h2>
              <div className="h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Map temporarily unavailable</p>
              </div>
            </div>
          ) : mapLoaded && IndiaMapComponent ? (
            <IndiaMapComponent />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
                Training Locations Map
              </h2>
              <div className="h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

