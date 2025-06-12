import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const LogInteractionForm = ({ onSubmit, onCancel, selectedContact, initialData }) => {
  const [interactionData, setInteractionData] = useState(initialData || {
    type: 'email',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInteractionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(interactionData);
  };

  const typeOptions = [
    { value: 'email', label: 'Email' },
    { value: 'call', label: 'Phone Call' },
    { value: 'meeting', label: 'Meeting' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 p-3 bg-surface-50 rounded-lg">
        <Text as="p" className="text-sm text-surface-600">
          Contact: <Text as="span" className="font-medium">{selectedContact.name}</Text>
        </Text>
      </div>

      <FormField label="Type">
        <Select
          name="type"
          value={interactionData.type}
          onChange={handleChange}
          options={typeOptions}
        />
      </FormField>
      <FormField label="Notes">
        <Textarea
          name="notes"
          rows={4}
          required
          value={interactionData.notes}
          onChange={handleChange}
          placeholder="What was discussed..."
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="text-surface-600 hover:text-surface-800 bg-transparent hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary-600 text-white hover:bg-primary-700"
        >
          Log Interaction
        </Button>
      </div>
    </form>
  );
};

export default LogInteractionForm;