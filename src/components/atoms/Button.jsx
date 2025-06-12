import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  type = 'button', 
  onClick, 
  // Filter out framer-motion props to prevent React warnings
  whileHover,
  whileTap,
  whileFocus,
  whileInView,
  animate,
  initial,
  exit,
  transition,
  variants,
  // Filter out other common non-HTML props
  as,
  component,
  ...props 
}) => {
  // All remaining props are safe to spread to the DOM button element
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