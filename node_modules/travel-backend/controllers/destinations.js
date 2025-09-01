import Destination from '../models/Destination.js';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build query
    let query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by country
    if (req.query.country) {
      query.country = { $regex: req.query.country, $options: 'i' };
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'rating':
          sort = { averageRating: -1 };
          break;
        case 'popular':
          sort = { totalReviews: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .populate('createdBy', 'name');

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
      count: destinations.length,
      total,
      pagination,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews');

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    await destination.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get destinations by category
// @route   GET /api/destinations/category/:category
// @access  Public
export const getDestinationsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const query = {
      category: req.params.category,
      isActive: true,
    };

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort({ averageRating: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search destinations
// @route   GET /api/destinations/search
// @access  Public
export const searchDestinations = async (req, res, next) => {
  try {
    const { q, category, minBudget, maxBudget } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    let query = {
      $text: { $search: q },
      isActive: true,
    };

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add budget filter
    if (minBudget || maxBudget) {
      query.$or = [];
      
      if (minBudget) {
        query.$or.push({ 'estimatedBudget.budget': { $gte: parseInt(minBudget) } });
      }
      
      if (maxBudget) {
        query.$or.push({ 'estimatedBudget.budget': { $lte: parseInt(maxBudget) } });
      }
    }

    const destinations = await Destination.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular destinations
// @route   GET /api/destinations/popular
// @access  Public
export const getPopularDestinations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const destinations = await Destination.find({ isActive: true })
      .sort({ totalReviews: -1, averageRating: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};
