import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import DealCard from '@/components/molecules/DealCard';

const DealPipeline = ({
  deals,
  contacts,
  stages,
  onAddDeal,
  onDealDrop,
  onDeleteDeal,
  loading,
  error
}) => {

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

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Failed to load deals</Text>
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
      <div className="flex items-center justify-between">
        <Text as="h1" className="text-2xl font-semibold text-surface-900">Deal Pipeline</Text>
        <Button
          onClick={onAddDeal}
          className="bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <Text as="span">Add Deal</Text>
        </Button>
      </div>

      {deals.length === 0 ? (
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
          <Text as="h3" className="mt-4 text-lg font-medium text-surface-900">No deals yet</Text>
          <Text as="p" className="mt-2 text-surface-500">Start building your sales pipeline</Text>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddDeal}
            className="mt-4 bg-primary-600 text-white hover:bg-primary-700"
          >
            Add Deal
          </Button>
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
              onDrop={(e) => onDealDrop(e, stage.id)}
            >
              <div className="bg-white rounded-lg shadow-sm border border-surface-200">
                <div className={`p-4 border-b border-surface-200 ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <Text as="h3" className="font-semibold text-surface-900">{stage.name}</Text>
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
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      dealIndex={dealIndex}
                      getContactName={getContactName}
                      onDeleteDeal={onDeleteDeal}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealPipeline;