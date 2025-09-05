import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - author
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Post ID
 *         author:
 *           type: string
 *           description: User ID of the post author
 *         content:
 *           type: string
 *           description: Post content
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         location:
 *           type: string
 *           description: Location mentioned in the post
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Post tags/hashtags
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the post
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         shares:
 *           type: number
 *           description: Number of shares
 *         isActive:
 *           type: boolean
 *           description: Whether post is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters'],
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  replies: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'Reply cannot be more than 300 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [2000, 'Post content cannot be more than 2000 characters'],
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Please provide valid HTTP or HTTPS URLs',
    },
  }],
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot be more than 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Tags can only contain letters, numbers, and underscores',
    },
  }],
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
  shares: {
    type: Number,
    default: 0,
    min: [0, 'Shares cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  }, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create indexes for search and performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ location: 'text', content: 'text' });
postSchema.index({ createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for engagement score (likes + comments + shares)
postSchema.virtual('engagementScore').get(function() {
  return this.likes.length + this.comments.length + this.shares;
});

// Method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Method to add like
postSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content,
  });
  return this.save();
};

// Method to add reply to comment
postSchema.methods.addReply = function(commentId, userId, content) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  comment.replies.push({
    user: userId,
    content: content,
  });
  return this.save();
};

// Method to like a comment
postSchema.methods.likeComment = function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  if (!comment.likes.includes(userId)) {
    comment.likes.push(userId);
  }
  return this.save();
};

// Method to unlike a comment
postSchema.methods.unlikeComment = function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  comment.likes = comment.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Method to update comment
postSchema.methods.updateComment = function(commentId, content) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  comment.content = content;
  return this.save();
};

// Method to delete comment
postSchema.methods.deleteComment = function(commentId) {
  this.comments.id(commentId).deleteOne();
  return this.save();
};

export default mongoose.model('Post', postSchema);
