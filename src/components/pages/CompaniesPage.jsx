import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Modal from '@/components/molecules/Modal';
import CompanyCard from '@/components/molecules/CompanyCard';
import CreateCompanyForm from '@/components/organisms/CreateCompanyForm';
import companyService from '@/services/api/companyService';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (companyData) => {
    try {
      const newCompany = await companyService.create(companyData);
      setCompanies(prev => [newCompany, ...prev]);
      setIsCreateModalOpen(false);
      toast.success('Company created successfully');
    } catch (error) {
      toast.error('Failed to create company');
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = async (companyData) => {
    try {
      const updatedCompany = await companyService.update(editingCompany.id, companyData);
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? updatedCompany : c));
      setIsEditModalOpen(false);
      setEditingCompany(null);
      toast.success('Company updated successfully');
    } catch (error) {
      toast.error('Failed to update company');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.delete(companyId);
        setCompanies(prev => prev.filter(c => c.id !== companyId));
        toast.success('Company deleted successfully');
      } catch (error) {
        toast.error('Failed to delete company');
      }
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    const matchesSize = !sizeFilter || company.size === sizeFilter;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const industries = [...new Set(companies.map(c => c.industry))];
  const sizes = [...new Set(companies.map(c => c.size))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Companies</h1>
            <p className="text-surface-600 mt-1">Manage your business relationships</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Company</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </Select>
            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-surface-500">Loading companies...</div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ApperIcon name="Building2" size={48} className="text-surface-300 mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {searchTerm || industryFilter || sizeFilter ? 'No companies found' : 'No companies yet'}
            </h3>
            <p className="text-surface-500 mb-4">
              {searchTerm || industryFilter || sizeFilter 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first company'
              }
            </p>
            {!searchTerm && !industryFilter && !sizeFilter && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Add Company
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Company"
      >
        <CreateCompanyForm
          onSubmit={handleCreateCompany}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCompany(null);
        }}
        title="Edit Company"
      >
        <CreateCompanyForm
          initialData={editingCompany}
          onSubmit={handleUpdateCompany}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingCompany(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CompaniesPage;