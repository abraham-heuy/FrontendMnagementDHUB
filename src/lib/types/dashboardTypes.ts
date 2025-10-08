// Dashboard types for comprehensive student data

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Activity {
  id: string;
  name: string;
  status: string;
  required: boolean;
}

export interface CurrentStage {
  id: string;
  stageName: string;
  status: string;
  progressPercent: number;
  started_at: string;
  activities?: Activity[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ProgressLog {
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
}

export interface Profile {
  id: string;
  bio: string;
  skills: string[];
  startup_idea: string;
  institution: string;
  course: string;
  phone: string;
  yearOfStudy: string;
  linkedIn: string;
  website: string;
}

export interface DashboardData {
  userData: UserData | null;
  currentStage: CurrentStage | null;
  events: Event[];
  notifications: Notification[];
  progressLogs: ProgressLog[];
  profile: Profile | null;
  activities: Activity[];
}

export interface DashboardStats {
  completedActivities: number;
  totalActivities: number;
  milestones: number;
  progress: number;
  pendingActivities: number;
  upcomingEvents: number;
  unreadNotifications: number;
}