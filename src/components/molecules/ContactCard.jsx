import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { getInitials, getAvatarColor } from '@/utils/avatarHelpers';

const ContactCard = ({ contact, index, onLogInteractionClick, onDeleteClick }) => {
  return (
    <motion.div
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
            <Text as="h3" className="font-semibold text-surface-900 break-words">{contact.name}</Text>
            <Text as="p" className="text-sm text-surface-500 break-words">{contact.company}</Text>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => onLogInteractionClick(contact)}
            className="p-1 text-surface-400 hover:text-primary-600 bg-transparent hover:bg-transparent"
          >
            <ApperIcon name="MessageSquare" size={16} />
          </Button>
          <Button
            onClick={() => onDeleteClick(contact.id)}
            className="p-1 text-surface-400 hover:text-error bg-transparent hover:bg-transparent"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Mail" size={14} className="text-surface-400" />
          <Text as="span" className="text-surface-600 break-words">{contact.email}</Text>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Phone" size={14} className="text-surface-400" />
          <Text as="span" className="text-surface-600">{contact.phone}</Text>
        </div>
        {contact.notes && (
          <div className="flex items-start space-x-2 mt-3">
            <ApperIcon name="FileText" size={14} className="text-surface-400 mt-0.5" />
            <Text as="p" className="text-surface-600 text-xs break-words">{contact.notes}</Text>
          </div>
        )}
      </div>

      {contact.lastInteraction && (
        <div className="mt-4 pt-4 border-t border-surface-100">
          <Text as="p" className="text-xs text-surface-400">
            Last interaction: {new Date(contact.lastInteraction).toLocaleDateString()}
          </Text>
        </div>
      )}
    </motion.div>
  );
};

export default ContactCard;