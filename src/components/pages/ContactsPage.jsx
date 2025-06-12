import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import ContactList from '@/components/organisms/ContactList';
import Modal from '@/components/molecules/Modal';
import CreateContactForm from '@/components/organisms/CreateContactForm';
import LogInteractionForm from '@/components/organisms/LogInteractionForm';
import contactService from '@/services/api/contactService';
import interactionService from '@/services/api/interactionService';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const loadContacts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const handleCreateContact = async (formData) => {
    try {
      const newContact = await contactService.create({
        ...formData,
        createdAt: new Date().toISOString(),
        lastInteraction: null
      });
      setContacts([...contacts, newContact]);
      setShowCreateModal(false);
      toast.success('Contact created successfully');
    } catch (err) {
      toast.error('Failed to create contact');
    }
  };

  const handleLogInteraction = async (interactionData) => {
    try {
      const interaction = await interactionService.create({
        ...interactionData,
        contactId: selectedContact.id,
        date: new Date().toISOString()
      });

      const updatedContact = await contactService.update(selectedContact.id, {
        lastInteraction: interaction.date
      });

      setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c));
      setShowInteractionModal(false);
      setSelectedContact(null);
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

  const openLogInteractionModal = (contact) => {
    setSelectedContact(contact);
    setShowInteractionModal(true);
  };

  return (
    <>
      <ContactList
        contacts={filteredContacts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddContact={() => setShowCreateModal(true)}
        onLogInteraction={openLogInteractionModal}
        onDeleteContact={handleDeleteContact}
        loading={loading}
        error={error}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Contact"
      >
        <CreateContactForm
          onSubmit={handleCreateContact}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showInteractionModal && selectedContact !== null}
        onClose={() => {
          setShowInteractionModal(false);
          setSelectedContact(null);
        }}
        title="Log Interaction"
      >
        {selectedContact && (
          <LogInteractionForm
            selectedContact={selectedContact}
            onSubmit={handleLogInteraction}
            onCancel={() => {
              setShowInteractionModal(false);
              setSelectedContact(null);
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default ContactsPage;