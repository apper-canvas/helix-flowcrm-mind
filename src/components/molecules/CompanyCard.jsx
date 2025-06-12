import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const CompanyCard = ({ company, onEdit, onDelete }) => {
  const formatRevenue = (revenue) => {
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    }
    return `$${(revenue / 1000).toFixed(0)}K`;
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'Small': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-green-100 text-green-800';
      case 'Large': return 'bg-purple-100 text-purple-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" size={24} className="text-primary-600" />
          </div>
          <div>
<h3 className="font-semibold text-surface-900">{company.Name || company.name}</h3>
            <p className="text-sm text-surface-600">{company.industry}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(company)}
            className="p-1 text-surface-400 hover:text-surface-600"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(company.id)}
            className="p-1 text-surface-400 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-600">Employees</span>
<span className="text-sm font-medium">{company.employees}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-600">Revenue</span>
<span className="text-sm font-medium">{formatRevenue(company.revenue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-600">Contact</span>
<span className="text-sm font-medium">{company.contact_person || company.contactPerson}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Badge className={getSizeColor(company.size)}>
            {company.size}
          </Badge>
          <Badge className={getStatusColor(company.status)}>
            {company.status}
          </Badge>
        </div>
        <div className="flex space-x-1">
          {company.email && (
            <button className="p-1 text-surface-400 hover:text-surface-600">
              <ApperIcon name="Mail" size={16} />
            </button>
          )}
          {company.phone && (
            <button className="p-1 text-surface-400 hover:text-surface-600">
              <ApperIcon name="Phone" size={16} />
            </button>
          )}
          {company.website && (
            <button className="p-1 text-surface-400 hover:text-surface-600">
              <ApperIcon name="ExternalLink" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;