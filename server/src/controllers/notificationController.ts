import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';

export const getNotifications = catchAsync(async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.find({ user: req.user?._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const unreadCount = await Notification.countDocuments({ user: req.user?._id, read: false });

  res.status(200).json({
    success: true,
    data: notifications,
    unreadCount
  });
});

export const markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id === 'all') {
    await Notification.updateMany(
      { user: req.user?._id, read: false },
      { $set: { read: true } }
    );
  } else {
    await Notification.findOneAndUpdate(
      { _id: id, user: req.user?._id },
      { $set: { read: true } }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read'
  });
});
