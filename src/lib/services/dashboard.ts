// Dashboard service for comprehensive student data
import type { DashboardData, DashboardStats } from '../types/dashboardTypes';

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const getDashboardStats = {
  // Get current user data
  getCurrentUser: async () => {
    const res = await fetch(`${apiURL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return { data: await res.json() };
  },

  // Get current stage
  getCurrentStage: async () => {
    const res = await fetch(`${apiURL}/stages/me/current`, {
      credentials: "include",
    });
    if (res.status === 404) return { data: null };
    if (!res.ok) throw new Error("Failed to fetch current stage");
    return { data: await res.json() };
  },

  // Get events
  getEvents: async () => {
    const res = await fetch(`${apiURL}/events`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    return { data: await res.json() };
  },

  // Get notifications
  getNotifications: async () => {
    const res = await fetch(`${apiURL}/notifications`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return { data: await res.json() };
  },

  // Get student profile
  getStudentProfile: async () => {
    const res = await fetch(`${apiURL}/profile/me`, {
      credentials: "include",
    });
    if (res.status === 404) return { data: null };
    if (!res.ok) throw new Error("Failed to fetch profile");
    return { data: await res.json() };
  },

  // Get progress logs for student
  getProgressLogs: async (studentId: string) => {
    const res = await fetch(`${apiURL}/logs/student/${studentId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch progress logs");
    return { data: await res.json() };
  },

  // Complete activity
  completeActivity: async (activityId: string) => {
    const res = await fetch(`${apiURL}/studentActivities/activities/${activityId}/complete`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to complete activity");
    return { data: await res.json() };
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string) => {
    const res = await fetch(`${apiURL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
    return { data: await res.json() };
  },
};