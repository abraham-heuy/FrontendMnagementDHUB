import React from "react";

interface RefreshButtonProps {
  refreshing: boolean;
  setRefreshing: (value: boolean) => void;
  onRefresh: () => Promise<void>;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  refreshing,
  setRefreshing,
  onRefresh,
}) => {
  const handleClick = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 600); // small UX delay
  };

  return (
    <button
      onClick={handleClick}
      disabled={refreshing}
      className={`flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md border transition
        ${
          refreshing
            ? "bg-sky-50 border-sky-300 text-sky-600 cursor-wait"
            : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
        }`}
      title="Refresh data"
    >
      {refreshing ? (
        <svg
          className="animate-spin h-4 w-4 text-sky-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        <span className="text-sky-600 font-semibold">⟳</span>
      )}
    </button>
  );
};

export default RefreshButton;
