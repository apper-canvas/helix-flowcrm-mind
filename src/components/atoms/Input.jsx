import React from 'react';

const Input = ({ type = 'text', className = '', hasError, ...props }) => {
  // Filter out custom props that shouldn't be passed to DOM
  const { 
    // Add any other custom props here that shouldn't go to DOM
    ...domProps 
  } = props;

  const errorClasses = hasError 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-surface-300 focus:ring-primary-500';

  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${errorClasses} ${className}`}
      {...domProps}
    />
  );
};

export default Input;