import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatCard = ({ title, value, icon, color, bgColor, trend, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
    >
      <div className="flex items-center justify-between mb-3">
        <Text as="h3" className="text-sm font-medium text-surface-600">{title}</Text>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <ApperIcon name={icon} size={20} className={color} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <Text as="p" className="text-2xl font-semibold text-surface-900">{value}</Text>
        {trend && trend !== 'none' && (
          <span className={`text-sm font-medium ${
            trend === 'urgent' ? 'text-warning' : 'text-accent-600'
          }`}>
            {trend === 'urgent' ? 'Due now' : trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;