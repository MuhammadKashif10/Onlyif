const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await Notification.countDocuments({ user: req.user.id });
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Notifications retrieved successfully')
  );
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json(
      errorResponse('Notification not found', 404)
    );
  }

  if (notification.user.toString() !== req.user.id) {
    return res.status(403).json(
      errorResponse('Not authorized to update this notification', 403)
    );
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.json(
    successResponse(notification, 'Notification marked as read')
  );
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.json(
    successResponse(null, 'All notifications marked as read')
  );
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });

  res.json(
    successResponse({ count }, 'Unread count retrieved successfully')
  );
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};