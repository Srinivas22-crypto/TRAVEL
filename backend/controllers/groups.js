import Group from '../models/Group.js';
import Post from '../models/Post.js';

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
export const getGroups = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter out private groups for non-members
    if (!req.user) {
      query.isPrivate = false;
    }

    const total = await Group.countDocuments(query);
    const groups = await Group.find(query)
      .populate('creator', 'name profileImage')
      .sort({ memberCount: -1, createdAt: -1 })
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
      count: groups.length,
      total,
      pagination,
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Public
export const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name profileImage bio')
      .populate('members.user', 'name profileImage');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if group is private and user is not a member
    if (group.isPrivate && req.user && !group.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'This is a private group',
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    const group = await Group.create(req.body);
    await group.populate('creator', 'name profileImage');

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
export const updateGroup = async (req, res, next) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is admin of the group
    const userRole = group.getUserRole(req.user.id);
    if (userRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this group',
      });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['name', 'description', 'category', 'isPrivate', 'rules', 'image', 'tags', 'settings'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('creator', 'name profileImage');

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Only creator or admin can delete group
    if (group.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this group',
      });
    }

    await group.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join group
// @route   POST /api/groups/:id/join
// @access  Private
export const joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    if (group.isMember(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group',
      });
    }

    await group.addMember(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Joined group successfully',
      data: {
        memberCount: group.members.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave group
// @route   POST /api/groups/:id/leave
// @access  Private
export const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    if (!group.isMember(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this group',
      });
    }

    // Don't allow creator to leave
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Group creator cannot leave the group',
      });
    }

    await group.removeMember(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Left group successfully',
      data: {
        memberCount: group.members.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group members
// @route   GET /api/groups/:id/members
// @access  Private
export const getGroupMembers = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'name profileImage bio');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is a member or group is public
    if (group.isPrivate && !group.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view group members',
      });
    }

    res.status(200).json({
      success: true,
      count: group.members.length,
      data: group.members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/groups/:id/members/:userId
// @access  Private
export const updateMemberRole = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is admin of the group
    const userRole = group.getUserRole(req.user.id);
    if (userRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update member roles',
      });
    }

    if (!group.isMember(req.params.userId)) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this group',
      });
    }

    await group.updateMemberRole(req.params.userId, req.body.role);

    res.status(200).json({
      success: true,
      message: 'Member role updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
export const removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is admin of the group
    const userRole = group.getUserRole(req.user.id);
    if (userRole !== 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members',
      });
    }

    // Don't allow removing the creator
    if (group.creator.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove group creator',
      });
    }

    if (!group.isMember(req.params.userId)) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this group',
      });
    }

    await group.removeMember(req.params.userId);

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group posts
// @route   GET /api/groups/:id/posts
// @access  Public
export const getGroupPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if group is private and user is not a member
    if (group.isPrivate && req.user && !group.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view group posts',
      });
    }

    const query = {
      group: req.params.id,
      isActive: true,
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name profileImage')
      .populate('comments.user', 'name profileImage')
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
