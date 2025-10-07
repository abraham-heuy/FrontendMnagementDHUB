import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Use environment variable

// Define interfaces that mirror backend responses
export interface UserStats {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  newRegistrations: number;
}

export interface StageStats {
  totalStudentStages: number;
  stageDistribution: { stage: string; count: number }[];
  completionRates: { stage: string; averageProgress: number }[];
  avgActivityCompletion: { status: string; count: number }[];
}

export interface EventStats {
  totalEvents: number;
  totalApplications: number;
  eventsByCategory: { category: string; count: number }[];
  applicationStatus: { isPassed: boolean; count: number }[];
}

export interface MentorshipStats {
  totalMentors: number;
  totalAllocations: number;
  mentorStudentRatio: string;
}

export interface NotificationStats {
  totalNotifications: number;
  recentNotifications: { count: number; date: string }[];
}

export interface DashboardSummary {
  users: UserStats;
  stages: StageStats;
  events: EventStats;
  mentors: MentorshipStats;
  notifications: NotificationStats;
}
const axiosInstance = axios.create({
    baseURL: `${API_URL}/analytics`,
    withCredentials: true, 
  });
// ✅ Fetch dashboard summary data (users, stages, events, mentors, notifications)
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosInstance.get("/dashboard");
  return response.data.data; // because backend sends { success: true, data }
};

// ✅ Fetch user-related statistics
export const getUserStats = async (): Promise<UserStats> => {
  const response = await axiosInstance.get("/users");
  return response.data.data;
};

// ✅ Fetch stage progress statistics
export const getStageStats = async (): Promise<StageStats> => {
  const response = await axios.get("/stages");
  return response.data.data;
};

// ✅ Download analytics report (optional if backend has this endpoint)
export const downloadAnalyticsReport = async (format: "pdf" | "csv" = "pdf") => {
  const response = await axios.get(`${API_URL}/analytics/report?format=${format}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `analytics-report.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
