import React from 'react';
import { FiAlertCircle, FiRefreshCw, FiX } from 'react-icons/fi';

interface ErrorDisplayProps {
  errors: { [key: string]: string };
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, onRetry }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || Object.keys(errors).length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <FiAlertCircle className="text-red-600 text-xl mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-800 font-medium mb-2">Dashboard Loading Issues</h3>
          <div className="space-y-1 mb-3">
            {Object.entries(errors).map(([key, message]) => (
              <p key={key} className="text-red-700 text-sm">
                • {message}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw size={16} />
              Retry
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;