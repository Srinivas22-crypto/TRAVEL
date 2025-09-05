import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *         bio:
 *           type: string
 *           description: User's bio
 *         profileImage:
 *           type: string
 *           description: URL to user's profile image
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User's role
 *         isVerified:
 *           type: boolean
 *           description: Whether user's email is verified
 *         preferences:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             currency:
 *               type: string
 *             notifications:
 *               type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
  },
  savedPosts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  }],
  contentPreferences: {
    interestedTags: [{
      type: String,
      lowercase: true,
    }],
    notInterestedTags: [{
      type: String,
      lowercase: true,
    }],
    reportedPosts: [{
      post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
      reason: {
        type: String,
        required: true,
      },
      reportedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
}, {
  timestamps: true,
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Method to save a post
userSchema.methods.savePost = function(postId) {
  if (!this.savedPosts.includes(postId)) {
    this.savedPosts.push(postId);
  }
  return this.save();
};

// Method to unsave a post
userSchema.methods.unsavePost = function(postId) {
  this.savedPosts = this.savedPosts.filter(id => !id.equals(postId));
  return this.save();
};

// Method to check if post is saved
userSchema.methods.isPostSaved = function(postId) {
  return this.savedPosts.includes(postId);
};

// Method to add interested tag
userSchema.methods.addInterestedTag = function(tag) {
  const normalizedTag = tag.toLowerCase();
  if (!this.contentPreferences.interestedTags.includes(normalizedTag)) {
    this.contentPreferences.interestedTags.push(normalizedTag);
    // Remove from not interested if it exists
    this.contentPreferences.notInterestedTags = this.contentPreferences.notInterestedTags.filter(
      t => t !== normalizedTag
    );
  }
  return this.save();
};

// Method to add not interested tag
userSchema.methods.addNotInterestedTag = function(tag) {
  const normalizedTag = tag.toLowerCase();
  if (!this.contentPreferences.notInterestedTags.includes(normalizedTag)) {
    this.contentPreferences.notInterestedTags.push(normalizedTag);
    // Remove from interested if it exists
    this.contentPreferences.interestedTags = this.contentPreferences.interestedTags.filter(
      t => t !== normalizedTag
    );
  }
  return this.save();
};

// Method to report a post
userSchema.methods.reportPost = function(postId, reason) {
  const existingReport = this.contentPreferences.reportedPosts.find(
    report => report.post.equals(postId)
  );
  
  if (!existingReport) {
    this.contentPreferences.reportedPosts.push({
      post: postId,
      reason: reason,
    });
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;