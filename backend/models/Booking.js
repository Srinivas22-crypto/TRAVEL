import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - user
 *         - type
 *         - startDate
 *         - endDate
 *         - totalAmount
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Booking ID
 *         user:
 *           type: string
 *           description: User ID who made the booking
 *         type:
 *           type: string
 *           enum: [flight, hotel, car]
 *           description: Type of booking
 *         bookingReference:
 *           type: string
 *           description: Unique booking reference
 *         flight:
 *           type: string
 *           description: Flight ID (if type is flight)
 *         hotel:
 *           type: string
 *           description: Hotel ID (if type is hotel)
 *         car:
 *           type: string
 *           description: Car ID (if type is car)
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of booking
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date of booking
 *         passengers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *         roomDetails:
 *           type: object
 *           properties:
 *             roomType:
 *               type: string
 *             numberOfRooms:
 *               type: number
 *             guests:
 *               type: number
 *         flightDetails:
 *           type: object
 *           properties:
 *             class:
 *               type: string
 *             seatNumbers:
 *               type: array
 *               items:
 *                 type: string
 *         totalAmount:
 *           type: number
 *           description: Total booking amount
 *         currency:
 *           type: string
 *           description: Currency code
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           description: Booking status
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           description: Payment method used
 *         transaction:
 *           type: string
 *           description: Transaction ID
 *         specialRequests:
 *           type: string
 *           description: Special requests from user
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  type: {
    type: String,
    required: [true, 'Please specify booking type'],
    enum: {
      values: ['flight', 'hotel', 'car'],
      message: 'Booking type must be flight, hotel, or car',
    },
  },
  bookingReference: {
    type: String,
    unique: true,
    uppercase: true,
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'Flight',
    required: function() {
      return this.type === 'flight';
    },
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: function() {
      return this.type === 'hotel';
    },
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car',
    required: function() {
      return this.type === 'car';
    },
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date',
    },
  },
  passengers: [{
    name: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true,
      maxlength: [100, 'Passenger name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
  }],
  roomDetails: {
    roomType: {
      type: String,
      enum: ['standard', 'deluxe', 'suite'],
      required: function() {
        return this.type === 'hotel';
      },
    },
    numberOfRooms: {
      type: Number,
      min: [1, 'Number of rooms must be at least 1'],
      required: function() {
        return this.type === 'hotel';
      },
    },
    guests: {
      type: Number,
      min: [1, 'Number of guests must be at least 1'],
      required: function() {
        return this.type === 'hotel';
      },
    },
  },
  flightDetails: {
    class: {
      type: String,
      enum: ['economy', 'business', 'first'],
      required: function() {
        return this.type === 'flight';
      },
    },
    seatNumbers: [{
      type: String,
      trim: true,
    }],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount'],
    min: [0, 'Total amount must be positive'],
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    maxlength: [3, 'Currency code must be 3 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be pending, confirmed, cancelled, or completed',
    },
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be pending, paid, failed, or refunded',
    },
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    trim: true,
  },
  transaction: {
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction',
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const prefix = this.type.toUpperCase().substring(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingReference = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Create indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ type: 1, startDate: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

export default mongoose.model('Booking', bookingSchema);
