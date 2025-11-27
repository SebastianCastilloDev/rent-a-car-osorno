import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 border rounded-md text-sm transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
};

