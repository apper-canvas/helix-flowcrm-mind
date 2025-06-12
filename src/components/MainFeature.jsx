import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import dealService from '../services/api/dealService';
import taskService from '../services/api/taskService';
import contactService from '../services/api/contactService';

const MainFeature = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatureData();
  }, []);

  const loadFeatureData = async () => {
    try {
      const [deals, tasks, contacts] = await Promise.all([
        dealService.getAll(),
        taskService.getAll(),
        contactService.getAll()
      ]);

      // Pipeline summary
      const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
      const pipeline = stages.map(stage => {
        const stageDeals = deals.filter(deal => deal.stage === stage);
        return {
          stage,
          count: stageDeals.length,
          value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
        };
      });
      setPipelineData(pipeline);

      // Upcoming tasks (next 3)
      const today = new Date();
      const pendingTasks = tasks
        .filter(task => task.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);
      setUpcomingTasks(pendingTasks);

      // Recent contacts (last 3)
      const sortedContacts = contacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentContacts(sortedContacts);

    } catch (err) {
      console.error('Failed to load feature data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-primary-500', 'bg-accent-500', 'bg-secondary-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const isDueToday = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-surface-200 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
    >
      <h2 className="text-lg font-semibold text-surface-900 mb-6">Quick Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={16} className="text-primary-600" />
              <span>Deal Pipeline</span>
            </h3>
            <button
              onClick={() => navigate('/deals')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {pipelineData.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
              >
                <div>
                  <div className="text-sm font-medium text-surface-900">{item.stage}</div>
                  <div className="text-xs text-surface-500">{item.count} deals</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-surface-900">
                    ${item.value.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="CheckSquare" size={16} className="text-accent-600" />
              <span>Upcoming Tasks</span>
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="CheckSquare" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-sm text-surface-500">No upcoming tasks</p>
              </div>
            ) : (
              upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-surface-50 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    task.priority === 'high' ? 'bg-error' :
                    task.priority === 'medium' ? 'bg-warning' : 'bg-accent-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 break-words">{task.title}</div>
                    <div className={`text-xs mt-1 ${
                      isOverdue(task.dueDate) ? 'text-error' :
                      isDueToday(task.dueDate) ? 'text-warning' : 'text-surface-500'
                    }`}>
                      {isOverdue(task.dueDate) ? 'Overdue' :
                       isDueToday(task.dueDate) ? 'Due today' :
                       `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="Users" size={16} className="text-secondary-600" />
              <span>Recent Contacts</span>
            </h3>
            <button
              onClick={() => navigate('/contacts')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentContacts.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Users" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-sm text-surface-500">No contacts yet</p>
              </div>
            ) : (
              recentContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(contact.name)}`}>
                    {getInitials(contact.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-surface-900 break-words">{contact.name}</div>
                    <div className="text-xs text-surface-500 break-words">{contact.company || contact.email}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeature;