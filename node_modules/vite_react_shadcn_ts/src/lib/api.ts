import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event for auth context to handle
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'user' | 'admin';
  bio?: string;
  profileImage?: string;
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
  isVerified?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Destination Types
export interface Destination {
  _id: string;
  name: string;
  description: string;
  country: string;
  city?: string;
  category: 'beach' | 'mountain' | 'city' | 'cultural' | 'adventure' | 'relaxation';
  images: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  averageRating: number;
  totalReviews: number;
  popularActivities: string[];
  bestTimeToVisit?: string;
  estimatedBudget?: {
    budget: number;
    luxury: number;
  };
  isActive: boolean;
  createdAt: string;
}

// Flight Types
export interface Flight {
  _id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    country: string;
    dateTime: string;
  };
  arrival: {
    airport: string;
    city: string;
    country: string;
    dateTime: string;
  };
  duration: string;
  price: {
    economy: number;
    business?: number;
    first?: number;
  };
  availableSeats: {
    economy: number;
    business: number;
    first: number;
  };
  aircraft?: string;
  amenities: string[];
  isActive: boolean;
}

// Hotel Types
export interface Hotel {
  _id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pricePerNight: {
    standard: number;
    deluxe?: number;
    suite?: number;
  };
  totalRooms: {
    standard: number;
    deluxe: number;
    suite: number;
  };
  amenities: string[];
  images: string[];
  rating: number;
  totalReviews: number;
  checkInTime: string;
  checkOutTime: string;
  isActive: boolean;
}

// Car Types
export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: 'economy' | 'compact' | 'midsize' | 'fullsize' | 'luxury' | 'suv' | 'convertible';
  pricePerDay: number;
  location: {
    city: string;
    country: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: string[];
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  doors: number;
  images: string[];
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  rentalCompany?: string;
}

// Activity Types
export interface Activity {
  id: string;
  name: string;
  image: string;
  price: number;
  duration: string;
  description: string;
  destination: string;
}

// Activity Booking Types
export interface ActivityBooking {
  id: string;
  activityId: string;
  activityName: string;
  activityImage: string;
  price: number;
  duration: string;
  destination: string;
  bookedAt: string;
  status: 'booked' | 'cancelled';
}

// Booking Types
export interface Booking {
  _id: string;
  user: string;
  type: 'flight' | 'hotel' | 'car';
  bookingReference: string;
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
    seatNumbers: string[];
  };
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
  createdAt: string;
}

// Post Types
export interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  content: string;
  images: string[];
  location?: string;
  tags: string[];
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    content: string;
    createdAt: string;
  }>;
  shares: number;
  group?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

// Group Types
export interface Group {
  _id: string;
  name: string;
  description: string;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  category: string;
  image?: string;
  members: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    role: 'member' | 'moderator' | 'admin';
    joinedAt: string;
  }>;
  isPrivate: boolean;
  rules: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

// Search Parameters
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  class?: 'economy' | 'business' | 'first';
  maxPrice?: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  rooms?: number;
  maxPrice?: number;
}

export interface CarSearchParams {
  location: string;
  pickupDate: string;
  returnDate: string;
  category?: string;
  maxPrice?: number;
}

export default api;
