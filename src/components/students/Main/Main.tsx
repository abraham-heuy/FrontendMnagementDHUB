import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types based on your backend entities
interface User {
  id: string;
  fullName: string;
  email: string;
  regNumber: string;
  role: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  category: string;
  details?: string;
}

interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

interface StudentStage {
  id: string;
  stage: any;
  status: string;
  progressPercent: number;
  started_at: string;
  activities: StudentActivity[];
}

interface StudentActivity {
  id: string;
  activity: any;
  status: string;
  score?: number;
  updated_at: string;
}

interface ProgressLog {
  id: string;
  old_stage: string;
  new_stage: string;
  progressPercent: number;
  milestone: string;
  notes: string;
  updated_at: string;
}

interface StudentProfile {
  id: string;
  user: User;
  // Add other profile fields as needed
}

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [currentStage, setCurrentStage] = useState<StudentStage | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user (you might have this from auth context)
        const userResponse = await axios.get('/api/users/me');
        setUserData(userResponse.data.user);

        // Fetch current stage
        const stageResponse = await axios.get('/api/student-stage/current');
        setCurrentStage(stageResponse.data);

        // Fetch upcoming events
        const eventsResponse = await axios.get('/api/events');
        setEvents(eventsResponse.data.events.slice(0, 5)); // Get only 5 upcoming events

        // Fetch notifications
        const notificationsResponse = await axios.get('/api/notifications');
        setNotifications(notificationsResponse.data.slice(0, 10)); // Get only 10 latest

        // Fetch progress logs for current user
        if (userResponse.data.user.id) {
          const logsResponse = await axios.get(`/api/progress-logs/student/${userResponse.data.user.id}`);
          setProgressLogs(logsResponse.data);
        }

        // Fetch student profile
        const profileResponse = await axios.get('/api/student-profile');
        setProfile(profileResponse.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function for relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from actual data
  const stats = {
    projects: currentStage?.activities?.filter(a => a.status === 'COMPLETED').length || 0,
    tasks: currentStage?.activities?.length || 0,
    completed: progressLogs.length || 0,
    progress: currentStage?.progressPercent || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {userData?.fullName || 'Student'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {currentStage ? 
            `You're currently in ${currentStage.stage?.name || 'Current Stage'} - ${currentStage.progressPercent}% complete` :
            'Get started with your learning journey'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Current Stage Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Current Stage</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {currentStage?.stage?.name || 'Not Started'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-sm font-medium mt-2">
            {currentStage?.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
          </p>
        </div>

        {/* Activities Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Activities</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.tasks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-blue-600 text-sm font-medium mt-2">
            {stats.projects} completed
          </p>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Notifications</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {notifications.filter(n => !n.is_read).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <p className="text-blue-600 text-sm font-medium mt-2">
            {notifications.length} total
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.progress}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-sm font-medium mt-2">
            {stats.completed} milestones
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Progress & Activity */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Progress Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Learning Progress</h2>
              <span className="text-blue-600 font-semibold">{stats.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Stage 1</span>
              <span>Stage 2</span>
              <span>Stage 3</span>
            </div>
          </div>

          {/* Recent Activity - Using Progress Logs */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Progress</h2>
            <div className="space-y-4">
              {progressLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium">
                      Progress: {log.old_stage} → {log.new_stage}
                    </p>
                    <p className="text-gray-600 text-sm">{log.milestone}</p>
                    {log.notes && (
                      <p className="text-gray-500 text-sm mt-1">{log.notes}</p>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm flex-shrink-0">
                    {getRelativeTime(log.updated_at)}
                  </span>
                </div>
              ))}
              {progressLogs.length === 0 && (
                <p className="text-gray-500 text-center py-4">No progress records yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Events & Notifications */}
        <div className="space-y-6 md:space-y-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.category === 'WORKSHOP' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'DEADLINE' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mr-4">{formatDate(event.date)}</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.timeFrom} - {event.timeTo}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                  notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${notification.is_read ? 'text-gray-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${notification.is_read ? 'text-gray-700' : 'text-gray-800'}`}>
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {notification.sender?.fullName || 'System'} • {getRelativeTime(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-500 text-center py-4">No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;