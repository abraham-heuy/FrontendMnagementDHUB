import React from 'react';
import { FiZap, FiEdit3, FiExternalLink } from 'react-icons/fi';
import type { Profile } from '../../../lib/types/dashboardTypes';
import { FaLightbulb } from 'react-icons/fa6';

interface StartupProjectProps {
  profile: Profile | null;
}

const StartupProject: React.FC<StartupProjectProps> = ({ profile }) => {
  if (!profile?.startup_idea) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FiZap className="text-yellow-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Startup Project</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiZap className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Startup Idea Yet</h4>
          <p className="text-gray-500 mb-4">Share your startup idea to get personalized guidance.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <FiEdit3 size={16} />
            Add Your Idea
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-sm border border-yellow-200 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FaLightbulb className="text-yellow-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">Your Startup Project</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Startup Idea</h4>
          <p className="text-gray-700 leading-relaxed">{profile.startup_idea}</p>
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-yellow-200">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm">
            <FiEdit3 size={16} />
            Edit Project
          </button>
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-700 hover:text-yellow-800 transition-colors flex items-center gap-2 text-sm"
            >
              <FiExternalLink size={16} />
              View Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupProject;