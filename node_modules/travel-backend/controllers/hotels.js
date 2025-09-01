import Hotel from '../models/Hotel.js';

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = { isActive: true };

    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    if (req.query.country) {
      query['location.country'] = { $regex: req.query.country, $options: 'i' };
    }

    if (req.query.minPrice && req.query.maxPrice) {
      query['pricePerNight.standard'] = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    }

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort({ rating: -1 })
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
      count: hotels.length,
      total,
      pagination,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search hotels
// @route   GET /api/hotels/search
// @access  Public
export const searchHotels = async (req, res, next) => {
  try {
    const { destination, checkIn, checkOut, guests = 1, rooms = 1, maxPrice } = req.query;

    if (!destination || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Destination, check-in, and check-out dates are required',
      });
    }

    let query = {
      $or: [
        { 'location.city': { $regex: destination, $options: 'i' } },
        { 'location.country': { $regex: destination, $options: 'i' } },
        { name: { $regex: destination, $options: 'i' } },
      ],
      isActive: true,
    };

    // Check room availability (simplified - in real app, you'd check actual bookings)
    query['totalRooms.standard'] = { $gte: parseInt(rooms) };

    if (maxPrice) {
      query['pricePerNight.standard'] = { $lte: parseFloat(maxPrice) };
    }

    const hotels = await Hotel.find(query)
      .sort({ rating: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        hotels,
        searchParams: {
          destination,
          checkIn,
          checkOut,
          guests,
          rooms,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hotel deals
// @route   GET /api/hotels/deals
// @access  Public
export const getHotelDeals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const hotels = await Hotel.find({
      isActive: true,
      rating: { $gte: 4.0 },
    })
      .sort({ 'pricePerNight.standard': 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};
