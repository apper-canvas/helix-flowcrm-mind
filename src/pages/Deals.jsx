import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import dealService from '../services/api/dealService';
import contactService from '../services/api/contactService';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    contactId: '',
    probability: 50,
    expectedClose: '',
    notes: ''
  });

  const stages = [
    { id: 'Lead', name: 'Lead', color: 'bg-surface-100' },
    { id: 'Qualified', name: 'Qualified', color: 'bg-blue-100' },
    { id: 'Proposal', name: 'Proposal', color: 'bg-yellow-100' },
    { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-100' },
    { id: 'Closed Won', name: 'Closed Won', color: 'bg-accent-100' },
    { id: 'Closed Lost', name: 'Closed Lost', color: 'bg-red-100' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const newDeal = await dealService.create({
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      setDeals([...deals, newDeal]);
      setFormData({
        title: '',
        value: '',
        stage: 'Lead',
        contactId: '',
        probability: 50,
        expectedClose: '',
        notes: ''
      });
      setShowCreateModal(false);
      toast.success('Deal created successfully');
    } catch (err) {
      toast.error('Failed to create deal');
    }
  };

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    
    try {
      const updatedDeal = await dealService.update(dealId, { stage: newStage });
      setDeals(deals.map(deal => deal.id === dealId ? updatedDeal : deal));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      await dealService.delete(dealId);
      setDeals(deals.filter(d => d.id !== dealId));
      toast.success('Deal deleted successfully');
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const getStageDeals = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageValue = (stageId) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex space-x-6 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-lg shadow-sm border border-surface-200 h-96">
                <div className="p-4 border-b border-surface-200">
                  <div className="h-6 bg-surface-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-20 bg-surface-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load deals</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-900">Deal Pipeline</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Deal</span>
        </button>
      </div>

      {deals.length === 0 && !loading ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="TrendingUp" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No deals yet</h3>
          <p className="mt-2 text-surface-500">Start building your sales pipeline</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Deal
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {stages.map((stage, stageIndex) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="bg-white rounded-lg shadow-sm border border-surface-200">
                <div className={`p-4 border-b border-surface-200 ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-surface-900">{stage.name}</h3>
                    <div className="text-sm text-surface-600">
                      {getStageDeals(stage.id).length}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-surface-700 mt-1">
                    ${getStageValue(stage.id).toLocaleString()}
                  </div>
                </div>
                
                <div className="p-4 space-y-3 min-h-[300px] max-h-96 overflow-y-auto">
                  {getStageDeals(stage.id).map((deal, dealIndex) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dealIndex * 0.1 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-surface-50 border border-surface-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-surface-900 break-words">{deal.title}</h4>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="text-surface-400 hover:text-error transition-colors"
                        >
                          <ApperIcon name="X" size={14} />
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">Value:</span>
                          <span className="font-medium text-surface-900">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">Contact:</span>
                          <span className="text-surface-900 break-words">
                            {getContactName(deal.contactId)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-surface-600">Probability:</span>
                          <span className="text-surface-900">{deal.probability}%</span>
                        </div>
                        
                        {deal.expectedClose && (
                          <div className="flex items-center justify-between">
                            <span className="text-surface-600">Expected:</span>
                            <span className="text-surface-900">
                              {new Date(deal.expectedClose).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        {deal.notes && (
                          <div className="mt-3 pt-3 border-t border-surface-200">
                            <p className="text-xs text-surface-600 break-words">{deal.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Deal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-surface-900">Add New Deal</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateDeal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Deal Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Value ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Contact</label>
                    <select
                      required
                      value={formData.contactId}
                      onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select a contact</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Probability ({formData.probability}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Expected Close Date</label>
                    <input
                      type="date"
                      value={formData.expectedClose}
                      onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-surface-600 hover:text-surface-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Create Deal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;