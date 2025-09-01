import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Car from '../models/Car.js';
import Post from '../models/Post.js';
import Group from '../models/Group.js';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@travel.com',
    password: 'password123',
    role: 'admin',
    bio: 'Travel platform administrator',
    isVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Adventure seeker and travel enthusiast',
    isVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Solo traveler exploring the world',
    isVerified: true,
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'Photography lover and culture explorer',
    isVerified: true,
  },
];

const destinations = [
  {
    name: 'Santorini',
    description: 'Beautiful Greek island known for its stunning sunsets, white-washed buildings, and crystal-clear waters.',
    country: 'Greece',
    city: 'Santorini',
    category: 'beach',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
    ],
    coordinates: {
      type: 'Point',
      coordinates: [25.4615, 36.3932], // [lng, lat]
    },
    averageRating: 4.8,
    totalReviews: 1250,
    popularActivities: ['Sunset viewing', 'Wine tasting', 'Beach relaxation', 'Photography'],
    bestTimeToVisit: 'April to October',
    estimatedBudget: {
      budget: 150,
      luxury: 400,
    },
  },
  {
    name: 'Tokyo',
    description: 'Vibrant metropolis blending traditional culture with cutting-edge technology and incredible cuisine.',
    country: 'Japan',
    city: 'Tokyo',
    category: 'city',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8',
    ],
    coordinates: {
      type: 'Point',
      coordinates: [139.6503, 35.6762], // [lng, lat]
    },
    averageRating: 4.7,
    totalReviews: 2100,
    popularActivities: ['Temple visits', 'Street food', 'Shopping', 'Cherry blossom viewing'],
    bestTimeToVisit: 'March to May, September to November',
    estimatedBudget: {
      budget: 120,
      luxury: 350,
    },
  },
  {
    name: 'Swiss Alps',
    description: 'Majestic mountain range offering breathtaking views, skiing, and outdoor adventures.',
    country: 'Switzerland',
    city: 'Zermatt',
    category: 'mountain',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    ],
    coordinates: {
      type: 'Point',
      coordinates: [7.7491, 46.0207], // [lng, lat]
    },
    averageRating: 4.9,
    totalReviews: 890,
    popularActivities: ['Skiing', 'Hiking', 'Mountain climbing', 'Cable car rides'],
    bestTimeToVisit: 'December to March (skiing), June to September (hiking)',
    estimatedBudget: {
      budget: 200,
      luxury: 500,
    },
  },
];

const flights = [
  {
    airline: 'Air France',
    flightNumber: 'AF1234',
    departure: {
      airport: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'USA',
      dateTime: new Date('2024-03-15T08:00:00Z'),
    },
    arrival: {
      airport: 'Charles de Gaulle Airport',
      city: 'Paris',
      country: 'France',
      dateTime: new Date('2024-03-15T20:30:00Z'),
    },
    duration: '7h 30m',
    price: {
      economy: 589,
      business: 1200,
      first: 2500,
    },
    availableSeats: {
      economy: 150,
      business: 20,
      first: 8,
    },
    aircraft: 'Boeing 777',
    amenities: ['WiFi', 'Entertainment', 'Meals', 'USB charging'],
  },
  {
    airline: 'British Airways',
    flightNumber: 'BA456',
    departure: {
      airport: 'Heathrow Airport',
      city: 'London',
      country: 'UK',
      dateTime: new Date('2024-03-16T14:00:00Z'),
    },
    arrival: {
      airport: 'Narita International Airport',
      city: 'Tokyo',
      country: 'Japan',
      dateTime: new Date('2024-03-17T09:45:00Z'),
    },
    duration: '11h 45m',
    price: {
      economy: 645,
      business: 1500,
      first: 3200,
    },
    availableSeats: {
      economy: 200,
      business: 30,
      first: 12,
    },
    aircraft: 'Airbus A350',
    amenities: ['WiFi', 'Entertainment', 'Premium meals', 'Lie-flat seats'],
  },
];

