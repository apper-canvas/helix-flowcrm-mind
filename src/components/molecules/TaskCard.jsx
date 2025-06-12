import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { isOverdue, isDueToday, getPriorityLabel, getPriorityColor } from '@/utils/dateHelpers';

const TaskCard = ({ task, index, getContactName, getDealTitle, onToggleComplete, onDeleteTask }) => {
  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-lg p-4 shadow-sm border transition-all ${
        task.status === 'completed'
          ? 'border-accent-200 bg-accent-50/30'
          : isOverdue(task.dueDate)
          ? 'border-red-200 bg-red-50/30'
          : isDueToday(task.dueDate)
          ? 'border-warning bg-yellow-50/30'
          : 'border-surface-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-4">
        <Button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors p-0 bg-transparent hover:bg-transparent ${
            task.status === 'completed'
              ? 'bg-accent-600 border-accent-600 text-white'
              : 'border-surface-300 hover:border-accent-600'
          }`}
        >
          {task.status === 'completed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ApperIcon name="Check" size={12} />
            </motion.div>
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Text as="h3" className={`font-medium break-words ${
                task.status === 'completed'
                  ? 'text-surface-500 line-through'
                  : 'text-surface-900'
              }`}>
                {task.title}
              </Text>
              {task.description && (
                <Text as="p" className={`text-sm mt-1 break-words ${
                  task.status === 'completed'
                    ? 'text-surface-400'
                    : 'text-surface-600'
                }`}>
                  {task.description}
                </Text>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
              <Button
                onClick={() => onDeleteTask(task.id)}
                className="text-surface-400 hover:text-error bg-transparent hover:bg-transparent p-0"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            <div className={`flex items-center space-x-1 ${
              isOverdue(task.dueDate) && task.status !== 'completed'
                ? 'text-error'
                : isDueToday(task.dueDate) && task.status !== 'completed'
                ? 'text-warning'
                : 'text-surface-500'
            }`}>
              <ApperIcon name="Calendar" size={14} />
              <Text as="span">
                {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue(task.dueDate) && task.status !== 'completed' && ' (Overdue)'}
                {isDueToday(task.dueDate) && task.status !== 'completed' && ' (Today)'}
              </Text>
            </div>

            <div className="flex items-center space-x-1 text-surface-500">
              <ApperIcon name="Flag" size={14} />
              <Text as="span">{getPriorityLabel(task.priority)} Priority</Text>
            </div>

            {task.contactId && (
              <div className="flex items-center space-x-1 text-surface-500">
                <ApperIcon name="User" size={14} />
                <Text as="span" className="break-words">{getContactName(task.contactId)}</Text>
              </div>
            )}

            {task.dealId && (
              <div className="flex items-center space-x-1 text-surface-500">
                <ApperIcon name="TrendingUp" size={14} />
                <Text as="span" className="break-words">{getDealTitle(task.dealId)}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;