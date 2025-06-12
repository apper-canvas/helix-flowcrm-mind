import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const DealCard = ({ deal, dealIndex, getContactName, onDeleteDeal, onDragStart }) => {
  return (
    <motion.div
      key={deal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: dealIndex * 0.1 }}
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="bg-surface-50 border border-surface-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
<Text as="h4" className="font-medium text-surface-900 break-words">{deal.title || deal.Name}</Text>
        <Button
          onClick={() => onDeleteDeal(deal.id)}
          className="p-1 text-surface-400 hover:text-error bg-transparent hover:bg-transparent"
        >
          <ApperIcon name="X" size={14} />
        </Button>
      </div>

      <div className="space-y-2 text-sm">
<div className="flex items-center justify-between">
          <Text as="span" className="text-surface-600">Value:</Text>
          <Text as="span" className="font-medium text-surface-900">
            ${(deal.value || 0).toLocaleString()}
          </Text>
        </div>

        <div className="flex items-center justify-between">
          <Text as="span" className="text-surface-600">Contact:</Text>
          <Text as="span" className="text-surface-900 break-words">
            {getContactName(deal.contact_id || deal.contactId)}
          </Text>
        </div>

        <div className="flex items-center justify-between">
<Text as="span" className="text-surface-600">Probability:</Text>
          <Text as="span" className="text-surface-900">{deal.probability || 0}%</Text>
        </div>

{(deal.expected_close || deal.expectedClose) && (
          <div className="flex items-center justify-between">
            <Text as="span" className="text-surface-600">Expected:</Text>
            <Text as="span" className="text-surface-900">
              {new Date(deal.expected_close || deal.expectedClose).toLocaleDateString()}
            </Text>
          </div>
        )}

        {deal.notes && (
          <div className="mt-3 pt-3 border-t border-surface-200">
            <Text as="p" className="text-xs text-surface-600 break-words">{deal.notes}</Text>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DealCard;