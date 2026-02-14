import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockTrainings } from '../../data/mockData';
import { INDIA_CENTER, INDIA_ZOOM } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

const createCustomIcon = (color: string) => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const getMarkerColor = (institutionType: string) => {
  switch (institutionType) {
    case 'NGO':
      return '#FF9933';
    case 'Government':
      return '#002147';
    case 'SDMA':
      return '#FF6B35';
    case 'ATI':
      return '#4CAF50';
    default:
      return '#666666';
  }
};

export const IndiaMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerId = useRef(`india-map-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
            Training Locations Map
          </h2>
        </div>
        <div className="h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
          Training Locations Map
        </h2>
        <div className="flex items-center space-x-4 text-xs flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#002147]"></div>
            <span>Government</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
            <span>NGO</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6B35]"></div>
            <span>SDMA</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
            <span>ATI</span>
          </div>
        </div>
      </div>
      <div className="h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden border border-gray-200">
        {typeof window !== 'undefined' && (
          <MapContainer
            key={mapContainerId.current}
            center={INDIA_CENTER}
            zoom={INDIA_ZOOM}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mockTrainings.map((training) => {
              try {
                const icon = createCustomIcon(getMarkerColor(training.institutionType));
                if (!icon) return null;
                
                return (
                  <Marker
                    key={training.id}
                    position={[training.location.lat, training.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-sm mb-1">{training.title}</h3>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Theme:</strong> {training.theme}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Location:</strong> {training.location.district}, {training.location.state}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Institution:</strong> {training.institution}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Attendees:</strong> {training.attendees}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Date:</strong> {new Date(training.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              } catch (error) {
                console.error('Error rendering marker:', error);
                return null;
              }
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
