import Post from '../models/Post.js';
import Group from '../models/Group.js';

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = { isActive: true };

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag.toLowerCase()] };
    }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Filter by group
    if (req.query.group) {
      query.group = req.query.group;
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'popular':
          sort = { likeCount: -1, createdAt: -1 };
          break;
        case 'trending':
          sort = { engagementScore: -1, createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name profileImage')
      .populate('group', 'name')
      .populate('comments.user', 'name profileImage')
      .sort(sort)
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
      count: posts.length,
      total,
      pagination,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profileImage bio')
      .populate('group', 'name description')
      .populate('comments.user', 'name profileImage')
      .populate('comments.replies.user', 'name profileImage');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    // If posting to a group, verify membership
    if (req.body.group) {
      const group = await Group.findById(req.body.group);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found',
        });
      }

      if (!group.isMember(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'You must be a member to post in this group',
        });
      }
    }

    const post = await Post.create(req.body);
    
    await post.populate('author', 'name profileImage');
    if (post.group) {
      await post.populate('group', 'name');
    }

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Make sure user owns post
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['content', 'location', 'tags'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('author', 'name profileImage');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Make sure user owns post or is admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.addLike(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: {
        likeCount: post.likes.length,
        isLiked: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike post
// @route   DELETE /api/posts/:id/like
// @access  Private
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.removeLike(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: {
        likeCount: post.likes.length,
        isLiked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.addComment(req.user.id, req.body.content);
    await post.populate('comments.user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post.comments[post.comments.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user owns comment or post, or is admin
    if (
      comment.user.toString() !== req.user.id &&
      post.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share post
// @route   POST /api/posts/:id/share
// @access  Private
export const sharePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.shares += 1;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post shared successfully',
      data: {
        shares: post.shares,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
export const getPostsByTag = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const query = {
      tags: { $in: [req.params.tag.toLowerCase()] },
      isActive: true,
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
export const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const query = {
      author: req.params.userId,
      isActive: true,
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};
