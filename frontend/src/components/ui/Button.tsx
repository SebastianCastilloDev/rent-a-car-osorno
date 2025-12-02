import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'px-4 py-2.5 rounded-md text-sm font-medium transition-colors';
  const variants = {
    primary: disabled
      ? 'bg-blue-400 text-white cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    danger: disabled
      ? 'bg-red-400 text-white cursor-not-allowed'
      : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

