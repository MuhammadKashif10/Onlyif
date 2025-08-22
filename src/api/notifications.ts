import { apiClient } from '../lib/api-client';
import { withMockFallback } from '../utils/mockWrapper';

interface Notification {
  id: string;
  userId: string;
  userType: 'buyer' | 'seller' | 'agent';
  type: 'property_unlocked' | 'inspection_booked' | 'new_match' | 'status_update' | 'new_assignment' | 'inquiry_received' | 'inspection_scheduled';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  emailSent: boolean;
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

interface EmailNotificationRequest {
  to: string;
  subject: string;
  template: string;
  data: any;
}

class NotificationAPI {
  // Add a new method that matches the expected interface
  async getNotifications(userId: string, userType: 'buyer' | 'seller' | 'agent'): Promise<Notification[]> {
    const response = await this.getAllNotifications(1, 20, 'all');
    return response.notifications.filter(n => n.userId === userId && n.userType === userType);
  }

  // Rename the existing method
  async getAllNotifications(page = 1, limit = 20, filter = 'all'): Promise<NotificationResponse> {
    const mockResponse = {
      notifications: [
        {
          id: '1',
          userId: 'user1',
          userType: 'buyer' as const,
          type: 'new_match' as const,
          title: 'New Property Match',
          message: 'A new property matching your criteria has been listed.',
          data: { propertyId: 'prop1' },
          read: false,
          createdAt: new Date().toISOString(),
          emailSent: true
        }
      ],
      pagination: { page, limit, total: 1, pages: 1 },
      unreadCount: 1
    };

    const realCall = async () => {
      const response = await apiClient.get<{ data: NotificationResponse }>(
        `/notifications?page=${page}&limit=${limit}&filter=${filter}`
      );
      return response.data;
    };

    return withMockFallback(() => Promise.resolve(mockResponse), realCall);
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const realCall = async () => {
      await apiClient.patch(`/notifications/${notificationId}`, { action: 'mark_read' });
      return true;
    };

    return withMockFallback(() => Promise.resolve(true), realCall);
  }

  async markAllAsRead(): Promise<boolean> {
    const realCall = async () => {
      await apiClient.patch('/notifications/bulk', { action: 'mark_all_read' });
      return true;
    };

    return withMockFallback(() => Promise.resolve(true), realCall);
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const realCall = async () => {
      await apiClient.delete(`/notifications/${notificationId}`);
      return true;
    };

    return withMockFallback(() => Promise.resolve(true), realCall);
  }

  async getUnreadCount(): Promise<number> {
    const realCall = async () => {
      const response = await apiClient.get<{ data: { unreadCount: number } }>('/notifications?limit=1');
      return response.data.unreadCount;
    };

    return withMockFallback(() => Promise.resolve(3), realCall);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'emailSent'>): Promise<Notification> {
    const mockNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      emailSent: false
    };

    const realCall = async () => {
      const response = await apiClient.post<{ data: Notification }>('/notifications', notification);
      return response.data;
    };

    return withMockFallback(() => Promise.resolve(mockNotification), realCall);
  }

  // Trigger notification events
  async triggerSellerNotification(type: 'property_unlocked' | 'inspection_booked', data: any): Promise<void> {
    const notifications = {
      property_unlocked: {
        title: 'Property Unlocked',
        message: 'Your property has been unlocked by a buyer.',
      },
      inspection_booked: {
        title: 'Inspection Scheduled',
        message: 'An inspection has been booked for your property.',
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.createNotification({
        userId: data.sellerId,
        userType: 'seller',
        type,
        title: notification.title,
        message: notification.message,
        data
      });
    }
  }

  async triggerBuyerNotification(type: 'new_match' | 'status_update', data: any): Promise<void> {
    const notifications = {
      new_match: {
        title: 'New Property Match',
        message: 'A new property matching your criteria has been listed.',
      },
      status_update: {
        title: 'Property Status Updated',
        message: 'The status of a property you\'re interested in has been updated.',
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.createNotification({
        userId: data.buyerId,
        userType: 'buyer',
        type,
        title: notification.title,
        message: notification.message,
        data
      });
    }
  }

  async triggerAgentNotification(type: 'new_assignment' | 'inspection_booked', data: any): Promise<void> {
    const notifications = {
      new_assignment: {
        title: 'New Property Assignment',
        message: 'You have been assigned to manage a new property.',
      },
      inspection_booked: {
        title: 'Inspection Booked',
        message: 'An inspection has been booked for one of your assigned properties.',
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.createNotification({
        userId: data.agentId,
        userType: 'agent',
        type,
        title: notification.title,
        message: notification.message,
        data
      });
    }
  }
}

export const notificationAPI = new NotificationAPI();
export type { Notification, EmailNotificationRequest, NotificationResponse };