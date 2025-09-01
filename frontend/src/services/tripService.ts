import api from '@/lib/api';

export interface RouteStop {
  id: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

export interface RouteLocation {
  name: string;
  coordinates: [number, number];
  type: 'start' | 'stop' | 'end';
}

export interface Trip {
  _id?: string;
  userId?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface TripResponse {
  success: boolean;
  data: Trip;
  message?: string;
}

export interface TripsResponse {
  success: boolean;
  data: {
    trips: Trip[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}

export interface CreateTripData {
  name: string;
  startLocation: string;
  destination: string;
  stops?: RouteStop[];
  travelMode?: 'car' | 'flight';
  estimatedTime?: string;
  estimatedDistance?: string;
  isPlanned?: boolean;
  mapLocations?: RouteLocation[];
  status?: 'draft' | 'planned' | 'completed' | 'cancelled';
}

export interface UpdateTripData extends Partial<CreateTripData> {
  _id?: string;
}

export interface TripFilters {
  status?: 'draft' | 'planned' | 'completed' | 'cancelled';
  limit?: number;
  page?: number;
}

class TripService {
  private baseUrl = '/api/trips';

  // Get all trips for the authenticated user
  async getTrips(filters: TripFilters = {}): Promise<TripsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());
      
      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      
      const response = await api.get<TripsResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch trips');
    }
  }

  // Get a specific trip by ID
  async getTrip(id: string): Promise<TripResponse> {
    try {
      const response = await api.get<TripResponse>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch trip');
    }
  }

  // Create a new trip
  async createTrip(tripData: CreateTripData): Promise<TripResponse> {
    try {
      const response = await api.post<TripResponse>(this.baseUrl, tripData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to create trip');
    }
  }

  // Update an existing trip
  async updateTrip(id: string, tripData: UpdateTripData): Promise<TripResponse> {
    try {
      const response = await api.put<TripResponse>(`${this.baseUrl}/${id}`, tripData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to update trip');
    }
  }

  // Delete a trip
  async deleteTrip(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete trip');
    }
  }

  // Duplicate a trip
  async duplicateTrip(id: string): Promise<TripResponse> {
    try {
      const response = await api.post<TripResponse>(`${this.baseUrl}/${id}/duplicate`);
      return response.data;
    } catch (error: any) {
      console.error('Error duplicating trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to duplicate trip');
    }
  }

  // Update trip status
  async updateTripStatus(id: string, status: Trip['status']): Promise<TripResponse> {
    try {
      const response = await api.patch<TripResponse>(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Error updating trip status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update trip status');
    }
  }

  // Auto-save trip (create or update based on existence)
  async autoSaveTrip(tripData: CreateTripData & { _id?: string }): Promise<TripResponse> {
    try {
      if (tripData._id) {
        // Update existing trip
        const { _id, ...updateData } = tripData;
        return await this.updateTrip(_id, updateData);
      } else {
        // Create new trip
        return await this.createTrip(tripData);
      }
    } catch (error: any) {
      console.error('Error auto-saving trip:', error);
      throw new Error(error.response?.data?.message || 'Failed to auto-save trip');
    }
  }

  // Get recent trips (last 10)
  async getRecentTrips(): Promise<TripsResponse> {
    return this.getTrips({ limit: 10, page: 1 });
  }

  // Get trips by status
  async getTripsByStatus(status: Trip['status']): Promise<TripsResponse> {
    return this.getTrips({ status, limit: 50 });
  }

  // Search trips by name
  async searchTrips(query: string): Promise<Trip[]> {
    try {
      const response = await this.getTrips({ limit: 100 });
      const trips = response.data.trips;
      
      // Client-side filtering for now (can be moved to backend later)
      return trips.filter(trip => 
        trip.name.toLowerCase().includes(query.toLowerCase()) ||
        trip.startLocation.toLowerCase().includes(query.toLowerCase()) ||
        trip.destination.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching trips:', error);
      return [];
    }
  }
}

// Export singleton instance
export const tripService = new TripService();
export default tripService;