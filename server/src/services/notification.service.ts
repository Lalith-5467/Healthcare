import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type?: string;
  category?: string;
  relatedModule?: string;
}

export class NotificationService {
  /**
   * Get all notifications for the user
   */
  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(id: string, userId: string) {
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new AppError('Notification not found', 404);
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  }

  /**
   * Create notification
   */
  static async createNotification(data: CreateNotificationDTO) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'SYSTEM',
        category: data.category || 'General',
        relatedModule: data.relatedModule || null,
      },
    });
  }
}
