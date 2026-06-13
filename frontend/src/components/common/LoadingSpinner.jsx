import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'teal', fullScreen = false }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };
  const colors = { teal: 'border-teal-500', gray: 'border-gray-500', white: 'border-white' };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
