import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ContactCard from '@/components/molecules/ContactCard';

const ContactList = ({
  contacts,
  searchTerm,
  onSearchChange,
  onAddContact,
  onLogInteraction,
  onDeleteContact,
  loading,
  error
}) => {
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
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Failed to load contacts</Text>
          <Text as="p" className="text-surface-500 mb-4">{error}</Text>
          <Button
            onClick={() => window.location.reload()} // Reloading the page for error recovery
            className="bg-primary-600 text-white hover:bg-primary-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <Text as="h1" className="text-2xl font-semibold text-surface-900">Contacts</Text>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <ApperIcon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-80"
            />
          </div>
          <Button
            onClick={onAddContact}
            className="bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <Text as="span">Add Contact</Text>
          </Button>
        </div>
      </div>

      {contacts.length === 0 ? (
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
          <Text as="h3" className="mt-4 text-lg font-medium text-surface-900">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </Text>
          <Text as="p" className="mt-2 text-surface-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
          </Text>
          {!searchTerm && (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddContact}
              className="mt-4 bg-primary-600 text-white hover:bg-primary-700"
            >
              Add Contact
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              index={index}
              onLogInteractionClick={onLogInteraction}
              onDeleteClick={onDeleteContact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;