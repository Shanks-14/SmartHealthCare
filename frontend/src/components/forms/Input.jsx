import React from 'react';

const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false, icon = null, className = '' }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none transition-colors ${icon ? 'pl-10' : ''} ${className}`}
        />
      </div>
    </div>
  );
};

export default Input;
