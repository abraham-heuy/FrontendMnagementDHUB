import {useState, useEffect } from 'react';


import { getDashboardStats } from '../../../lib/services/dashboard';
import type { DashboardData, DashboardStats } from '../../../lib/types/dashboardTypes';
import { FiRefreshCw } from 'react-icons/fi';
import RecentNotifications from './RecentNotifications';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import CurrentStage from './CurrentStage';
import StartupProject from './StartupProject';
import StatsGrid from './StatsGrid';
import DashboardHeader from './DashboardHeader';
import ErrorDisplay from './ErrorDisplay';
import LoadingSpinner from './LoadingSpinner';



const Main = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userData: null,
    currentStage: null,
    events: [],
    notifications: [],
    progressLogs: [],
    profile: null,
    activities: []
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrors({});

      const newErrors: {[key: string]: string} = {};
      const newData: DashboardData = {
        userData: null,
        currentStage: null,
        events: [],
        notifications: [],
        progressLogs: [],
        profile: null,
        activities: []
      };

      // Get current user
      try {
        const userResponse = await getDashboardStats.getCurrentUser();
        newData.userData = userResponse.data;
      } catch (error: any) {
        newErrors.user = 'Failed to load user data';
        console.error('Error fetching user:', error);
      }

      // Fetch data in parallel
      const dataPromises = [
        getDashboardStats.getCurrentStage()
          .then(response => { newData.currentStage = response.data; })
          .catch(error => {
            newErrors.stage = 'Failed to load stage information';
            console.error('Error fetching stage:', error);
          }),

        getDashboardStats.getEvents()
          .then(response => { newData.events = response.data.events || []; })
          .catch(error => {
            newErrors.events = 'Failed to load events';
            console.error('Error fetching events:', error);
          }),

        getDashboardStats.getNotifications()
          .then(response => { newData.notifications = response.data || []; })
          .catch(error => {
            newErrors.notifications = 'Failed to load notifications';
            console.error('Error fetching notifications:', error);
          }),

        getDashboardStats.getStudentProfile()
          .then(response => { newData.profile = response.data; })
          .catch(error => {
            newErrors.profile = 'Failed to load profile';
            console.error('Error fetching profile:', error);
          }) 
      ];

      await Promise.allSettled(dataPromises);

      // Fetch progress logs if user exists
      if (newData.userData?.id) {
        try {
          const logsResponse = await getDashboardStats.getProgressLogs(newData.userData.id);
          newData.progressLogs = logsResponse.data || [];
        } catch (error: any) {
          newErrors.progressLogs = 'Failed to load progress history';
          console.error('Error fetching progress logs:', error);
        }
      }

      // log final errors and data for debugging
      console.log('Dashboard fetch results:', { newData, newErrors });
      
      // Update state with fetched data and errors
      setDashboardData(newData);
      setErrors(newErrors);


    } catch (error: any) {
      console.error('Unexpected error fetching dashboard data:', error);
      setErrors({ general: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Calculate stats
  const stats: DashboardStats = {
    completedActivities: dashboardData.currentStage?.activities?.filter(a => a.status === 'COMPLETED').length || 0,
    totalActivities: dashboardData.currentStage?.activities?.length || 0,
    milestones: dashboardData.progressLogs.length || 0,
    progress: dashboardData.currentStage?.progressPercent || 0,
    pendingActivities: dashboardData.currentStage?.activities?.filter(a => a.status !== 'COMPLETED').length || 0,
    upcomingEvents: dashboardData.events.filter(event => {
      try {
        return new Date(event.date) >= new Date();
      } catch {
        return false;
      }
    }).length || 0,
    unreadNotifications: dashboardData.notifications.filter(n => !n.is_read).length || 0
  };

  const hasCriticalError = errors.user || errors.general;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <ErrorDisplay 
          errors={errors} 
          onRetry={handleRetry}
        />
      )}

      {/* Header Section */}
      <DashboardHeader 
        userData={dashboardData.userData}
        currentStage={dashboardData.currentStage}
        profile={dashboardData.profile}
      />

      {/* Stats Grid */}
      <StatsGrid 
        stats={stats}
        errors={errors}
      />

      {/* Startup Project Section */}
      <StartupProject profile={dashboardData.profile} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Progress & Activities */}
        <div className="xl:col-span-2 space-y-8">
          {/* Current Stage Progress */}
          <CurrentStage 
            currentStage={dashboardData.currentStage}
            stats={stats}
            errors={errors}
            onRetry={handleRetry}
          />

          {/* Recent Activities */}
          <RecentActivities 
            activities={dashboardData.currentStage?.activities}
            errors={errors}
            onRetry={handleRetry}
          />
        </div>

        {/* Right Column - Events & Notifications */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <UpcomingEvents 
            events={dashboardData.events}
            errors={errors}
            onRetry={handleRetry}
          />

          {/* Recent Notifications */}
          <RecentNotifications 
            notifications={dashboardData.notifications}
            errors={errors}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {/* Retry Button for general errors */}
      {errors.general && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-3"
          >
            <FiRefreshCw size={20} />
            <span>Reload Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Main;

