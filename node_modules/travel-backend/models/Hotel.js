import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - pricePerNight
 *         - totalRooms
 *       properties:
 *         _id:
 *           type: string
 *           description: Hotel ID
 *         name:
 *           type: string
 *           description: Hotel name
 *         description:
 *           type: string
 *           description: Hotel description
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         pricePerNight:
 *           type: object
 *           properties:
 *             standard:
 *               type: number
 *             deluxe:
 *               type: number
 *             suite:
 *               type: number
 *         totalRooms:
 *           type: object
 *           properties:
 *             standard:
 *               type: number
 *             deluxe:
 *               type: number
 *             suite:
 *               type: number
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Hotel amenities
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Hotel images
 *         rating:
 *           type: number
 *           description: Hotel rating
 *         totalReviews:
 *           type: number
 *           description: Total number of reviews
 *         checkInTime:
 *           type: string
 *           description: Check-in time
 *         checkOutTime:
 *           type: string
 *           description: Check-out time
 *         policies:
 *           type: object
 *           description: Hotel policies
 *         isActive:
 *           type: boolean
 *           description: Whether hotel is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true,
    maxlength: [100, 'Hotel name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide hotel address'],
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters'],
    },
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
  pricePerNight: {
    standard: {
      type: Number,
      required: [true, 'Please provide standard room price'],
      min: [0, 'Price must be positive'],
    },
    deluxe: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
    suite: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
  },
  totalRooms: {
    standard: {
      type: Number,
      required: [true, 'Please provide number of standard rooms'],
      min: [0, 'Number of rooms cannot be negative'],
    },
    deluxe: {
      type: Number,
      default: 0,
      min: [0, 'Number of rooms cannot be negative'],
    },
    suite: {
      type: Number,
      default: 0,
      min: [0, 'Number of rooms cannot be negative'],
    },
  },
  amenities: [{
    type: String,
    trim: true,
    maxlength: [50, 'Amenity name cannot be more than 50 characters'],
  }],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Please provide valid HTTP or HTTPS URLs',
    },
  }],
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
  checkInTime: {
    type: String,
    default: '15:00',
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Check-in time must be in HH:MM format'],
  },
  checkOutTime: {
    type: String,
    default: '11:00',
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Check-out time must be in HH:MM format'],
  },
  policies: {
    cancellation: {
      type: String,
      maxlength: [500, 'Cancellation policy cannot be more than 500 characters'],
    },
    petPolicy: {
      type: String,
      maxlength: [200, 'Pet policy cannot be more than 200 characters'],
    },
    smokingPolicy: {
      type: String,
      maxlength: [200, 'Smoking policy cannot be more than 200 characters'],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create indexes for search functionality
hotelSchema.index({
  name: 'text',
  'location.city': 'text',
  'location.country': 'text',
});

hotelSchema.index({ 'location.coordinates': '2dsphere' });
hotelSchema.index({ 'location.city': 1, 'pricePerNight.standard': 1 });

// Virtual for total rooms
hotelSchema.virtual('totalRoomsCount').get(function() {
  return this.totalRooms.standard + this.totalRooms.deluxe + this.totalRooms.suite;
});

export default mongoose.model('Hotel', hotelSchema);
