import express from 'express';
import Trip from '../models/Trip.js';
import auth from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for trip operations
const tripRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many trip requests, please try again later.'
});

// Apply rate limiting to all trip routes
router.use(tripRateLimit);

// GET /api/trips - Get all trips for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { userId: req.user.id };
    if (status && ['draft', 'planned', 'completed', 'cancelled'].includes(status)) {
      query.status = status;
    }
    
    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();
    
    const total = await Trip.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/trips/:id - Get a specific trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns this trip
    if (!trip.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/trips - Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      startLocation,
      destination,
      stops = [],
      travelMode = 'car',
      estimatedTime = '',
      estimatedDistance = '',
      isPlanned = false,
      mapLocations = [],
      status = 'draft'
    } = req.body;
    
    // Validation
    if (!name || !startLocation || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Name, start location, and destination are required'
      });
    }
    
    if (stops.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 stops allowed per trip'
      });
    }
    
    const trip = new Trip({
      userId: req.user.id,
      name: name.trim(),
      startLocation: startLocation.trim(),
      destination: destination.trim(),
      stops,
      travelMode,
      estimatedTime,
      estimatedDistance,
      isPlanned,
      mapLocations,
      status
    });
    
    await trip.save();
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/trips/:id - Update a trip
router.put('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns this trip
    if (!trip.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const {
      name,
      startLocation,
      destination,
      stops,
      travelMode,
      estimatedTime,
      estimatedDistance,
      isPlanned,
      mapLocations,
      status
    } = req.body;
    
    // Validation
    if (stops && stops.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 stops allowed per trip'
      });
    }
    
    // Update fields
    if (name !== undefined) trip.name = name.trim();
    if (startLocation !== undefined) trip.startLocation = startLocation.trim();
    if (destination !== undefined) trip.destination = destination.trim();
    if (stops !== undefined) trip.stops = stops;
    if (travelMode !== undefined) trip.travelMode = travelMode;
    if (estimatedTime !== undefined) trip.estimatedTime = estimatedTime;
    if (estimatedDistance !== undefined) trip.estimatedDistance = estimatedDistance;
    if (isPlanned !== undefined) trip.isPlanned = isPlanned;
    if (mapLocations !== undefined) trip.mapLocations = mapLocations;
    if (status !== undefined) trip.status = status;
    
    await trip.save();
    
    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns this trip
    if (!trip.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await Trip.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/trips/:id/duplicate - Duplicate a trip
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalTrip = await Trip.findById(req.params.id);
    
    if (!originalTrip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns this trip
    if (!originalTrip.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Create duplicate trip
    const duplicateTrip = new Trip({
      userId: req.user.id,
      name: `${originalTrip.name} (Copy)`,
      startLocation: originalTrip.startLocation,
      destination: originalTrip.destination,
      stops: originalTrip.stops,
      travelMode: originalTrip.travelMode,
      estimatedTime: originalTrip.estimatedTime,
      estimatedDistance: originalTrip.estimatedDistance,
      isPlanned: false, // Reset planning status
      mapLocations: originalTrip.mapLocations,
      status: 'draft' // Reset to draft
    });
    
    await duplicateTrip.save();
    
    res.status(201).json({
      success: true,
      message: 'Trip duplicated successfully',
      data: duplicateTrip
    });
  } catch (error) {
    console.error('Error duplicating trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error duplicating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH /api/trips/:id/status - Update trip status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'planned', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns this trip
    if (!trip.isOwnedBy(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    trip.status = status;
    await trip.save();
    
    res.json({
      success: true,
      message: 'Trip status updated successfully',
      data: trip
    });
  } catch (error) {
    console.error('Error updating trip status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trip status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;