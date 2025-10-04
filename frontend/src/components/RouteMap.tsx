import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTransition } from 'react';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color: string, type: 'start' | 'stop' | 'end') => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 12px;
    ">
      ${type === 'start' ? 'S' : type === 'end' ? 'E' : '●'}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface RouteLocation {
  name: string;
  coordinates: [number, number];
  type: 'start' | 'stop' | 'end';
}

interface RouteMapProps {
  locations: RouteLocation[];
  className?: string;
}

// Component to fit map bounds to show all markers
const FitBounds: React.FC<{ locations: RouteLocation[] }> = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations, map]);

  return null;
};

// Mock geocoding function (in a real app, you'd use a proper geocoding service)
const mockGeocode = async (locationName: string): Promise<[number, number] | null> => {
  // Mock coordinates for popular destinations
  const mockCoordinates: { [key: string]: [number, number] } = {
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'houston': [29.7604, -95.3698],
    'phoenix': [33.4484, -112.0740],
    'philadelphia': [39.9526, -75.1652],
    'san antonio': [29.4241, -98.4936],
    'san diego': [32.7157, -117.1611],
    'dallas': [32.7767, -96.7970],
    'san jose': [37.3382, -121.8863],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'tokyo': [35.6762, 139.6503],
    'berlin': [52.5200, 13.4050],
    'rome': [41.9028, 12.4964],
    'barcelona': [41.3851, 2.1734],
    'amsterdam': [52.3676, 4.9041],
    'vienna': [48.2082, 16.3738],
    'prague': [50.0755, 14.4378],
    'budapest': [47.4979, 19.0402],
  };

  const normalizedName = locationName.toLowerCase().trim();
  
  // Try exact match first
  if (mockCoordinates[normalizedName]) {
    return mockCoordinates[normalizedName];
  }

  // Try partial match
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return coords;
    }
  }

  // If no match found, return a default location (center of US)
  return [39.8283, -98.5795];
};

const RouteMap: React.FC<RouteMapProps> = ({ locations, className = '' }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locations.length > 1) {
      // Create route coordinates by connecting all locations in order
      const coords = locations.map(loc => loc.coordinates);
      setRouteCoordinates(coords);
    } else {
      setRouteCoordinates([]);
    }
  }, [locations]);

  if (locations.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-accent/30 rounded-lg ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🗺️</div>
          <p>t("Enter locations to see the route map")</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={locations[0]?.coordinates || [39.8283, -98.5795]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* Dark theme tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />
        
        {/* Markers for each location */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            icon={createCustomIcon(
              location.type === 'start' ? '#22c55e' : 
              location.type === 'end' ? '#ef4444' : '#3b82f6',
              location.type
            )}
          >
            <Popup>
              <div className="text-sm">
                <strong>{location.type === 'start' ? 'Start' : location.type === 'end' ? 'Destination' : `Stop ${index}`}</strong>
                <br />
                {location.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
            dashArray="10, 5"
          />
        )}

        {/* Fit bounds to show all locations */}
        <FitBounds locations={locations} />
      </MapContainer>
    </div>
  );
};

export { RouteMap, mockGeocode };
export type { RouteLocation };