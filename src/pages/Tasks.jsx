import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import taskService from '../services/api/taskService';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    contactId: '',
    dealId: ''
  });

  const priorityColors = {
    low: 'bg-accent-500',
    medium: 'bg-warning',
    high: 'bg-error'
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
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

    // Sort by due date, then by priority
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = await taskService.create(formData);
      setTasks([...tasks, newTask]);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        contactId: '',
        dealId: ''
      });
      setShowCreateModal(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

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

  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const isDueToday = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load tasks</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-surface-900">Tasks</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Tasks', count: tasks.filter(t => t.status !== 'completed').length },
          { id: 'today', label: 'Due Today', count: tasks.filter(t => isDueToday(t.dueDate) && t.status !== 'completed').length },
          { id: 'week', label: 'This Week', count: tasks.filter(t => {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const dueDate = new Date(t.dueDate);
            return dueDate >= today && dueDate <= nextWeek && t.status !== 'completed';
          }).length },
          { id: 'overdue', label: 'Overdue', count: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length },
          { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              filter === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === tab.id
                ? 'bg-primary-700 text-primary-100'
                : 'bg-surface-200 text-surface-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading ? (
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
          <h3 className="mt-4 text-lg font-medium text-surface-900">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="mt-2 text-surface-500">
            {filter === 'all' ? 'Create your first task to get organized' : 'All caught up!'}
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Task
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
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
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.status === 'completed'
                      ? 'bg-accent-600 border-accent-600 text-white'
                      : 'border-surface-300 hover:border-accent-600'
                  }`}
                >
                  {task.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ApperIcon name="Check" size={12} />
                    </motion.div>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium break-words ${
                        task.status === 'completed'
                          ? 'text-surface-500 line-through'
                          : 'text-surface-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 break-words ${
                          task.status === 'completed'
                            ? 'text-surface-400'
                            : 'text-surface-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}></div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-surface-400 hover:text-error transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
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
                      <span>
                        {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue(task.dueDate) && task.status !== 'completed' && ' (Overdue)'}
                        {isDueToday(task.dueDate) && task.status !== 'completed' && ' (Today)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-surface-500">
                      <ApperIcon name="Flag" size={14} />
                      <span>{priorityLabels[task.priority]} Priority</span>
                    </div>
                    
                    {task.contactId && (
                      <div className="flex items-center space-x-1 text-surface-500">
                        <ApperIcon name="User" size={14} />
                        <span className="break-words">{getContactName(task.contactId)}</span>
                      </div>
                    )}
                    
                    {task.dealId && (
                      <div className="flex items-center space-x-1 text-surface-500">
                        <ApperIcon name="TrendingUp" size={14} />
                        <span className="break-words">{getDealTitle(task.dealId)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-surface-900">Add New Task</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Task Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Related Contact</label>
                    <select
                      value={formData.contactId}
                      onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">No contact</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Related Deal</label>
                    <select
                      value={formData.dealId}
                      onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">No deal</option>
                      {deals.map(deal => (
                        <option key={deal.id} value={deal.id}>{deal.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-surface-600 hover:text-surface-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;