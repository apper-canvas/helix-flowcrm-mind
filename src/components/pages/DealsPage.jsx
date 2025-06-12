import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import DealPipeline from '@/components/organisms/DealPipeline';
import Modal from '@/components/molecules/Modal';
import CreateDealForm from '@/components/organisms/CreateDealForm';
import dealService from '@/services/api/dealService';
import contactService from '@/services/api/contactService';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stages = [
    { id: 'Lead', name: 'Lead', color: 'bg-surface-100' },
    { id: 'Qualified', name: 'Qualified', color: 'bg-blue-100' },
    { id: 'Proposal', name: 'Proposal', color: 'bg-yellow-100' },
    { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-100' },
    { id: 'Closed Won', name: 'Closed Won', color: 'bg-accent-100' },
    { id: 'Closed Lost', name: 'Closed Lost', color: 'bg-red-100' }
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
}, [loadData]);

  const handleCreateDeal = async (formData) => {
    try {
      const newDeal = await dealService.create({
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      setDeals([...deals, newDeal]);
      setShowCreateModal(false);
      toast.success('Deal created successfully');
    } catch (err) {
      toast.error('Failed to create deal');
    }
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');

    try {
      const updatedDeal = await dealService.update(dealId, { stage: newStage });
      setDeals(deals.map(deal => (deal.Id || deal.id) === dealId ? updatedDeal : deal));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      await dealService.delete(dealId);
      setDeals(deals.filter(d => (d.Id || d.id) !== dealId));
      toast.success('Deal deleted successfully');
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };
  return (
    <>
      <DealPipeline
        deals={deals}
        contacts={contacts}
        stages={stages}
        onAddDeal={() => setShowCreateModal(true)}
        onDealDrop={handleDrop}
        onDeleteDeal={handleDeleteDeal}
        loading={loading}
        error={error}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Deal"
      >
        <CreateDealForm
          contacts={contacts}
          stages={stages}
          onSubmit={handleCreateDeal}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </>
  );
};

export default DealsPage;