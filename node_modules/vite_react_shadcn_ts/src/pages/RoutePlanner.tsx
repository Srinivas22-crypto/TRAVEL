import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RouteMap, mockGeocode, type RouteLocation } from '@/components/RouteMap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useTrips } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  MapPin,
  Plus,
  X,
  Car,
  Plane,
  Clock,
  Route,
  Save,
  Navigation,
  ArrowRight,
  Loader2,
  Info,
  Star,
  RotateCcw,
  Copy,
  Trash2,
  Edit
} from 'lucide-react';

interface RouteStop {
  id: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

interface RouteData {
  _id?: string;
  name: string;
  startLocation: string;
  destination: string;
  stops: RouteStop[];
  travelMode: 'car' | 'flight';
  estimatedTime: string;
  estimatedDistance: string;
  isPlanned: boolean;
  mapLocations: RouteLocation[];
  status: 'draft' | 'planned' | 'completed' | 'cancelled';
}

const RoutePlanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    trips,
    currentTrip,
    loading: tripsLoading,
    createTrip,
    updateTrip,
    deleteTrip,
    duplicateTrip,
    autoSaveTrip,
    clearCurrentTrip
  } = useTrips();

  const [routeData, setRouteData] = useState<RouteData>({
    name: '',
    startLocation: '',
    destination: '',
    stops: [],
    travelMode: 'car',
    estimatedTime: '',
    estimatedDistance: '',
    isPlanned: false,
    mapLocations: [],
    status: 'draft'
  });

  const [isPlanning, setIsPlanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mapLocations, setMapLocations] = useState<RouteLocation[]>([]);
  const [isGeocodingLocations, setIsGeocodingLocations] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Mock data for autocomplete suggestions
  const popularDestinations = [
    'New York, NY, USA',
    'Los Angeles, CA, USA',
    'Chicago, IL, USA',
    'Houston, TX, USA',
    'Phoenix, AZ, USA',
    'Philadelphia, PA, USA',
    'San Antonio, TX, USA',
    'San Diego, CA, USA',
    'Dallas, TX, USA',
    'San Jose, CA, USA',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Berlin, Germany',
    'Rome, Italy',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Vienna, Austria',
    'Prague, Czech Republic',
    'Budapest, Hungary'
  ];

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<string>('');

  const travelModes = [
    { value: 'car', label: t('routePlanner.car'), icon: Car, color: 'text-blue-500' },
    { value: 'flight', label: t('routePlanner.flight'), icon: Plane, color: 'text-purple-500' }
  ];

  // Check if both start and destination are provided
  const hasValidLocations = routeData.startLocation.trim() && routeData.destination.trim();

  // Auto-save functionality
  const scheduleAutoSave = () => {
    if (!user) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Schedule new auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      const currentDataString = JSON.stringify({
        name: routeData.name,
        startLocation: routeData.startLocation,
        destination: routeData.destination,
        stops: routeData.stops,
        travelMode: routeData.travelMode,
        mapLocations: routeData.mapLocations,
        status: routeData.status
      });

      // Only auto-save if data has changed and has meaningful content
      if (
        currentDataString !== lastSavedDataRef.current &&
        (routeData.name.trim() || routeData.startLocation.trim() || routeData.destination.trim())
      ) {
        setIsAutoSaving(true);
        try {
          const savedTrip = await autoSaveTrip({
            _id: routeData._id,
            name: routeData.name || 'Untitled Trip',
            startLocation: routeData.startLocation,
            destination: routeData.destination,
            stops: routeData.stops,
            travelMode: routeData.travelMode,
            estimatedTime: routeData.estimatedTime,
            estimatedDistance: routeData.estimatedDistance,
            isPlanned: routeData.isPlanned,
            mapLocations: routeData.mapLocations,
            status: routeData.status
          });

          if (savedTrip && !routeData._id) {
            // Update route data with the new ID
            setRouteData(prev => ({ ...prev, _id: savedTrip._id }));
          }

          lastSavedDataRef.current = currentDataString;
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  };

  // Update route data and schedule auto-save
  const updateRouteData = (updates: Partial<RouteData>) => {
    setRouteData(prev => ({ ...prev, ...updates }));
    scheduleAutoSave();
  };

  // Geocode locations and update map
  const updateMapLocations = async () => {
    if (!hasValidLocations) {
      setMapLocations([]);
      return;
    }

    setIsGeocodingLocations(true);
    const locations: RouteLocation[] = [];

    try {
      // Geocode start location
      if (routeData.startLocation.trim()) {
        const startCoords = await mockGeocode(routeData.startLocation);
        if (startCoords) {
          locations.push({
            name: routeData.startLocation,
            coordinates: startCoords,
            type: 'start'
          });
        }
      }

      // Geocode stops
      for (const stop of routeData.stops) {
        if (stop.location.trim()) {
          const stopCoords = await mockGeocode(stop.location);
          if (stopCoords) {
            locations.push({
              name: stop.location,
              coordinates: stopCoords,
              type: 'stop'
            });
          }
        }
      }

      // Geocode destination
      if (routeData.destination.trim()) {
        const destCoords = await mockGeocode(routeData.destination);
        if (destCoords) {
          locations.push({
            name: routeData.destination,
            coordinates: destCoords,
            type: 'end'
          });
        }
      }

      setMapLocations(locations);
      updateRouteData({ mapLocations: locations });
    } catch (error) {
      console.error('Error geocoding locations:', error);
      toast.error('Error loading map locations');
    } finally {
      setIsGeocodingLocations(false);
    }
  };

  // Update map when locations change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateMapLocations();
    }, 500); // Debounce to avoid too many API calls

    return () => clearTimeout(timeoutId);
  }, [routeData.startLocation, routeData.destination, routeData.stops]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleLocationInput = (value: string, field: string) => {
    updateRouteData({ [field]: value });
    
    if (value.length > 2) {
      const filtered = popularDestinations.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
      setActiveInput(field);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    updateRouteData({ [activeInput]: suggestion });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const addStop = () => {
    const newStop: RouteStop = {
      id: Date.now().toString(),
      location: ''
    };
    updateRouteData({
      stops: [...routeData.stops, newStop]
    });
  };

  const updateStop = (stopId: string, location: string) => {
    updateRouteData({
      stops: routeData.stops.map(stop =>
        stop.id === stopId ? { ...stop, location } : stop
      )
    });
  };

  const removeStop = (stopId: string) => {
    updateRouteData({
      stops: routeData.stops.filter(stop => stop.id !== stopId)
    });
  };

  const resetForm = () => {
    const emptyRouteData: RouteData = {
      name: '',
      startLocation: '',
      destination: '',
      stops: [],
      travelMode: 'car',
      estimatedTime: '',
      estimatedDistance: '',
      isPlanned: false,
      mapLocations: [],
      status: 'draft'
    };
    
    setRouteData(emptyRouteData);
    setMapLocations([]);
    clearCurrentTrip();
    
    // Clear auto-save timer and reset reference
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    lastSavedDataRef.current = '';
    
    toast.success(t('routePlanner.formReset'));
  };

  const planRoute = async () => {
    if (!routeData.startLocation || !routeData.destination) {
      toast.error(t('routePlanner.fillRequiredFields'));
      return;
    }

    setIsPlanning(true);
    
    try {
      // Simulate API call for route planning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock route calculation (only car and flight)
      const mockTimes = {
        car: '2h 30m',
        flight: '1h 45m'
      };
      
      const mockDistances = {
        car: '245 km',
        flight: '220 km'
      };

      const updatedData = {
        estimatedTime: mockTimes[routeData.travelMode],
        estimatedDistance: mockDistances[routeData.travelMode],
        isPlanned: true,
        status: 'planned' as const
      };

      updateRouteData(updatedData);
      toast.success(t('routePlanner.routePlanned'));
    } catch (error) {
      toast.error(t('routePlanner.planningError'));
    } finally {
      setIsPlanning(false);
    }
  };

  const saveRoute = async () => {
    if (!user) {
      toast.error(t('routePlanner.loginRequired'));
      return;
    }

    if (!routeData.name.trim()) {
      toast.error(t('routePlanner.enterRouteName'));
      return;
    }

    setIsSaving(true);

    try {
      const tripData = {
        name: routeData.name,
        startLocation: routeData.startLocation,
        destination: routeData.destination,
        stops: routeData.stops,
        travelMode: routeData.travelMode,
        estimatedTime: routeData.estimatedTime,
        estimatedDistance: routeData.estimatedDistance,
        isPlanned: routeData.isPlanned,
        mapLocations: routeData.mapLocations,
        status: routeData.status
      };

      let savedTrip;
      if (routeData._id) {
        savedTrip = await updateTrip(routeData._id, tripData);
      } else {
        savedTrip = await createTrip(tripData);
      }

      if (savedTrip) {
        setRouteData(prev => ({ ...prev, _id: savedTrip._id }));
        lastSavedDataRef.current = JSON.stringify(tripData);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedRoute = (trip: any) => {
    const loadedData: RouteData = {
      _id: trip._id,
      name: trip.name,
      startLocation: trip.startLocation,
      destination: trip.destination,
      stops: trip.stops || [],
      travelMode: trip.travelMode,
      estimatedTime: trip.estimatedTime || '',
      estimatedDistance: trip.estimatedDistance || '',
      isPlanned: trip.isPlanned || false,
      mapLocations: trip.mapLocations || [],
      status: trip.status || 'draft'
    };
    
    setRouteData(loadedData);
    setMapLocations(trip.mapLocations || []);
    lastSavedDataRef.current = JSON.stringify(loadedData);
    
    toast.success(t('routePlanner.routeLoaded'));
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const success = await deleteTrip(tripId);
      if (success && routeData._id === tripId) {
        resetForm();
      }
    }
  };

  const handleDuplicateTrip = async (tripId: string) => {
    const duplicated = await duplicateTrip(tripId);
    if (duplicated) {
      loadSavedRoute(duplicated);
    }
  };

  const selectedTravelMode = travelModes.find(mode => mode.value === routeData.travelMode);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            {t('routePlanner.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('routePlanner.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Planning Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    <CardTitle>{t('routePlanner.planYourRoute')}</CardTitle>
                    {isAutoSaving && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Saving...
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('routePlanner.reset')}
                  </Button>
                </div>
                <CardDescription>
                  {t('routePlanner.planDescription')}
                  {user && (
                    <span className="block text-xs text-green-600 mt-1">
                      ✓ Auto-saving enabled - your progress is automatically saved
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Route Name */}
                <div className="space-y-2">
                  <Label htmlFor="routeName">{t('routePlanner.routeName')}</Label>
                  <Input
                    id="routeName"
                    placeholder={t('routePlanner.routeNamePlaceholder')}
                    value={routeData.name}
                    onChange={(e) => updateRouteData({ name: e.target.value })}
                  />
                </div>

                {/* Start Location */}
                <div className="space-y-2 relative">
                  <Label htmlFor="startLocation">{t('routePlanner.startLocation')}</Label>
                  <div className="relative">
                    <Input
                      id="startLocation"
                      placeholder={t('routePlanner.startLocationPlaceholder')}
                      value={routeData.startLocation}
                      onChange={(e) => handleLocationInput(e.target.value, 'startLocation')}
                      className="pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && activeInput === 'startLocation' && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stops */}
                {routeData.stops.map((stop, index) => (
                  <div key={stop.id} className="space-y-2 relative">
                    <Label>{t('routePlanner.stop')} {index + 1}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder={t('routePlanner.stopPlaceholder')}
                          value={stop.location}
                          onChange={(e) => updateStop(stop.id, e.target.value)}
                          className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeStop(stop.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Stop Button */}
                <Button
                  variant="outline"
                  onClick={addStop}
                  className="w-full"
                  disabled={routeData.stops.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('routePlanner.addStop')}
                </Button>

                {/* Destination */}
                <div className="space-y-2 relative">
                  <Label htmlFor="destination">{t('routePlanner.destination')}</Label>
                  <div className="relative">
                    <Input
                      id="destination"
                      placeholder={t('routePlanner.destinationPlaceholder')}
                      value={routeData.destination}
                      onChange={(e) => handleLocationInput(e.target.value, 'destination')}
                      className="pl-10"
                    />
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && activeInput === 'destination' && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Travel Mode */}
                <div className="space-y-2">
                  <Label>{t('routePlanner.travelMode')}</Label>
                  <Select
                    value={routeData.travelMode}
                    onValueChange={(value: 'car' | 'flight') =>
                      updateRouteData({ travelMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {travelModes.map((mode) => {
                        const IconComponent = mode.icon;
                        return (
                          <SelectItem key={mode.value} value={mode.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className={`h-4 w-4 ${mode.color}`} />
                              {mode.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Plan Route Button */}
                <Button
                  onClick={planRoute}
                  disabled={isPlanning || !routeData.startLocation || !routeData.destination}
                  className="w-full bg-gradient-hero hover:opacity-90 text-white"
                  size="lg"
                >
                  {isPlanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('routePlanner.planning')}
                    </>
                  ) : (
                    <>
                      <Route className="h-4 w-4 mr-2" />
                      {t('routePlanner.planMyRoute')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Route Results */}
            {routeData.isPlanned && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {t('routePlanner.routeDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                      {selectedTravelMode && (
                        <selectedTravelMode.icon className={`h-6 w-6 ${selectedTravelMode.color}`} />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">{t('routePlanner.travelMode')}</p>
                        <p className="font-semibold">{selectedTravelMode?.label}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('routePlanner.estimatedTime')}</p>
                        <p className="font-semibold">{routeData.estimatedTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                      <Route className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('routePlanner.distance')}</p>
                        <p className="font-semibold">{routeData.estimatedDistance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Route Summary */}
                  <div className="p-4 bg-accent/30 rounded-lg">
                    <h4 className="font-semibold mb-2">{t('routePlanner.routeSummary')}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{routeData.startLocation}</span>
                      {routeData.stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{stop.location}</span>
                        </div>
                      ))}
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{routeData.destination}</span>
                    </div>
                  </div>

                  {/* Save Route */}
                  {user && (
                    <Button
                      onClick={saveRoute}
                      disabled={isSaving || !routeData.name.trim()}
                      variant="outline"
                      className="w-full"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('routePlanner.saving')}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('routePlanner.saveRoute')}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interactive Route Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('routePlanner.routeMap')}
                  {isGeocodingLocations && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-square">
                  <RouteMap 
                    locations={mapLocations}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Saved Routes */}
            {user && trips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {t('routePlanner.savedRoutes')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trips.slice(0, 5).map((trip) => (
                    <div
                      key={trip._id}
                      className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => loadSavedRoute(trip)}
                        >
                          <p className="font-medium text-sm">{trip.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {trip.startLocation} → {trip.destination}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {travelModes.find(m => m.value === trip.travelMode)?.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateTrip(trip._id!)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip._id!)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Planning Tips */}
            <Card>
              <CardHeader>
                <CardTitle>{t('routePlanner.tips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t('routePlanner.tip1')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t('routePlanner.tip2')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t('routePlanner.tip3')}
                  </p>
                </div>
                {user && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Your trips are automatically saved to your account
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {t('routePlanner.tip5')}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePlanner;