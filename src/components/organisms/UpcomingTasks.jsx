import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { isDueToday, isOverdue } from '@/utils/dateHelpers';

const UpcomingTasks = ({ tasks, onAddTaskClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200"
    >
      <div className="p-6 border-b border-surface-200">
        <Text as="h2" className="text-lg font-semibold text-surface-900">Upcoming Tasks</Text>
      </div>
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <Text as="p" className="text-surface-500">No upcoming tasks</Text>
            <Button
              onClick={onAddTaskClick}
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium bg-transparent hover:bg-transparent"
            >
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-error' :
                    task.priority === 'medium' ? 'bg-warning' : 'bg-accent-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <Text as="p" className="text-sm font-medium text-surface-900 break-words">{task.title}</Text>
                  <Text as="p" className="text-sm text-surface-500 break-words">{task.description}</Text>
                  <Text as="p" className="text-xs text-surface-400 mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
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

export default UpcomingTasks;