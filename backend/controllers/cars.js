import Car from '../models/Car.js';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = { isAvailable: true };

    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.make) {
      query.make = { $regex: req.query.make, $options: 'i' };
    }

    if (req.query.minPrice && req.query.maxPrice) {
      query.pricePerDay = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    }

    const total = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .sort({ pricePerDay: 1 })
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
      count: cars.length,
      total,
      pagination,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    await car.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search cars
// @route   GET /api/cars/search
// @access  Public
export const searchCars = async (req, res, next) => {
  try {
    const { location, pickupDate, returnDate, category, maxPrice } = req.query;

    if (!location || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Location, pickup date, and return date are required',
      });
    }

    let query = {
      $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
      ],
      isAvailable: true,
    };

    if (category) {
      query.category = category;
    }

    if (maxPrice) {
      query.pricePerDay = { $lte: parseFloat(maxPrice) };
    }

    const cars = await Car.find(query)
      .sort({ pricePerDay: 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        cars,
        searchParams: {
          location,
          pickupDate,
          returnDate,
          category,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
