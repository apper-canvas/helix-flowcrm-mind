import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import FormField from '@/components/molecules/FormField';

const CreateCompanyForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    industry: initialData?.industry || '',
    employees: initialData?.employees || '',
    revenue: initialData?.revenue || '',
    size: initialData?.size || 'Small',
    status: initialData?.status || 'Prospect',
    contactPerson: initialData?.contactPerson || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    website: initialData?.website || '',
    description: initialData?.description || ''
  });

const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.employees && (isNaN(formData.employees) || formData.employees < 1)) {
      newErrors.employees = 'Please enter a valid number of employees';
    }

    if (formData.revenue && (isNaN(formData.revenue) || formData.revenue < 0)) {
      newErrors.revenue = 'Please enter a valid revenue amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : 0,
        revenue: formData.revenue ? parseFloat(formData.revenue) : 0
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          error={errors.name}
          required
        >
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            hasError={!!errors.name}
          />
        </FormField>

        <FormField
          label="Industry"
          error={errors.industry}
          required
        >
          <Input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g., Technology, Healthcare"
            hasError={!!errors.industry}
          />
        </FormField>

        <FormField
          label="Number of Employees"
          error={errors.employees}
        >
          <Input
            name="employees"
            type="number"
            value={formData.employees}
            onChange={handleChange}
            placeholder="Enter employee count"
            hasError={!!errors.employees}
          />
        </FormField>

        <FormField
          label="Annual Revenue ($)"
          error={errors.revenue}
        >
          <Input
            name="revenue"
            type="number"
            value={formData.revenue}
            onChange={handleChange}
            placeholder="Enter annual revenue"
            hasError={!!errors.revenue}
          />
        </FormField>

<FormField label="Company Size">
          <Select
            name="size"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="">Select Company Size...</option>
            <option value="Small">Small (1-50 employees)</option>
            <option value="Medium">Medium (51-200 employees)</option>
            <option value="Large">Large (200+ employees)</option>
          </Select>
        </FormField>

<FormField label="Status">
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status...</option>
            <option value="Prospect">Prospect</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </FormField>

        <FormField
          label="Contact Person"
          error={errors.contactPerson}
          required
        >
          <Input
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Primary contact name"
            hasError={!!errors.contactPerson}
          />
        </FormField>

        <FormField
          label="Email"
          error={errors.email}
        >
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@company.com"
            hasError={!!errors.email}
          />
        </FormField>

        <FormField label="Phone">
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </FormField>

        <FormField label="Website">
          <Input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://company.com"
          />
        </FormField>
      </div>

      <FormField label="Address">
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Company address"
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the company..."
          rows={3}
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Company' : 'Create Company')}
        </Button>
      </div>
    </form>
  );
};

export default CreateCompanyForm;