import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import dealService from '@/services/api/dealService';
import taskService from '@/services/api/taskService';
import contactService from '@/services/api/contactService';
import { getInitials, getAvatarColor } from '@/utils/avatarHelpers';
import { isDueToday, isOverdue } from '@/utils/dateHelpers';

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
      <Text as="h2" className="text-lg font-semibold text-surface-900 mb-6">Quick Overview</Text>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Text as="h3" className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={16} className="text-primary-600" />
              <Text as="span">Deal Pipeline</Text>
            </Text>
            <Button
              onClick={() => navigate('/deals')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-transparent hover:bg-transparent"
            >
              View All
            </Button>
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
                  <Text as="div" className="text-sm font-medium text-surface-900">{item.stage}</Text>
                  <Text as="div" className="text-xs text-surface-500">{item.count} deals</Text>
                </div>
                <div className="text-right">
                  <Text as="div" className="text-sm font-semibold text-surface-900">
                    ${item.value.toLocaleString()}
                  </Text>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Text as="h3" className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="CheckSquare" size={16} className="text-accent-600" />
              <Text as="span">Upcoming Tasks</Text>
            </Text>
            <Button
              onClick={() => navigate('/tasks')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-transparent hover:bg-transparent"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="CheckSquare" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <Text as="p" className="text-sm text-surface-500">No upcoming tasks</Text>
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
                    <Text as="div" className="text-sm font-medium text-surface-900 break-words">{task.title}</Text>
                    <Text as="div" className={`text-xs mt-1 ${
                      isOverdue(task.dueDate) ? 'text-error' :
                      isDueToday(task.dueDate) ? 'text-warning' : 'text-surface-500'
                    }`}>
                      {isOverdue(task.dueDate) ? 'Overdue' :
                       isDueToday(task.dueDate) ? 'Due today' :
                       `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                    </Text>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Text as="h3" className="font-medium text-surface-700 flex items-center space-x-2">
              <ApperIcon name="Users" size={16} className="text-secondary-600" />
              <Text as="span">Recent Contacts</Text>
            </Text>
            <Button
              onClick={() => navigate('/contacts')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-transparent hover:bg-transparent"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentContacts.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Users" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <Text as="p" className="text-sm text-surface-500">No contacts yet</Text>
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
                    <Text as="div" className="text-sm font-medium text-surface-900 break-words">{contact.name}</Text>
                    <Text as="div" className="text-xs text-surface-500 break-words">{contact.company || contact.email}</Text>
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