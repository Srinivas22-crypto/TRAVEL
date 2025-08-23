import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - make
 *         - model
 *         - year
 *         - category
 *         - pricePerDay
 *         - location
 *       properties:
 *         _id:
 *           type: string
 *           description: Car ID
 *         make:
 *           type: string
 *           description: Car make/brand
 *         model:
 *           type: string
 *           description: Car model
 *         year:
 *           type: number
 *           description: Car year
 *         category:
 *           type: string
 *           enum: [economy, compact, midsize, fullsize, luxury, suv, convertible]
 *           description: Car category
 *         pricePerDay:
 *           type: number
 *           description: Price per day
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             address:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Car features
 *         fuelType:
 *           type: string
 *           enum: [petrol, diesel, electric, hybrid]
 *           description: Fuel type
 *         transmission:
 *           type: string
 *           enum: [manual, automatic]
 *           description: Transmission type
 *         seats:
 *           type: number
 *           description: Number of seats
 *         doors:
 *           type: number
 *           description: Number of doors
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Car images
 *         isAvailable:
 *           type: boolean
 *           description: Whether car is available
 *         rating:
 *           type: number
 *           description: Car rating
 *         totalReviews:
 *           type: number
 *           description: Total number of reviews
 *         rentalCompany:
 *           type: string
 *           description: Rental company name
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Please provide car make'],
    trim: true,
    maxlength: [50, 'Car make cannot be more than 50 characters'],
  },
  model: {
    type: String,
    required: [true, 'Please provide car model'],
    trim: true,
    maxlength: [50, 'Car model cannot be more than 50 characters'],
  },
  year: {
    type: Number,
    required: [true, 'Please provide car year'],
    min: [1990, 'Car year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Car year cannot be in the future'],
  },
  category: {
    type: String,
    required: [true, 'Please provide car category'],
    enum: {
      values: ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible'],
      message: 'Category must be one of: economy, compact, midsize, fullsize, luxury, suv, convertible',
    },
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please provide price per day'],
    min: [0, 'Price must be positive'],
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      maxlength: [50, 'City name cannot be more than 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
      trim: true,
      maxlength: [50, 'Country name cannot be more than 50 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters'],
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [50, 'Feature name cannot be more than 50 characters'],
  }],
  fuelType: {
    type: String,
    enum: {
      values: ['petrol', 'diesel', 'electric', 'hybrid'],
      message: 'Fuel type must be one of: petrol, diesel, electric, hybrid',
    },
    default: 'petrol',
  },
  transmission: {
    type: String,
    enum: {
      values: ['manual', 'automatic'],
      message: 'Transmission must be manual or automatic',
    },
    default: 'manual',
  },
  seats: {
    type: Number,
    min: [2, 'Car must have at least 2 seats'],
    max: [9, 'Car cannot have more than 9 seats'],
    default: 5,
  },
  doors: {
    type: Number,
    min: [2, 'Car must have at least 2 doors'],
    max: [5, 'Car cannot have more than 5 doors'],
    default: 4,
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Please provide valid HTTP or HTTPS URLs',
    },
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  rentalCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Rental company name cannot be more than 100 characters'],
  },
}, {
  timestamps: true,
});

// Create indexes for search functionality
carSchema.index({
  make: 'text',
  model: 'text',
  'location.city': 'text',
  'location.country': 'text',
});

carSchema.index({ 'location.coordinates': '2dsphere' });
carSchema.index({ category: 1, pricePerDay: 1 });
carSchema.index({ 'location.city': 1, isAvailable: 1 });

// Virtual for full car name
carSchema.virtual('fullName').get(function() {
  return `${this.year} ${this.make} ${this.model}`;
});

export default mongoose.model('Car', carSchema);
