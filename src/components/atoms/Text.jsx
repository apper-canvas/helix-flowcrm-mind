import React from 'react';

const Text = ({ as: Component = 'p', className = '', children, ...props }) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default Text;