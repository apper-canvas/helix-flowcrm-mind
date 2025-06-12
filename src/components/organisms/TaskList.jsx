import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import TaskCard from '@/components/molecules/TaskCard';
import { isOverdue, isDueToday } from '@/utils/dateHelpers';

const TaskList = ({
  tasks,
  contacts,
  deals,
  filter,
  onFilterChange,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  loading,
  error
}) => {

  const getContactName = (contactId) => {
    if (!contactId) return '';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return '';
    const deal = deals.find(d => d.id === dealId);
    return deal ? deal.title : 'Unknown Deal';
  };

  const filterTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let filtered = [...tasks];

    switch (filter) {
      case 'today':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime() && task.status !== 'completed';
        });
        break;
      case 'week':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= nextWeek && task.status !== 'completed';
        });
        break;
      case 'overdue':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate < today && task.status !== 'completed';
        });
        break;
      case 'completed':
        filtered = tasks.filter(task => task.status === 'completed');
        break;
      default:
        filtered = tasks.filter(task => task.status !== 'completed');
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return filtered;
  };

  const filteredTasks = filterTasks();

  const getTaskCountForFilter = (filterId) => {
    const tempFilter = filter; // Temporarily set filter to calculate count
    const tempTasks = [...tasks]; // Use actual tasks array
    let count = 0;

    switch (filterId) {
      case 'all':
        count = tempTasks.filter(t => t.status !== 'completed').length;
        break;
      case 'today':
        count = tempTasks.filter(t => isDueToday(t.dueDate) && t.status !== 'completed').length;
        break;
      case 'week':
        count = tempTasks.filter(t => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          const dueDate = new Date(t.dueDate);
          return dueDate >= today && dueDate <= nextWeek && t.status !== 'completed';
        }).length;
        break;
      case 'overdue':
        count = tempTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length;
        break;
      case 'completed':
        count = tempTasks.filter(t => t.status === 'completed').length;
        break;
      default:
        count = 0;
    }
    return count;
  };


  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-200 rounded w-20 animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
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
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Failed to load tasks</Text>
          <Text as="p" className="text-surface-500 mb-4">{error}</Text>
          <Button
            onClick={() => window.location.reload()}
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
        <Text as="h1" className="text-2xl font-semibold text-surface-900">Tasks</Text>
        <Button
          onClick={onAddTask}
          className="bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <Text as="span">Add Task</Text>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'week', label: 'This Week' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'completed', label: 'Completed' }
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`text-sm font-medium transition-colors flex items-center space-x-2 ${
              filter === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <Text as="span">{tab.label}</Text>
            <Text as="span" className={`px-2 py-0.5 rounded-full text-xs ${
              filter === tab.id
                ? 'bg-primary-700 text-primary-100'
                : 'bg-surface-200 text-surface-500'
            }`}>
              {getTaskCountForFilter(tab.id)}
            </Text>
          </Button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <Text as="h3" className="mt-4 text-lg font-medium text-surface-900">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </Text>
          <Text as="p" className="mt-2 text-surface-500">
            {filter === 'all' ? 'Create your first task to get organized' : 'All caught up!'}
          </Text>
          {filter === 'all' && (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTask}
              className="mt-4 bg-primary-600 text-white hover:bg-primary-700"
            >
              Add Task
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              getContactName={getContactName}
              getDealTitle={getDealTitle}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;