const hotels = [
  {
    name: 'Grand Palace Hotel',
    description: 'Luxury hotel in the heart of Paris with stunning city views and world-class amenities.',
    location: {
      address: '123 Champs-Élysées',
      city: 'Paris',
      country: 'France',
      coordinates: {
        type: 'Point',
        coordinates: [2.3522, 48.8566], // [lng, lat]
      },
    },
    pricePerNight: {
      standard: 180,
      deluxe: 280,
      suite: 450,
    },
    totalRooms: {
      standard: 100,
      deluxe: 50,
      suite: 20,
    },
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    ],
    rating: 4.8,
    totalReviews: 450,
  },
  {
    name: 'Tokyo Bay Resort',
    description: 'Modern resort with panoramic bay views and traditional Japanese hospitality.',
    location: {
      address: '456 Bay Street',
      city: 'Tokyo',
      country: 'Japan',
      coordinates: {
        type: 'Point',
        coordinates: [139.6503, 35.6762], // [lng, lat]
      },
    },
    pricePerNight: {
      standard: 145,
      deluxe: 220,
      suite: 380,
    },
    totalRooms: {
      standard: 80,
      deluxe: 40,
      suite: 15,
    },
    amenities: ['WiFi', 'Onsen', 'Restaurant', 'Bar', 'Gym', 'Business center'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    ],
    rating: 4.6,
    totalReviews: 320,
  },
];

const cars = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'midsize',
    pricePerDay: 45,
    location: {
      city: 'Paris',
      country: 'France',
      address: 'Charles de Gaulle Airport',
      coordinates: {
        type: 'Point',
        coordinates: [2.5479, 49.0097], // [lng, lat]
      },
    },
    features: ['GPS', 'Bluetooth', 'Air conditioning', 'Automatic transmission'],
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    images: ['https://images.unsplash.com/photo-1549924231-f129b911e442'],
    rating: 4.5,
    totalReviews: 89,
    rentalCompany: 'EuroCar Rentals',
  },
  {
    make: 'BMW',
    model: 'X3',
    year: 2023,
    category: 'suv',
    pricePerDay: 85,
    location: {
      city: 'Tokyo',
      country: 'Japan',
      address: 'Narita International Airport',
      coordinates: {
        type: 'Point',
        coordinates: [140.3929, 35.7720], // [lng, lat]
      },
    },
    features: ['GPS', 'Leather seats', 'Sunroof', 'Premium sound system'],
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 5,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e'],
    rating: 4.7,
    totalReviews: 156,
    rentalCompany: 'Tokyo Premium Cars',
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();
    await Car.deleteMany();
    await Post.deleteMany();
    await Group.deleteMany();

    console.log('Data Destroyed...');

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users Imported...');

    // Create destinations
    const createdDestinations = await Destination.create(
      destinations.map(dest => ({
        ...dest,
        createdBy: createdUsers[0]._id, // Admin user
      }))
    );
    console.log('Destinations Imported...');

    // Create flights
    await Flight.create(flights);
    console.log('Flights Imported...');

    // Create hotels
    await Hotel.create(hotels);
    console.log('Hotels Imported...');

    // Create cars
    await Car.create(cars);
    console.log('Cars Imported...');

    // Create sample groups
    const sampleGroups = [
      {
        name: 'Solo Travelers Unite',
        description: 'Connect with fellow solo travelers and share experiences',
        creator: createdUsers[1]._id,
        category: 'Solo Travel',
        tags: ['solo', 'adventure', 'backpacking'],
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
      },
      {
        name: 'Budget Backpackers',
        description: 'Tips and tricks for traveling on a budget',
        creator: createdUsers[2]._id,
        category: 'Budget Travel',
        tags: ['budget', 'backpacking', 'hostels'],
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      },
    ];

    const createdGroups = await Group.create(sampleGroups);
    console.log('Groups Imported...');

    // Create sample posts
    const samplePosts = [
      {
        author: createdUsers[1]._id,
        content: 'Just had the most amazing sunset in Santorini! The blue domes and white buildings create such a magical atmosphere. Already planning my next visit! 🌅',
        images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'],
        location: 'Santorini, Greece',
        tags: ['sunset', 'santorini', 'greece', 'travel'],
      },
      {
        author: createdUsers[2]._id,
        content: 'Tokyo\'s street food scene is absolutely incredible! Spent the whole day exploring Shibuya and trying different foods. The ramen here is on another level 🍜',
        images: ['https://images.unsplash.com/photo-1613929633558-2448d2d03521'],
        location: 'Tokyo, Japan',
        tags: ['tokyo', 'food', 'ramen', 'streetfood'],
        group: createdGroups[0]._id,
      },
      {
        author: createdUsers[3]._id,
        content: 'Hiking in the Swiss Alps was a dream come true! The views from Matterhorn are absolutely breathtaking. Nature never fails to amaze me 🏔️',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
        location: 'Swiss Alps, Switzerland',
        tags: ['hiking', 'alps', 'switzerland', 'nature'],
      },
    ];

    await Post.create(samplePosts);
    console.log('Posts Imported...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();
    await Car.deleteMany();
    await Post.deleteMany();
    await Group.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
