import { useState } from "react";
import InputField from "../InputField";

export type Stage = { 
  name: string; 
  subStages: string[];
  completed?: boolean;
  approved?: boolean;
};

const StartupStageTracker = (
  {
    title,
    stageIndex,
    subStageIndex,
    stages,
    onTitleChange,
  }: {
    title: string;
    stageIndex: number;
    subStageIndex: number;
    stages: Stage[];
    onTitleChange: (v: string) => void;
  }
) => {
  const [currentPage, setCurrentPage] = useState(stageIndex);
  const currentStage = stages[currentPage];
  const totalSteps = stages.reduce((sum, s) => sum + s.subStages.length, 0);
  const completedSteps = stages.slice(0, stageIndex).reduce((sum, s) => sum + s.subStages.length, 0) + subStageIndex;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Determine status of each substage
  const getSubStageStatus = (stageIdx: number, subStageIdx: number) => {
    if (stageIdx < stageIndex) return "completed";
    if (stageIdx === stageIndex && subStageIdx < subStageIndex) return "completed";
    if (stageIdx === stageIndex && subStageIdx === subStageIndex) return "current";
    return "upcoming";
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Startup Progress</h3>
        <p className="text-sm text-gray-500 mt-1">Track and manage your startup development stages</p>
      </div>

      {/* Title + Meta */}
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Startup Title"
          value={title}
          placeholder="e.g., AgroSense Analytics"
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Current Stage</p>
            <p className="text-base font-semibold text-gray-800 mt-1">{stages[stageIndex].name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Current Sub-stage</p>
            <p className="text-base font-semibold text-gray-800 mt-1">{stages[stageIndex].subStages[subStageIndex]}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Overall Progress</span>
          <span className="font-semibold">{progressPercentage}% Complete</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>

      {/* Stage Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                currentPage === idx
                  ? "bg-green-100 text-green-800 border-green-300 font-semibold"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              } ${
                idx < stageIndex 
                  ? "bg-blue-100 text-blue-800 border-blue-300" 
                  : idx === stageIndex 
                  ? "bg-green-100 text-green-800 border-green-300" 
                  : ""
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(stages.length - 1, prev + 1))}
          disabled={currentPage === stages.length - 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Current Stage Details */}
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">{currentStage.name}</h4>
          <span className={`px-2 py-1 text-xs rounded-full ${
            currentPage < stageIndex 
              ? "bg-blue-100 text-blue-800" 
              : currentPage === stageIndex 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {currentPage < stageIndex ? "Completed" : currentPage === stageIndex ? "In Progress" : "Upcoming"}
          </span>
        </div>
        
        <div className="space-y-3">
          {currentStage.subStages.map((subStage, idx) => {
            const status = getSubStageStatus(currentPage, idx);
            return (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border ${
                  status === "completed" 
                    ? "bg-blue-50 border-blue-200" 
                    : status === "current" 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    status === "completed" 
                      ? "bg-blue-500 text-white" 
                      : status === "current" 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {status === "completed" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className={`font-medium ${
                    status === "completed" 
                      ? "text-blue-800" 
                      : status === "current" 
                      ? "text-green-800" 
                      : "text-gray-600"
                  }`}>
                    {subStage}
                  </span>
                </div>
                
                {status === "current" && (
                  <div className="mt-3 pt-3 border-t border-dashed border-green-200">
                    <p className="text-sm text-green-700">
                      This sub-stage is currently in progress. Work on completing the requirements.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Status Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Stage Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Completed: {stageIndex} of {stages.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Current: {stages[stageIndex].name}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span>Remaining: {stages.length - stageIndex - 1}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StartupStageTracker;