import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, Route } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Mock route data
const mockRoute = {
  start: { lat: 40.7128, lng: -74.0060, name: 'New York, NY' },
  end: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA' },
  waypoints: [
    { lat: 41.8781, lng: -87.6298, name: 'Chicago, IL' },
    { lat: 39.7392, lng: -104.9903, name: 'Denver, CO' },
  ],
  distance: '2,789 miles',
  duration: '40 hours',
  traffic: 'moderate',
};

export const RouteMap = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(mockRoute);

  // Create polyline coordinates
  const polylinePositions = [
    [currentRoute.start.lat, currentRoute.start.lng],
    ...currentRoute.waypoints.map(wp => [wp.lat, wp.lng]),
    [currentRoute.end.lat, currentRoute.end.lng],
  ];

  const handlePlanRoute = () => {
    if (!startLocation || !endLocation) return;
    
    setIsPlanning(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Planning route from', startLocation, 'to', endLocation);
      setIsPlanning(false);
    }, 2000);
  };

  const addWaypoint = () => {
    // Add waypoint logic would go here
    console.log('Adding waypoint');
  };

  return (
    <div className="space-y-6">
      {/* Route Planning Controls */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader className="bg-gradient-ocean text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Interactive Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From</label>
              <Input
                placeholder="Enter starting location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input
                placeholder="Enter destination"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={handlePlanRoute}
              disabled={isPlanning || !startLocation || !endLocation}
              variant="ocean"
              className="flex items-center gap-2"
            >
              {isPlanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Planning...
                </>
              ) : (
                <>
                  <Route className="h-4 w-4" />
                  Plan Route
                </>
              )}
            </Button>
            <Button onClick={addWaypoint} variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Add Waypoint
            </Button>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
              <Route className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Distance</p>
                <p className="text-lg font-bold text-primary">{currentRoute.distance}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
              <Clock className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-lg font-bold text-secondary">{currentRoute.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
              <Navigation className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Traffic</p>
                <Badge 
                  variant={currentRoute.traffic === 'heavy' ? 'destructive' : 
                          currentRoute.traffic === 'moderate' ? 'warning' : 'success'}
                  className="capitalize"
                >
                  {currentRoute.traffic}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="bg-card border-border shadow-elegant">
        <CardContent className="p-0">
          <div className="h-96 w-full relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Interactive Map View</h3>
                <p className="text-muted-foreground mb-4">
                  Map integration would display here with Leaflet/Mapbox
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm">Start: {currentRoute.start.name}</span>
                  </div>
                  {currentRoute.waypoints.map((waypoint, index) => (
                    <div key={index} className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="text-sm">Waypoint: {waypoint.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm">End: {currentRoute.end.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Routes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Alternative Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Fastest Route', time: '38 hours', distance: '2,650 miles', traffic: 'light' },
              { name: 'Scenic Route', time: '45 hours', distance: '3,100 miles', traffic: 'moderate' },
              { name: 'Economical Route', time: '42 hours', distance: '2,800 miles', traffic: 'heavy' },
            ].map((route, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-medium">{route.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {route.distance} • {route.time}
                  </p>
                </div>
                <Badge 
                  variant={route.traffic === 'heavy' ? 'destructive' : 
                          route.traffic === 'moderate' ? 'warning' : 'success'}
                  className="capitalize"
                >
                  {route.traffic} traffic
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};