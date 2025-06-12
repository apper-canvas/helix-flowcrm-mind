import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import contactService from '../services/api/contactService';
import interactionService from '../services/api/interactionService';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  const [interactionData, setInteractionData] = useState({
    type: 'email',
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getAll();
      setContacts(result);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const newContact = await contactService.create({
        ...formData,
        createdAt: new Date().toISOString(),
        lastInteraction: null
      });
      setContacts([...contacts, newContact]);
      setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
      setShowCreateModal(false);
      toast.success('Contact created successfully');
    } catch (err) {
      toast.error('Failed to create contact');
    }
  };

  const handleLogInteraction = async (e) => {
    e.preventDefault();
    try {
      const interaction = await interactionService.create({
        ...interactionData,
        contactId: selectedContact.id,
        date: new Date().toISOString()
      });
      
      // Update contact's last interaction
      const updatedContact = await contactService.update(selectedContact.id, {
        lastInteraction: interaction.date
      });
      
      setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c));
      setInteractionData({ type: 'email', notes: '' });
      setShowInteractionModal(false);
      toast.success('Interaction logged successfully');
    } catch (err) {
      toast.error('Failed to log interaction');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactService.delete(contactId);
      setContacts(contacts.filter(c => c.id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-primary-500', 'bg-accent-500', 'bg-secondary-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-24"></div>
                    <div className="h-3 bg-surface-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                </div>
              </div>
            </motion.div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load contacts</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <button
            onClick={loadContacts}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-surface-900">Contacts</h1>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-80 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {filteredContacts.length === 0 && !loading ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="mt-2 text-surface-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Contact
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(contact.name)}`}>
                    {getInitials(contact.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-surface-900 break-words">{contact.name}</h3>
                    <p className="text-sm text-surface-500 break-words">{contact.company}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowInteractionModal(true);
                    }}
                    className="p-1 text-surface-400 hover:text-primary-600 transition-colors"
                  >
                    <ApperIcon name="MessageSquare" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-1 text-surface-400 hover:text-error transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={14} className="text-surface-400" />
                  <span className="text-surface-600 break-words">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={14} className="text-surface-400" />
                  <span className="text-surface-600">{contact.phone}</span>
                </div>
                {contact.notes && (
                  <div className="flex items-start space-x-2 mt-3">
                    <ApperIcon name="FileText" size={14} className="text-surface-400 mt-0.5" />
                    <p className="text-surface-600 text-xs break-words">{contact.notes}</p>
                  </div>
                )}
              </div>
              
              {contact.lastInteraction && (
                <div className="mt-4 pt-4 border-t border-surface-100">
                  <p className="text-xs text-surface-400">
                    Last interaction: {new Date(contact.lastInteraction).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Contact Modal */}
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
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-surface-900">Add New Contact</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                      Create Contact
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Log Interaction Modal */}
      <AnimatePresence>
        {showInteractionModal && selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowInteractionModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-surface-900">Log Interaction</h2>
                  <button
                    onClick={() => setShowInteractionModal(false)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <div className="mb-4 p-3 bg-surface-50 rounded-lg">
                  <p className="text-sm text-surface-600">
                    Contact: <span className="font-medium">{selectedContact.name}</span>
                  </p>
                </div>
                
                <form onSubmit={handleLogInteraction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
                    <select
                      value={interactionData.type}
                      onChange={(e) => setInteractionData({ ...interactionData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="email">Email</option>
                      <option value="call">Phone Call</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                    <textarea
                      rows={4}
                      required
                      value={interactionData.notes}
                      onChange={(e) => setInteractionData({ ...interactionData, notes: e.target.value })}
                      placeholder="What was discussed..."
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInteractionModal(false)}
                      className="px-4 py-2 text-surface-600 hover:text-surface-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Log Interaction
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

export default Contacts;