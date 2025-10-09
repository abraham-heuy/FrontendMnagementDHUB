import React from 'react';
import {
  FiTrendingUp,
  FiCheckCircle,
  FiActivity,
  FiBell,
  FiCalendar,
  FiTarget,
  FiAlertCircle
} from 'react-icons/fi';
import type { DashboardStats } from '../../../lib/types/dashboardTypes';

interface StatsGridProps {
  stats: DashboardStats;
  errors: { [key: string]: string };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, errors }) => {
  const statCards = [
    {
      title: 'Progress',
      value: `${stats.progress}%`,
      subtitle: 'Overall completion',
      icon: FiTrendingUp,
      color: 'blue',
      error: errors.stage,
    },
    {
      title: 'Activities',
      value: `${stats.completedActivities}/${stats.totalActivities}`,
      subtitle: 'Completed',
      icon: FiCheckCircle,
      color: 'green',
      error: errors.stage,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingActivities,
      subtitle: 'To complete',
      icon: FiActivity,
      color: 'orange',
      error: errors.stage,
    },
    {
      title: 'Milestones',
      value: stats.milestones,
      subtitle: 'Achieved',
      icon: FiTarget,
      color: 'purple',
      error: errors.progressLogs,
    },
    {
      title: 'Events',
      value: stats.upcomingEvents,
      subtitle: 'Upcoming',
      icon: FiCalendar,
      color: 'indigo',
      error: errors.events,
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      subtitle: 'Unread',
      icon: FiBell,
      color: 'red',
      error: errors.notifications,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      red: 'bg-red-100 text-red-600 border-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3   gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        const colorClasses = getColorClasses(stat.color);

        return (
          <div
            key={index}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${stat.error ? 'border-red-200 bg-red-50' : ''
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClasses}`}>
                <IconComponent className="text-lg" />
              </div>
              {stat.error && (
                <FiAlertCircle className="text-red-500 text-lg" />
              )}
            </div>

            <div className="space-y-1 flex  gap-2 flex-wrap">
              <p className="text-xs font-medium text-gray-600">{stat.title}</p>
              <p className={`text-sm font-bold ${stat.error ? 'text-red-600' : 'text-gray-900'}`}>
                {stat.error ? '—' : stat.value}
              </p>
              <p className={`text-xs ${stat.error ? 'text-red-500' : 'text-gray-500'}`}>
                {stat.error ? 'Error loading' : stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;