import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';

const CreateContactForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<FormField label="Name" required>
        <Input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </FormField>
<FormField label="Email" required>
        <Input
          type="email"
          name="email"
          required
value={formData.email}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Phone">
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Company">
        <Input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </FormField>
      <FormField label="Notes">
        <Textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
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
          Create Contact
        </Button>
      </div>
    </form>
  );
};

export default CreateContactForm;