import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Flight:
 *       type: object
 *       required:
 *         - airline
 *         - flightNumber
 *         - departure
 *         - arrival
 *         - price
 *         - availableSeats
 *       properties:
 *         _id:
 *           type: string
 *           description: Flight ID
 *         airline:
 *           type: string
 *           description: Airline name
 *         flightNumber:
 *           type: string
 *           description: Flight number
 *         departure:
 *           type: object
 *           properties:
 *             airport:
 *               type: string
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             dateTime:
 *               type: string
 *               format: date-time
 *         arrival:
 *           type: object
 *           properties:
 *             airport:
 *               type: string
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             dateTime:
 *               type: string
 *               format: date-time
 *         duration:
 *           type: string
 *           description: Flight duration
 *         price:
 *           type: object
 *           properties:
 *             economy:
 *               type: number
 *             business:
 *               type: number
 *             first:
 *               type: number
 *         availableSeats:
 *           type: object
 *           properties:
 *             economy:
 *               type: number
 *             business:
 *               type: number
 *             first:
 *               type: number
 *         aircraft:
 *           type: string
 *           description: Aircraft type
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Flight amenities
 *         isActive:
 *           type: boolean
 *           description: Whether flight is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, 'Please provide airline name'],
    trim: true,
    maxlength: [50, 'Airline name cannot be more than 50 characters'],
  },
  flightNumber: {
    type: String,
    required: [true, 'Please provide flight number'],
    trim: true,
    unique: true,
    maxlength: [10, 'Flight number cannot be more than 10 characters'],
  },
  departure: {
    airport: {
      type: String,
      required: [true, 'Please provide departure airport'],
      trim: true,
      maxlength: [100, 'Airport name cannot be more than 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'Please provide departure city'],
      trim: true,
      maxlength: [50, 'City name cannot be more than 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Please provide departure country'],
      trim: true,
      maxlength: [50, 'Country name cannot be more than 50 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Please provide departure date and time'],
    },
  },
  arrival: {
    airport: {
      type: String,
      required: [true, 'Please provide arrival airport'],
      trim: true,
      maxlength: [100, 'Airport name cannot be more than 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'Please provide arrival city'],
      trim: true,
      maxlength: [50, 'City name cannot be more than 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Please provide arrival country'],
      trim: true,
      maxlength: [50, 'Country name cannot be more than 50 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Please provide arrival date and time'],
    },
  },
  duration: {
    type: String,
    required: [true, 'Please provide flight duration'],
    match: [/^\d{1,2}h\s?\d{0,2}m?$/, 'Duration must be in format "Xh Ym" or "Xh"'],
  },
  price: {
    economy: {
      type: Number,
      required: [true, 'Please provide economy class price'],
      min: [0, 'Price must be positive'],
    },
    business: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
    first: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
  },
  availableSeats: {
    economy: {
      type: Number,
      required: [true, 'Please provide available economy seats'],
      min: [0, 'Available seats cannot be negative'],
    },
    business: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative'],
    },
    first: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative'],
    },
  },
  aircraft: {
    type: String,
    trim: true,
    maxlength: [50, 'Aircraft type cannot be more than 50 characters'],
  },
  amenities: [{
    type: String,
    trim: true,
    maxlength: [50, 'Amenity name cannot be more than 50 characters'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes for search functionality
flightSchema.index({
  'departure.city': 1,
  'arrival.city': 1,
  'departure.dateTime': 1,
});

// Note: flightNumber index is already created by unique: true in schema definition
flightSchema.index({ airline: 1 });

// Virtual for total available seats
flightSchema.virtual('totalAvailableSeats').get(function() {
  return this.availableSeats.economy + this.availableSeats.business + this.availableSeats.first;
});

export default mongoose.model('Flight', flightSchema);
