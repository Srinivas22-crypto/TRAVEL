import Flight from '../models/Flight.js';

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
export const getFlights = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build query
    let query = { isActive: true };

    // Filter by airline
    if (req.query.airline) {
      query.airline = { $regex: req.query.airline, $options: 'i' };
    }

    // Filter by departure city
    if (req.query.from) {
      query['departure.city'] = { $regex: req.query.from, $options: 'i' };
    }

    // Filter by arrival city
    if (req.query.to) {
      query['arrival.city'] = { $regex: req.query.to, $options: 'i' };
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query['departure.dateTime'] = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const total = await Flight.countDocuments(query);
    const flights = await Flight.find(query)
      .sort({ 'departure.dateTime': 1 })
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: flights.length,
      total,
      pagination,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
export const getFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private/Admin
export const createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);

    res.status(201).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
export const updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
export const deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    await flight.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search flights
// @route   GET /api/flights/search
// @access  Public
export const searchFlights = async (req, res, next) => {
  try {
    const { from, to, departureDate, returnDate, passengers = 1, class: flightClass, maxPrice } = req.query;

    if (!from || !to || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'From, to, and departure date are required',
      });
    }

    // Build search query
    let query = {
      'departure.city': { $regex: from, $options: 'i' },
      'arrival.city': { $regex: to, $options: 'i' },
      isActive: true,
    };

    // Date filter
    const depDate = new Date(departureDate);
    const nextDay = new Date(depDate);
    nextDay.setDate(depDate.getDate() + 1);

    query['departure.dateTime'] = {
      $gte: depDate,
      $lt: nextDay,
    };

    // Check available seats
    const seatField = flightClass === 'business' ? 'business' : 
                     flightClass === 'first' ? 'first' : 'economy';
    
    query[`availableSeats.${seatField}`] = { $gte: parseInt(passengers) };

    // Price filter
    if (maxPrice) {
      query[`price.${seatField}`] = { $lte: parseFloat(maxPrice) };
    }

    const flights = await Flight.find(query)
      .sort({ [`price.${seatField}`]: 1 })
      .limit(50);

    // If return date is provided, search for return flights
    let returnFlights = [];
    if (returnDate) {
      const retDate = new Date(returnDate);
      const nextRetDay = new Date(retDate);
      nextRetDay.setDate(retDate.getDate() + 1);

      const returnQuery = {
        'departure.city': { $regex: to, $options: 'i' },
        'arrival.city': { $regex: from, $options: 'i' },
        'departure.dateTime': {
          $gte: retDate,
          $lt: nextRetDay,
        },
        [`availableSeats.${seatField}`]: { $gte: parseInt(passengers) },
        isActive: true,
      };

      if (maxPrice) {
        returnQuery[`price.${seatField}`] = { $lte: parseFloat(maxPrice) };
      }

      returnFlights = await Flight.find(returnQuery)
        .sort({ [`price.${seatField}`]: 1 })
        .limit(50);
    }

    res.status(200).json({
      success: true,
      data: {
        outboundFlights: flights,
        returnFlights: returnFlights,
        searchParams: {
          from,
          to,
          departureDate,
          returnDate,
          passengers,
          class: flightClass || 'economy',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get flight deals
// @route   GET /api/flights/deals
// @access  Public
export const getFlightDeals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    // Get flights with good prices (you can customize this logic)
    const flights = await Flight.find({
      isActive: true,
      'departure.dateTime': { $gte: new Date() },
    })
      .sort({ 'price.economy': 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};
