import React from 'react';

const Card = ({ children, title, subtitle, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
