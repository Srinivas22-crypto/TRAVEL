import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - creator
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Group ID
 *         name:
 *           type: string
 *           description: Group name
 *         description:
 *           type: string
 *           description: Group description
 *         creator:
 *           type: string
 *           description: User ID of group creator
 *         category:
 *           type: string
 *           description: Group category
 *         image:
 *           type: string
 *           description: Group cover image URL
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [member, moderator, admin]
 *               joinedAt:
 *                 type: string
 *                 format: date-time
 *         isPrivate:
 *           type: boolean
 *           description: Whether group is private
 *         rules:
 *           type: array
 *           items:
 *             type: string
 *           description: Group rules
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Group tags
 *         isActive:
 *           type: boolean
 *           description: Whether group is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin'],
    default: 'member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide group name'],
    trim: true,
    maxlength: [100, 'Group name cannot be more than 100 characters'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide group description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Group must have a creator'],
  },
  category: {
    type: String,
    required: [true, 'Please provide group category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters'],
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'Please provide a valid HTTP or HTTPS URL',
    },
  },
  members: [memberSchema],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  rules: [{
    type: String,
    trim: true,
    maxlength: [200, 'Rule cannot be more than 200 characters'],
  }],
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
  isActive: {
    type: Boolean,
    default: true,
  },
  settings: {
    allowMemberPosts: {
      type: Boolean,
      default: true,
    },
    requireApproval: {
      type: Boolean,
      default: false,
    },
    allowInvites: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create indexes
groupSchema.index({ name: 'text', description: 'text', category: 'text' });
groupSchema.index({ category: 1, createdAt: -1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ tags: 1 });

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for posts (will be populated by virtual populate)
groupSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'group',
  justOne: false,
});

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.equals(userId));
};

// Method to get user role in group
groupSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(member => member.user.equals(userId));
  return member ? member.role : null;
};

// Method to add member
groupSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role,
    });
  }
  return this.save();
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => !member.user.equals(userId));
  return this.save();
};

// Method to update member role
groupSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => member.user.equals(userId));
  if (member) {
    member.role = newRole;
  }
  return this.save();
};

// Pre-save middleware to add creator as admin
groupSchema.pre('save', function(next) {
  if (this.isNew) {
    this.members.push({
      user: this.creator,
      role: 'admin',
    });
  }
  next();
});

export default mongoose.model('Group', groupSchema);
