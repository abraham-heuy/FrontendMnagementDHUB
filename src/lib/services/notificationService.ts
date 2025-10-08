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
  recipient?: {
    id: string;
    name?: string;
    email?: string;
  };
};


export type NotificationGroup = {
  id: string;
  name: string;
  members: {
    id: string;
    fullName?: string;
    email?: string;
  }[];
};

export const notificationService = {
  /** 👤 Get notifications received by the logged-in user */
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch(`${apiURL}/notifications/`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user notifications");
    return res.json();
  },

  /** 🧑‍💼 Get notifications for admin (received + sent) */
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch(`${apiURL}/notifications`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch admin notifications");
    return res.json();
  },

  /** 📬 Mark a specific notification as read */
  markAsRead: async (id: string): Promise<void> => {
    const res = await fetch(`${apiURL}/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
  },

  /** 📨 Create a new notification (student → admin or user → user) */
  createNotification: async (
    message: string,
    recipientId?: string,
    type: string = "UPDATE"
  ): Promise<NotificationItem> => {
    const res = await fetch(`${apiURL}/notifications/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, recipientId, type }),
    });
    if (!res.ok) throw new Error("Failed to create notification");
    return res.json();
  },

  /** 📢 Admin broadcast notification (to group, selected users, or all) */
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

  // 🔹 ------------------ GROUP MANAGEMENT ------------------ 🔹

  /** ➕ Create a new notification group */
  createGroup: async (name: string): Promise<NotificationGroup> => {
    const res = await fetch(`${apiURL}/notifications/groups`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create group");
    return res.json();
  },

  /** ➕ Add a user to an existing group */
  addUserToGroup: async (
    groupId: string,
    userId: string
  ): Promise<{ message: string; group: NotificationGroup }> => {
    const res = await fetch(`${apiURL}/notifications/groups/add`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, memberIds: [userId] }),
    });
    if (!res.ok) throw new Error("Failed to add user to group");
    return res.json();
  },

  /** 📋 List all groups */
  getAllGroups: async (): Promise<NotificationGroup[]> => {
    const res = await fetch(`${apiURL}/notifications/groups`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch groups");
    return res.json();
  },

  /** 🚀 Send notification wrapper (for admin UI) */
  sendNotification: async (payload: {
    message: string;
    type?: string;
    recipientIds?: string[];
    groupId?: string;
    all?: boolean;
  }) => {
    return notificationService.broadcastNotification(payload);
  },
};

// ✅ Named exports
export const {
  getNotifications,
  getMyNotifications,
  createNotification,
  markAsRead,
  broadcastNotification,
  createGroup,
  addUserToGroup,
  getAllGroups,
  sendNotification,
} = notificationService;

