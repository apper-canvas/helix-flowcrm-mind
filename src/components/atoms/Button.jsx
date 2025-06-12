import React from 'react';

const Button = ({ children, className = '', type = 'button', onClick, ...props }) => {
  // Filter out non-HTML props if necessary, though for simple buttons it's less critical.
  // We'll pass all other props directly to maintain flexibility for native button attributes.
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;