import React from 'react';
import { FiUser, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import type { UserData, CurrentStage, Profile } from '../../../lib/types/dashboardTypes';

interface DashboardHeaderProps {
  userData: UserData | null;
  currentStage: CurrentStage | null;
  profile: Profile | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData, currentStage, profile }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-secondary via-green-50 to-secondary rounded-2xl p-8 mb-8 text-green-200 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-dark/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <FiUser className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-1">
              {getGreeting()}, {userData?.fullName || 'Student'}!
            </h1>
            <p className="text-green-100 text-lg">
              {profile?.institution ? `${profile.institution} - ${profile.course}` : 'Welcome to your dashboard'}
            </p>
          </div>
        </div>

        {/* Current Stage Info */}
        <div className="lg:ml-auto">
          {currentStage ? (
            <div className="bg-green-200/10 backdrop-blur-sm rounded-xl p-4 border border-green-200/20">
              <div className="flex items-center gap-3 mb-2">
                <FiTrendingUp className="text-xl" />
                <span className="font-semibold">Current Stage</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{currentStage.stageName}</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full h-2">
                  <div
                    className="bg-green-200 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentStage.progressPercent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{currentStage.progressPercent}%</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FiMapPin className="text-xl" />
                <span className="font-semibold">Getting Started</span>
              </div>
              <p className="text-blue-100">Complete your profile to begin your journey</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;