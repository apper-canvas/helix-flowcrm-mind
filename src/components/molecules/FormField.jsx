import React from 'react';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, children }) => {
  return (
    <div>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1">
        {label}
      </Text>
      {/* Children is expected to be an Input, Select, or Textarea component */}
      {children}
    </div>
  );
};

export default FormField;