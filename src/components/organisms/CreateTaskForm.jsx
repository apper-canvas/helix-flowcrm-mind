import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const CreateTaskForm = ({ onSubmit, onCancel, initialData, contacts, deals }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    contactId: '',
    dealId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const contactOptions = [{ value: '', label: 'No contact' }].concat(
    contacts.map(c => ({ value: c.id, label: c.name }))
  );
  const dealOptions = [{ value: '', label: 'No deal' }].concat(
    deals.map(d => ({ value: d.id, label: d.title }))
  );
  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<FormField label="Task Title" required>
        <Input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </FormField>

<FormField label="Due Date" required>
        <Input
          type="date"
          name="dueDate"
          required
value={formData.dueDate}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Priority">
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
      </FormField>

      <FormField label="Related Contact">
        <Select
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          options={contactOptions}
        />
      </FormField>

      <FormField label="Related Deal">
        <Select
          name="dealId"
          value={formData.dealId}
          onChange={handleChange}
          options={dealOptions}
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
          Create Task
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;