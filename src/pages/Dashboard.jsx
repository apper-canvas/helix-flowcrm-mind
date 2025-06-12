import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import taskService from '../services/api/taskService';
import interactionService from '../services/api/interactionService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    tasksDueToday: 0,
    revenueTotal: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contacts, deals, tasks, interactions] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          taskService.getAll(),
          interactionService.getAll()
        ]);

        const today = new Date().toDateString();
        const tasksDueToday = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate.toDateString() === today && task.status !== 'completed';
        });

        const activeDeals = deals.filter(deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost');
        const revenueTotal = deals
          .filter(deal => deal.stage === 'Closed Won')
          .reduce((sum, deal) => sum + deal.value, 0);

        setStats({
          totalContacts: contacts.length,
          activeDeals: activeDeals.length,
          tasksDueToday: tasksDueToday.length,
          revenueTotal
        });

        // Recent activities from interactions
        const sortedInteractions = interactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentActivities(sortedInteractions);

        // Upcoming tasks
        const sortedTasks = tasks
          .filter(task => task.status !== 'completed')
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5);
        setUpcomingTasks(sortedTasks);

      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: 'Users',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      trend: '+12%'
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: 'TrendingUp',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      trend: '+8%'
    },
    {
      title: 'Tasks Due Today',
      value: stats.tasksDueToday,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-orange-50',
      trend: stats.tasksDueToday > 0 ? 'urgent' : 'none'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenueTotal.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-green-50',
      trend: '+15%'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
            >
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                  <div className="h-8 w-8 bg-surface-200 rounded-lg"></div>
                </div>
                <div className="h-8 bg-surface-200 rounded w-16"></div>
                <div className="h-3 bg-surface-200 rounded w-12"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load dashboard</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-surface-600">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <ApperIcon name={stat.icon} size={20} className={stat.color} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-surface-900">{stat.value}</p>
              {stat.trend && stat.trend !== 'none' && (
                <span className={`text-sm font-medium ${
                  stat.trend === 'urgent' ? 'text-warning' : 'text-accent-600'
                }`}>
                  {stat.trend === 'urgent' ? 'Due now' : stat.trend}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Feature */}
      <MainFeature />

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No recent activities</p>
                <button
                  onClick={() => navigate('/contacts')}
                  className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Log your first interaction
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
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
                      <p className="text-sm font-medium text-surface-900 break-words">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} interaction
                      </p>
                      <p className="text-sm text-surface-500 break-words">{activity.notes}</p>
                      <p className="text-xs text-surface-400 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No upcoming tasks</p>
                <button
                  onClick={() => navigate('/tasks')}
                  className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
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
                      <p className="text-sm font-medium text-surface-900 break-words">{task.title}</p>
                      <p className="text-sm text-surface-500 break-words">{task.description}</p>
                      <p className="text-xs text-surface-400 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;