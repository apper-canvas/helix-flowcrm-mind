import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const CreateDealForm = ({ onSubmit, onCancel, initialData, contacts, stages }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    value: '',
    stage: 'Lead',
    contactId: '',
    probability: 50,
    expectedClose: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProbabilityChange = (e) => {
    setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const stageOptions = stages.map(s => ({ value: s.id, label: s.name }));
  const contactOptions = [{ value: '', label: 'Select a contact' }].concat(
    contacts.map(c => ({ value: c.id, label: c.name }))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<FormField label="Deal Title" required>
        <Input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
        />
      </FormField>

<FormField label="Value ($)" required>
        <Input
          type="number"
          name="value"
          required
          min="0"
          step="0.01"
value={formData.value}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Stage">
        <Select
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          options={stageOptions}
        />
      </FormField>

<FormField label="Contact" required>
        <Select
          name="contactId"
          required
          value={formData.contactId}
onChange={handleChange}
          options={contactOptions}
        />
      </FormField>

      <div>
        <Text as="label" htmlFor="probability" className="block text-sm font-medium text-surface-700 mb-1">
          Probability ({formData.probability}%)
        </Text>
        <Input
          type="range"
          id="probability"
          name="probability"
          min="0"
          max="100"
          step="10"
          value={formData.probability}
          onChange={handleProbabilityChange}
          className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
        />
      </div>

      <FormField label="Expected Close Date">
        <Input
          type="date"
          name="expectedClose"
          value={formData.expectedClose}
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
          Create Deal
        </Button>
      </div>
    </form>
  );
};

export default CreateDealForm;