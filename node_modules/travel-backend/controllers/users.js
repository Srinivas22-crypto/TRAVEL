import User from '../models/User.js';
import Post from '../models/Post.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build query
    let query = {};
    
    // Search functionality
    if (req.query.search) {
      query = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      };
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by verification status
    if (req.query.isVerified !== undefined) {
      query.isVerified = req.query.isVerified === 'true';
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
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
      count: users.length,
      total,
      pagination,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Users can only view their own profile unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Don't allow admin to delete themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved posts
// @route   GET /api/users/saved-posts
// @access  Private
export const getSavedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedPosts',
        populate: {
          path: 'author',
          select: 'firstName lastName profileImage',
        },
        options: {
          sort: { createdAt: -1 },
          limit: limit,
          skip: startIndex,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const total = user.savedPosts.length;

    res.status(200).json({
      success: true,
      count: user.savedPosts.length,
      total,
      data: user.savedPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's comments
// @route   GET /api/users/my-comments
// @access  Private
export const getUserComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    // Find all posts that have comments by this user
    const posts = await Post.find({
      'comments.user': req.user.id,
      isActive: true,
    })
      .populate('author', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage')
      .sort({ 'comments.createdAt': -1 })
      .limit(limit)
      .skip(startIndex);

    // Extract user's comments from the posts
    const userComments = [];
    posts.forEach(post => {
      post.comments.forEach(comment => {
        if (comment.user._id.toString() === req.user.id) {
          userComments.push({
            _id: comment._id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            likes: comment.likes.length,
            replies: comment.replies.length,
            post: {
              _id: post._id,
              content: post.content.substring(0, 100) + '...',
              author: post.author,
            },
          });
        }
      });
    });

    // Also find replies by this user
    const postsWithReplies = await Post.find({
      'comments.replies.user': req.user.id,
      isActive: true,
    })
      .populate('author', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage')
      .populate('comments.replies.user', 'firstName lastName profileImage');

    postsWithReplies.forEach(post => {
      post.comments.forEach(comment => {
        comment.replies.forEach(reply => {
          if (reply.user._id.toString() === req.user.id) {
            userComments.push({
              _id: reply._id,
              content: reply.content,
              createdAt: reply.createdAt,
              isReply: true,
              parentComment: {
                _id: comment._id,
                content: comment.content.substring(0, 50) + '...',
                user: comment.user,
              },
              post: {
                _id: post._id,
                content: post.content.substring(0, 100) + '...',
                author: post.author,
              },
            });
          }
        });
      });
    });

    // Sort by creation date
    userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: userComments.length,
      data: userComments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's content preferences
// @route   GET /api/users/preferences
// @access  Private
export const getUserPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('contentPreferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.contentPreferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's content preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update preferences
    if (req.body.interestedTags) {
      user.contentPreferences.interestedTags = req.body.interestedTags;
    }
    if (req.body.notInterestedTags) {
      user.contentPreferences.notInterestedTags = req.body.notInterestedTags;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.contentPreferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image
// @route   POST /api/users/upload-profile-image
// @access  Private
export const uploadProfileImage = async (req, res, next) => {
  try {
    // This is a placeholder for image upload functionality
    // In a real implementation, you would:
    // 1. Use multer middleware to handle file upload
    // 2. Upload to cloud storage (Cloudinary, AWS S3, etc.)
    // 3. Return the image URL

    // For now, we'll just return a mock response
    const imageUrl = 'https://via.placeholder.com/150';

    // Update user's profile image
    await User.findByIdAndUpdate(req.user.id, {
      profileImage: imageUrl,
    });

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
