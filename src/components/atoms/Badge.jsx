import React from 'react';

const Badge = ({ children, className = '' }) => {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default Badge;