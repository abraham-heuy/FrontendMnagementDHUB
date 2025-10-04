// src/services/notificationService.ts

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export type NotificationItem = {
  id: string;
  message: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
  sender?: {
    id: string;
    name?: string;
    email?: string;
  };
};

/**
 * Notification Service
 * - Handles both student & admin interactions with notification endpoints
 */
export const notificationService = {
  /**
   * Get all notifications for the logged-in user
   */
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch(`${apiURL}/notifications`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id: string): Promise<void> => {
    const res = await fetch(`${apiURL}/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
  },

  /**
   * Create a notification (student → admin OR student → another user)
   */
  createNotification: async (
    message: string,
    recipientId?: string,
    type: string = "UPDATE"
  ): Promise<NotificationItem> => {
    const res = await fetch(`${apiURL}/notifications`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, recipientId, type }),
    });
    if (!res.ok) throw new Error("Failed to create notification");
    return res.json();
  },

  /**
   * Admin broadcast (to group, selected users, or all)
   */
  broadcastNotification: async (params: {
    message: string;
    recipientIds?: string[];
    groupId?: string;
    all?: boolean;
    type?: string;
  }): Promise<{ message: string; count: number }> => {
    const res = await fetch(`${apiURL}/notifications/broadcast`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to broadcast notifications");
    return res.json();
  },
};
