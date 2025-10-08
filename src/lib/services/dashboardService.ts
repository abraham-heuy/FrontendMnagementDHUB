// Comprehensive dashboard service for student data

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export type DashboardStats = {
  currentStage: {
    id: string;
    stageName: string;
    status: string;
    progressPercent: number;
    started_at: string;
    activities: Array<{
      id: string;
      name: string;
      status: string;
      required: boolean;
    }>;
  } | null;
  stageHistory: Array<{
    id: string;
    stageName: string;
    status: string;
    progressPercent: number;
    started_at: string;
    completed_at: string | null;
  }>;
  progressLogs: Array<{
    id: string;
    old_stage: string;
    new_stage: string;
    progressPercent: number;
    milestone: string;
    notes: string;
    updated_at: string;
    updated_by: {
      fullName: string;
      role: string;
    };
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    created_at: string;
  }>;
  profile: {
    bio: string;
    skills: string[];
    startup_idea: string;
    institution: string;
    course: string;
  } | null;
};

export const dashboardService = {
  // Get comprehensive dashboard data
  getDashboardData: async (): Promise<DashboardStats> => {
    try {
      const [
        currentStage,
        stageHistory,
        progressLogs,
        notifications,
        profile,
      ] = await Promise.allSettled([
        fetch(`${apiURL}/stages/me/current`, { credentials: "include" }).then(res =>
          res.status === 404 ? null : res.ok ? res.json() : null
        ),
        fetch(`${apiURL}/stages/me`, { credentials: "include" }).then(res =>
          res.ok ? res.json() : []
        ),
        fetch(`${apiURL}/logs/student/${(await fetch(`${apiURL}/auth/me`, { credentials: "include" }).then(r => r.json())).id}`, {
          credentials: "include"
        }).then(res => res.ok ? res.json() : []),
        fetch(`${apiURL}/notifications`, { credentials: "include" }).then(res =>
          res.ok ? res.json() : []
        ),
        fetch(`${apiURL}/profile/me`, { credentials: "include" }).then(res =>
          res.status === 404 ? null : res.ok ? res.json() : null
        ),
      ]);

      return {
        currentStage: currentStage.status === "fulfilled" ? currentStage.value : null,
        stageHistory: stageHistory.status === "fulfilled" ? stageHistory.value : [],
        progressLogs: progressLogs.status === "fulfilled" ? progressLogs.value : [],
        notifications: notifications.status === "fulfilled" ? notifications.value : [],
        profile: profile.status === "fulfilled" ? profile.value : null,
      };
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      throw new Error("Failed to load dashboard data");
    }
  },

  // Get stage activities for current stage
  getStageActivities: async (stageId: string) => {
    const res = await fetch(`${apiURL}/studentActivities/stages/${stageId}/activities`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch stage activities");
    return res.json();
  },

  // Complete an activity
  completeActivity: async (activityId: string) => {
    const res = await fetch(`${apiURL}/studentActivities/activities/${activityId}/complete`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to complete activity");
    return res.json();
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string) => {
    const res = await fetch(`${apiURL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
  },
};
