import mongoose from 'mongoose';

const routeStopSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  startLocation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  stops: [routeStopSchema],
  travelMode: {
    type: String,
    enum: ['car', 'flight'],
    required: true,
    default: 'car'
  },
  estimatedTime: {
    type: String,
    default: ''
  },
  estimatedDistance: {
    type: String,
    default: ''
  },
  isPlanned: {
    type: Boolean,
    default: false
  },
  mapLocations: [{
    name: String,
    coordinates: [Number], // [lat, lng]
    type: {
      type: String,
      enum: ['start', 'stop', 'end']
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'planned', 'completed', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ userId: 1, status: 1 });

// Virtual for trip duration in a more readable format
tripSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Instance method to check if user owns this trip
tripSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// Static method to find trips by user
tripSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

// Pre-save middleware to validate stops
tripSchema.pre('save', function(next) {
  if (this.stops && this.stops.length > 5) {
    return next(new Error('Maximum 5 stops allowed per trip'));
  }
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;