import React from 'react';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = '',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none transition-colors resize-vertical ${className}`}
      />
    </div>
  );
};

export default TextArea;
