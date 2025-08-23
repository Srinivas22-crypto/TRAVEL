import api, { 
  ApiResponse, 
  Booking, 
  Flight, 
  Hotel, 
  Car,
  FlightSearchParams,
  HotelSearchParams,
  CarSearchParams,
  SearchParams 
} from '../lib/api';

export interface CreateBookingData {
  type: 'flight' | 'hotel' | 'car';
  flight?: string;
  hotel?: string;
  car?: string;
  startDate: string;
  endDate: string;
  passengers?: Array<{
    name: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
  }>;
  roomDetails?: {
    roomType: 'standard' | 'deluxe' | 'suite';
    numberOfRooms: number;
    guests: number;
  };
  flightDetails?: {
    class: 'economy' | 'business' | 'first';
    seatNumbers?: string[];
  };
  totalAmount: number;
  currency?: string;
  specialRequests?: string;
}

class BookingService {
  // Search flights
  async searchFlights(params: FlightSearchParams): Promise<{
    outboundFlights: Flight[];
    returnFlights: Flight[];
    searchParams: FlightSearchParams;
  }> {
    try {
      const response = await api.get('/flights/search', { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search flights');
    }
  }

  // Get flight deals
  async getFlightDeals(limit: number = 10): Promise<Flight[]> {
    try {
      const response = await api.get<ApiResponse<Flight[]>>('/flights/deals', {
        params: { limit },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch flight deals');
    }
  }

  // Search hotels
  async searchHotels(params: HotelSearchParams): Promise<{
    hotels: Hotel[];
    searchParams: HotelSearchParams;
  }> {
    try {
      const response = await api.get('/hotels/search', { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search hotels');
    }
  }

  // Get hotel deals
  async getHotelDeals(limit: number = 10): Promise<Hotel[]> {
    try {
      const response = await api.get<ApiResponse<Hotel[]>>('/hotels/deals', {
        params: { limit },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotel deals');
    }
  }

  // Search cars
  async searchCars(params: CarSearchParams): Promise<{
    cars: Car[];
    searchParams: CarSearchParams;
  }> {
    try {
      const response = await api.get('/cars/search', { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search cars');
    }
  }

  // Get single flight
  async getFlight(id: string): Promise<Flight> {
    try {
      const response = await api.get<ApiResponse<Flight>>(`/flights/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch flight');
    }
  }

  // Get single hotel
  async getHotel(id: string): Promise<Hotel> {
    try {
      const response = await api.get<ApiResponse<Hotel>>(`/hotels/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotel');
    }
  }

  // Get single car
  async getCar(id: string): Promise<Car> {
    try {
      const response = await api.get<ApiResponse<Car>>(`/cars/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch car');
    }
  }

  // Create booking
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  }

  // Get user's bookings
  async getUserBookings(params?: SearchParams & {
    status?: string;
    type?: string;
  }): Promise<{
    bookings: Booking[];
    total: number;
  }> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>('/bookings/my-bookings', {
        params,
      });

      return {
        bookings: response.data.data,
        total: response.data.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }

  // Get single booking
  async getBooking(id: string): Promise<Booking> {
    try {
      const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  }

  // Update booking
  async updateBooking(id: string, updateData: {
    specialRequests?: string;
  }): Promise<Booking> {
    try {
      const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  }

  // Cancel booking
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    try {
      const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}/cancel`, {
        reason,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }

  // Calculate booking duration
  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Format booking reference
  formatBookingReference(reference: string): string {
    return reference.replace(/(.{2})/g, '$1-').slice(0, -1);
  }

  // Get booking status color
  getBookingStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  // Get payment status color
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  }

  // Check if booking can be cancelled
  canCancelBooking(booking: Booking): boolean {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }

    // Check if booking is within cancellation window (e.g., 24 hours before)
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilStart > 24;
  }

  // Check if booking can be modified
  canModifyBooking(booking: Booking): boolean {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }

    // Check if booking is within modification window (e.g., 48 hours before)
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilStart > 48;
  }
}

// Create and export a singleton instance
const bookingService = new BookingService();
export default bookingService;
