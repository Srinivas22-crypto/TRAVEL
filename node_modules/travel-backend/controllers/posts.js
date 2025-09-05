import Post from '../models/Post.js';
import User from '../models/User.js';

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
      .populate('author', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage')
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
      .populate('author', 'firstName lastName profileImage bio')
      .populate('comments.user', 'firstName lastName profileImage')
      .populate('comments.replies.user', 'firstName lastName profileImage');

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

    const post = await Post.create(req.body);
    
    await post.populate('author', 'firstName lastName profileImage');

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
    }).populate('author', 'firstName lastName profileImage');

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
    await post.populate('comments.user', 'firstName lastName profileImage');

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
      .populate('author', 'firstName lastName profileImage')
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

// @desc    Save post
// @route   POST /api/posts/:id/save
// @access  Private
export const savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);
    await user.savePost(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post saved successfully',
      data: {
        isSaved: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave post
// @route   DELETE /api/posts/:id/save
// @access  Private
export const unsavePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);
    await user.unsavePost(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post unsaved successfully',
      data: {
        isSaved: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply to comment
// @route   POST /api/posts/:id/comment/:commentId/reply
// @access  Private
export const addReply = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.addReply(req.params.commentId, req.user.id, req.body.content);
    await post.populate('comments.replies.user', 'firstName lastName profileImage');

    const comment = post.comments.id(req.params.commentId);
    const newReply = comment.replies[comment.replies.length - 1];

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: newReply,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like comment
// @route   POST /api/posts/:id/comment/:commentId/like
// @access  Private
export const likeComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.likeComment(req.params.commentId, req.user.id);
    const comment = post.comments.id(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      data: {
        likeCount: comment.likes.length,
        isLiked: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike comment
// @route   DELETE /api/posts/:id/comment/:commentId/like
// @access  Private
export const unlikeComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.unlikeComment(req.params.commentId, req.user.id);
    const comment = post.comments.id(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment unliked successfully',
      data: {
        likeCount: comment.likes.length,
        isLiked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/posts/:id/comment/:commentId
// @access  Private
export const updateComment = async (req, res, next) => {
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

    // Check if user owns comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    await post.updateComment(req.params.commentId, req.body.content);
    await post.populate('comments.user', 'firstName lastName profileImage');

    const updatedComment = post.comments.id(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark post as interested
// @route   POST /api/posts/:id/interested
// @access  Private
export const markInterested = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);
    
    // Add all post tags to interested tags
    for (const tag of post.tags) {
      await user.addInterestedTag(tag);
    }

    res.status(200).json({
      success: true,
      message: 'Marked as interested successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark post as not interested
// @route   POST /api/posts/:id/not-interested
// @access  Private
export const markNotInterested = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);
    
    // Add all post tags to not interested tags
    for (const tag of post.tags) {
      await user.addNotInterestedTag(tag);
    }

    res.status(200).json({
      success: true,
      message: 'Marked as not interested successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report post
// @route   POST /api/posts/:id/report
// @access  Private
export const reportPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);
    await user.reportPost(req.params.id, req.body.reason);

    res.status(200).json({
      success: true,
      message: 'Post reported successfully',
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
      .populate('author', 'firstName lastName profileImage')
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
