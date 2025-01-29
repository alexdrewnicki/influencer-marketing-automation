import api from './api';

export interface Notification {
  id: string;
  influencerId: string;
  type: 'contract' | 'review' | 'payment' | 'reminder';
  title: string;
  message: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  sendContractNotification: async (influencerId: string, contractId: string) => {
    const response = await api.post('/notifications/contract', {
      influencerId,
      contractId,
      type: 'contract'
    });
    return response.data;
  },

  sendBulkNotifications: async (notifications: Array<{
    influencerId: string;
    type: string;
    message: string;
    metadata?: Record<string, any>;
  }>) => {
    const response = await api.post('/notifications/bulk', { notifications });
    return response.data;
  },

  getNotificationStatus: async (notificationId: string) => {
    const response = await api.get(`/notifications/${notificationId}/status`);
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  scheduleReminder: async (influencerId: string, reminderData: {
    type: string;
    message: string;
    scheduledFor: string;
  }) => {
    const response = await api.post('/notifications/schedule', {
      influencerId,
      ...reminderData
    });
    return response.data;
  }
};
