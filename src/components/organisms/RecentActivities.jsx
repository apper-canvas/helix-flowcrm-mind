import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const RecentActivities = ({ activities, onLogInteractionClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200"
    >
      <div className="p-6 border-b border-surface-200">
        <Text as="h2" className="text-lg font-semibold text-surface-900">Recent Activities</Text>
      </div>
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <Text as="p" className="text-surface-500">No recent activities</Text>
            <Button
              onClick={onLogInteractionClick}
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium bg-transparent hover:bg-transparent"
            >
              Log your first interaction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <ApperIcon
                    name={activity.type === 'email' ? 'Mail' : activity.type === 'call' ? 'Phone' : 'Calendar'}
                    size={14}
                    className="text-primary-600"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Text as="p" className="text-sm font-medium text-surface-900 break-words">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} interaction
                  </Text>
                  <Text as="p" className="text-sm text-surface-500 break-words">{activity.notes}</Text>
                  <Text as="p" className="text-xs text-surface-400 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </Text>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivities;