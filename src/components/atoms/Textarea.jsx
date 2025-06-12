import React from 'react';

const Textarea = ({ className = '', rows = 3, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;