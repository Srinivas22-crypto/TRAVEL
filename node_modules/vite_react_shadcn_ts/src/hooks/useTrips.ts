import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { tripService, type Trip, type CreateTripData, type UpdateTripData, type TripFilters } from '@/services/tripService';
import { toast } from 'sonner';

interface UseTripsReturn {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  error: string | null;
  
  // Trip management
  fetchTrips: (filters?: TripFilters) => Promise<void>;
  fetchTrip: (id: string) => Promise<Trip | null>;
  createTrip: (tripData: CreateTripData) => Promise<Trip | null>;
  updateTrip: (id: string, tripData: UpdateTripData) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<boolean>;
  duplicateTrip: (id: string) => Promise<Trip | null>;
  updateTripStatus: (id: string, status: Trip['status']) => Promise<Trip | null>;
  
  // Auto-save functionality
  autoSaveTrip: (tripData: CreateTripData & { _id?: string }) => Promise<Trip | null>;
  
  // Utility functions
  clearCurrentTrip: () => void;
  refreshTrips: () => Promise<void>;
  searchTrips: (query: string) => Promise<Trip[]>;
  clearAllData: () => void;
}

export const useTrips = (): UseTripsReturn => {
  const { user, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all trips
  const fetchTrips = useCallback(async (filters?: TripFilters) => {
    if (!user || !isAuthenticated) {
      setTrips([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.getTrips(filters);
      setTrips(response.data.trips);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch trips';
      setError(errorMessage);
      console.error('Error fetching trips:', err);
      
      // Don't show error toast for authentication errors
      if (!err.message?.includes('authentication') && !err.message?.includes('token')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Fetch a specific trip
  const fetchTrip = useCallback(async (id: string): Promise<Trip | null> => {
    if (!user || !isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.getTrip(id);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch trip';
      setError(errorMessage);
      console.error('Error fetching trip:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Create a new trip
  const createTrip = useCallback(async (tripData: CreateTripData): Promise<Trip | null> => {
    if (!user || !isAuthenticated) {
      toast.error('Please sign in to save trips');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.createTrip(tripData);
      const newTrip = response.data;
      
      setTrips(prev => [newTrip, ...prev]);
      setCurrentTrip(newTrip);
      
      toast.success('Trip saved successfully!');
      return newTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create trip';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating trip:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Update an existing trip
  const updateTrip = useCallback(async (id: string, tripData: UpdateTripData): Promise<Trip | null> => {
    if (!user || !isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.updateTrip(id, tripData);
      const updatedTrip = response.data;
      
      setTrips(prev => prev.map(trip => trip._id === id ? updatedTrip : trip));
      
      if (currentTrip?._id === id) {
        setCurrentTrip(updatedTrip);
      }
      
      toast.success('Trip updated successfully!');
      return updatedTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update trip';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating trip:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, currentTrip]);

  // Delete a trip
  const deleteTrip = useCallback(async (id: string): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await tripService.deleteTrip(id);
      
      setTrips(prev => prev.filter(trip => trip._id !== id));
      
      if (currentTrip?._id === id) {
        setCurrentTrip(null);
      }
      
      toast.success('Trip deleted successfully!');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete trip';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting trip:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, currentTrip]);

  // Duplicate a trip
  const duplicateTrip = useCallback(async (id: string): Promise<Trip | null> => {
    if (!user || !isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.duplicateTrip(id);
      const duplicatedTrip = response.data;
      
      setTrips(prev => [duplicatedTrip, ...prev]);
      
      toast.success('Trip duplicated successfully!');
      return duplicatedTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to duplicate trip';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error duplicating trip:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Update trip status
  const updateTripStatus = useCallback(async (id: string, status: Trip['status']): Promise<Trip | null> => {
    if (!user || !isAuthenticated) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.updateTripStatus(id, status);
      const updatedTrip = response.data;
      
      setTrips(prev => prev.map(trip => trip._id === id ? updatedTrip : trip));
      
      if (currentTrip?._id === id) {
        setCurrentTrip(updatedTrip);
      }
      
      toast.success(`Trip status updated to ${status}!`);
      return updatedTrip;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update trip status';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating trip status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, currentTrip]);

  // Auto-save trip (silent operation)
  const autoSaveTrip = useCallback(async (tripData: CreateTripData & { _id?: string }): Promise<Trip | null> => {
    if (!user || !isAuthenticated) return null;
    
    try {
      const response = await tripService.autoSaveTrip(tripData);
      const savedTrip = response.data;
      
      if (tripData._id) {
        // Update existing trip in state
        setTrips(prev => prev.map(trip => trip._id === tripData._id ? savedTrip : trip));
      } else {
        // Add new trip to state
        setTrips(prev => {
          const exists = prev.some(trip => trip._id === savedTrip._id);
          return exists ? prev : [savedTrip, ...prev];
        });
      }
      
      setCurrentTrip(savedTrip);
      return savedTrip;
    } catch (err: any) {
      console.error('Error auto-saving trip:', err);
      // Don't show error toast for auto-save failures to avoid spam
      return null;
    }
  }, [user, isAuthenticated]);

  // Search trips
  const searchTrips = useCallback(async (query: string): Promise<Trip[]> => {
    if (!user || !isAuthenticated || !query.trim()) return trips;
    
    try {
      return await tripService.searchTrips(query);
    } catch (err: any) {
      console.error('Error searching trips:', err);
      return [];
    }
  }, [user, isAuthenticated, trips]);

  // Clear current trip
  const clearCurrentTrip = useCallback(() => {
    setCurrentTrip(null);
  }, []);

  // Refresh trips
  const refreshTrips = useCallback(async () => {
    await fetchTrips();
  }, [fetchTrips]);

  // Clear all data (for logout/account deletion)
  const clearAllData = useCallback(() => {
    setTrips([]);
    setCurrentTrip(null);
    setError(null);
    setLoading(false);
  }, []);

  // Load trips when user authentication state changes
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchTrips();
    } else {
      clearAllData();
    }
  }, [user, isAuthenticated, fetchTrips, clearAllData]);

  // Listen for auth logout events to clear data
  useEffect(() => {
    const handleAuthLogout = () => {
      clearAllData();
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [clearAllData]);

  return {
    trips,
    currentTrip,
    loading,
    error,
    
    // Trip management
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    duplicateTrip,
    updateTripStatus,
    
    // Auto-save functionality
    autoSaveTrip,
    
    // Utility functions
    clearCurrentTrip,
    refreshTrips,
    searchTrips,
    clearAllData,
  };
};

export default useTrips;