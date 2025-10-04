import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Destination:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - country
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Destination ID
 *         name:
 *           type: string
 *           description: Destination name
 *         description:
 *           type: string
 *           description: Destination description
 *         country:
 *           type: string
 *           description: Country name
 *         city:
 *           type: string
 *           description: City name
 *         category:
 *           type: string
 *           enum: [beach, mountain, city, cultural, adventure, relaxation]
 *           description: Destination category
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         coordinates:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         averageRating:
 *           type: number
 *           description: Average rating from reviews
 *         totalReviews:
 *           type: number
 *           description: Total number of reviews
 *         popularActivities:
 *           type: array
 *           items:
 *             type: string
 *           description: Popular activities at destination
 *         bestTimeToVisit:
 *           type: string
 *           description: Best time to visit
 *         estimatedBudget:
 *           type: object
 *           properties:
 *             budget:
 *               type: number
 *             luxury:
 *               type: number
 *         isActive:
 *           type: boolean
 *           description: Whether destination is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide destination name'],
    trim: true,
    maxlength: [100, 'Destination name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide destination description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  country: {
    type: String,
    required: [true, 'Please provide country name'],
    trim: true,
    maxlength: [50, 'Country name cannot be more than 50 characters'],
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot be more than 50 characters'],
  },
  englishName: {
    type: String,
    trim: true,
    maxlength: [100, 'English name cannot be more than 100 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide destination category'],
    enum: {
      values: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'relaxation'],
      message: 'Category must be one of: beach, mountain, city, cultural, adventure, relaxation',
    },
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
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value[0] >= -180 && value[0] <= 180 && // longitude
            value[1] >= -90 && value[1] <= 90     // latitude
          );
        },
        message: 'Coordinates must be in [longitude, latitude] format within valid ranges.',
      },
    },
  },

  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  popularActivities: [{
    type: String,
    trim: true,
    maxlength: [50, 'Activity name cannot be more than 50 characters'],
  }],
  bestTimeToVisit: {
    type: String,
    maxlength: [200, 'Best time to visit cannot be more than 200 characters'],
  },
  estimatedBudget: {
    budget: {
      type: Number,
      min: [0, 'Budget must be positive'],
    },
    luxury: {
      type: Number,
      min: [0, 'Luxury budget must be positive'],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create index for search functionality
destinationSchema.index({
  name: 'text',
  description: 'text',
  country: 'text',
  city: 'text',
});

// Create geospatial index for location-based queries
destinationSchema.index({ 'coordinates': '2dsphere' });

// Virtual for reviews
destinationSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'destination',
  justOne: false,
});

export default mongoose.model('Destination', destinationSchema);
