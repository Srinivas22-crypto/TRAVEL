import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Car from '../models/Car.js';

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('flight')
      .populate('hotel')
      .populate('car')
      .populate('transaction')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('flight')
      .populate('hotel')
      .populate('car')
      .populate('transaction');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Validate the booking item exists and is available
    let bookingItem;
    switch (req.body.type) {
      case 'flight':
        bookingItem = await Flight.findById(req.body.flight);
        if (!bookingItem || !bookingItem.isActive) {
          return res.status(404).json({
            success: false,
            message: 'Flight not found or not available',
          });
        }
        
        // Check seat availability
        const flightClass = req.body.flightDetails?.class || 'economy';
        const requiredSeats = req.body.passengers?.length || 1;
        if (bookingItem.availableSeats[flightClass] < requiredSeats) {
          return res.status(400).json({
            success: false,
            message: 'Not enough seats available',
          });
        }
        break;

      case 'hotel':
        bookingItem = await Hotel.findById(req.body.hotel);
        if (!bookingItem || !bookingItem.isActive) {
          return res.status(404).json({
            success: false,
            message: 'Hotel not found or not available',
          });
        }
        
        // Check room availability
        const roomType = req.body.roomDetails?.roomType || 'standard';
        const requiredRooms = req.body.roomDetails?.numberOfRooms || 1;
        if (bookingItem.totalRooms[roomType] < requiredRooms) {
          return res.status(400).json({
            success: false,
            message: 'Not enough rooms available',
          });
        }
        break;

      case 'car':
        bookingItem = await Car.findById(req.body.car);
        if (!bookingItem || !bookingItem.isAvailable) {
          return res.status(404).json({
            success: false,
            message: 'Car not found or not available',
          });
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid booking type',
        });
    }

    const booking = await Booking.create(req.body);

    // Populate the created booking
    await booking.populate('user', 'name email');
    await booking.populate(req.body.type);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['specialRequests'];
    if (req.user.role === 'admin') {
      allowedFields.push('status', 'paymentStatus');
    }

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email').populate(booking.type);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking',
      });
    }

    booking.status = 'cancelled';
    if (req.body.reason) {
      booking.specialRequests = `Cancelled: ${req.body.reason}`;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    let query = { user: req.user.id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('flight')
      .populate('hotel')
      .populate('car')
      .populate('transaction')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
