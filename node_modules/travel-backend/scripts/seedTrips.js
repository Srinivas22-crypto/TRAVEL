const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('../models/Trip');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleTrips = [
  {
    name: 'European Adventure',
    startLocation: 'London, UK',
    destination: 'Rome, Italy',
    stops: [
      { id: '1', location: 'Paris, France' },
      { id: '2', location: 'Berlin, Germany' }
    ],
    travelMode: 'flight',
    estimatedTime: '8h 30m',
    estimatedDistance: '1,850 km',
    isPlanned: true,
    mapLocations: [
      { name: 'London, UK', coordinates: [51.5074, -0.1278], type: 'start' },
      { name: 'Paris, France', coordinates: [48.8566, 2.3522], type: 'stop' },
      { name: 'Berlin, Germany', coordinates: [52.5200, 13.4050], type: 'stop' },
      { name: 'Rome, Italy', coordinates: [41.9028, 12.4964], type: 'end' }
    ],
    status: 'planned'
  },
  {
    name: 'US West Coast Road Trip',
    startLocation: 'Los Angeles, CA, USA',
    destination: 'San Francisco, CA, USA',
    stops: [
      { id: '1', location: 'Santa Barbara, CA, USA' },
      { id: '2', location: 'Monterey, CA, USA' }
    ],
    travelMode: 'car',
    estimatedTime: '6h 45m',
    estimatedDistance: '615 km',
    isPlanned: true,
    mapLocations: [
      { name: 'Los Angeles, CA, USA', coordinates: [34.0522, -118.2437], type: 'start' },
      { name: 'Santa Barbara, CA, USA', coordinates: [34.4208, -119.6982], type: 'stop' },
      { name: 'Monterey, CA, USA', coordinates: [36.6002, -121.8947], type: 'stop' },
      { name: 'San Francisco, CA, USA', coordinates: [37.7749, -122.4194], type: 'end' }
    ],
    status: 'completed'
  },
  {
    name: 'Asian Discovery',
    startLocation: 'Tokyo, Japan',
    destination: 'Bangkok, Thailand',
    stops: [
      { id: '1', location: 'Seoul, South Korea' }
    ],
    travelMode: 'flight',
    estimatedTime: '12h 15m',
    estimatedDistance: '4,600 km',
    isPlanned: false,
    mapLocations: [
      { name: 'Tokyo, Japan', coordinates: [35.6762, 139.6503], type: 'start' },
      { name: 'Seoul, South Korea', coordinates: [37.5665, 126.9780], type: 'stop' },
      { name: 'Bangkok, Thailand', coordinates: [13.7563, 100.5018], type: 'end' }
    ],
    status: 'draft'
  },
  {
    name: 'Weekend Getaway',
    startLocation: 'New York, NY, USA',
    destination: 'Boston, MA, USA',
    stops: [],
    travelMode: 'car',
    estimatedTime: '4h 30m',
    estimatedDistance: '350 km',
    isPlanned: true,
    mapLocations: [
      { name: 'New York, NY, USA', coordinates: [40.7128, -74.0060], type: 'start' },
      { name: 'Boston, MA, USA', coordinates: [42.3601, -71.0589], type: 'end' }
    ],
    status: 'planned'
  }
];

const seedTrips = async () => {
  try {
    await connectDB();

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('Cleared existing trips');

    // Get a sample user (create one if none exists)
    let user = await User.findOne();
    if (!user) {
      user = new User({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@travelhub.com',
        password: 'hashedpassword123' // In real app, this would be properly hashed
      });
      await user.save();
      console.log('Created demo user');
    }

    // Add userId to sample trips and create them
    const tripsWithUser = sampleTrips.map(trip => ({
      ...trip,
      userId: user._id
    }));

    const createdTrips = await Trip.insertMany(tripsWithUser);
    console.log(`Created ${createdTrips.length} sample trips`);

    // Display created trips
    createdTrips.forEach((trip, index) => {
      console.log(`${index + 1}. ${trip.name} (${trip.status})`);
      console.log(`   ${trip.startLocation} → ${trip.destination}`);
      console.log(`   Stops: ${trip.stops.length}`);
      console.log(`   Travel Mode: ${trip.travelMode}`);
      console.log('');
    });

    console.log('Trip seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trips:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedTrips();
}

module.exports = { seedTrips, sampleTrips };