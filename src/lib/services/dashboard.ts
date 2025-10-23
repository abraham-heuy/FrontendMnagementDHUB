// Dashboard service for comprehensive student data
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

  // Get current stage and substages for mentee
  getCurrentStage: async () => {
    const res = await fetch(`${apiURL}/startup/mentee/substages`, {
      credentials: "include",
    });
    if (res.status === 404) return { data: null };
    if (!res.ok) throw new Error("Failed to fetch current stage");
    const response = await res.json();

    // Transform the response to match expected format
    if (response.startup && response.substages) {
      return {
        data: {
          id: response.startup.id,
          startupTitle: response.startup.title || "My Startup",
          stageName: response.startup.currentStage || "Not Assigned",
          subStageName: response.startup.currentSubStage || "Not Assigned",
          status: "active",
          progressPercent: Math.round((response.startup.cumulativeScore / 100) * 100) || 0,
          started_at: new Date().toISOString(),
          activities: response.substages.map((sub: any) => ({
            id: sub.substage_id,
            name: sub.name,
            status: sub.status.toUpperCase(),
            required: true,
            order: sub.order,
            weightScore: sub.weightScore,
            scoreAwarded: sub.scoreAwarded,
            reviewerComment: sub.reviewerComment,
          })),
        },
      };
    }
    return { data: null };
  },

  // Get events
  getEvents: async () => {
    const res = await fetch(`${apiURL}/events`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    const response = await res.json();

    // Transform events to match expected format
    const events = Array.isArray(response) ? response : response.events || [];
    return {
      data: {
        events: events.map((event: any) => ({
          id: event.event_id || event.id,
          title: event.title,
          description: event.description || "",
          date: event.startDate || event.date,
          location: event.location || "TBA",
          category: event.category || "general",
        }))
      }
    };
  },

  // Get notifications
  getNotifications: async () => {
    const res = await fetch(`${apiURL}/notifications`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    const response = await res.json();

    // Transform notifications to match expected format
    const notifications = Array.isArray(response) ? response : response.notifications || [];
    return {
      data: notifications.map((notif: any) => ({
        id: notif.notification_id || notif.id,
        title: notif.title,
        message: notif.message,
        is_read: notif.is_read || false,
        type: notif.type || "info",
        created_at: notif.created_at || notif.createdAt,
      }))
    };
  },

  // Get student profile
  getStudentProfile: async () => {
    const res = await fetch(`${apiURL}/profile/me`, {
      credentials: "include",
    });
    if (res.status === 404) return { data: null };
    if (!res.ok) throw new Error("Failed to fetch profile");
    const response = await res.json();

    // Transform profile to match expected format
    return {
      data: {
        id: response.mentee_profile_id || response.id,
        bio: response.bio || "",
        skills: response.skills || [],
        startup_idea: response.startup_idea || "",
        institution: response.institution || "",
        course: response.course || "",
        phone: response.phone || "",
        yearOfStudy: response.yearOfStudy || "",
        linkedIn: response.linkedIn || "",
        website: response.website || "",
        profilePicture: response.profilePicture || "",
      }
    };
  },

  // Get progress logs - temporarily returns empty until a dedicated backend endpoint exists
  getProgressLogs: async (_studentId: string) => {
    // Intentionally not calling any endpoint here because
    // `/startup/mentee/stage/progression` is a state-check endpoint that can
    // validly return 400 when the current substage isn't approved yet, which
    // is noisy for a passive dashboard load. Once a logs endpoint exists,
    // wire it up here and transform accordingly.
    return { data: [] };
  },

  // Complete activity (submit substage)
  completeActivity: async (activityId: string) => {
    const res = await fetch(`${apiURL}/startup/mentee/substages/${activityId}/submit`, {
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