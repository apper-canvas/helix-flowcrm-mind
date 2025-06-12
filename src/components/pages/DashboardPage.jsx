import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import StatCard from '@/components/molecules/StatCard';
import MainFeature from '@/components/organisms/MainFeature';
import RecentActivities from '@/components/organisms/RecentActivities';
import UpcomingTasks from '@/components/organisms/UpcomingTasks';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import taskService from '@/services/api/taskService';
import interactionService from '@/services/api/interactionService';

const DashboardPage = () => {
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

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [contacts, deals, tasks, interactions] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        interactionService.getAll()
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

      const tasksDueToday = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize task due date to midnight
        return dueDate.getTime() === today.getTime() && task.status !== 'completed';
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
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
            <StatCard
              key={i}
              index={i} // Pass index for delay calculation
              title="" // Placeholder
              value="" // Placeholder
              icon="Loader" // Placeholder icon
              color="text-surface-400"
              bgColor="bg-surface-100"
              className="animate-pulse" // Apply pulse directly if card needs it
            >
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                  <div className="h-8 w-8 bg-surface-200 rounded-lg"></div>
                </div>
                <div className="h-8 bg-surface-200 rounded w-16"></div>
                <div className="h-3 bg-surface-200 rounded w-12"></div>
              </div>
            </StatCard>
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
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Failed to load dashboard</Text>
          <Text as="p" className="text-surface-500 mb-4">{error}</Text>
          <Button
            onClick={loadDashboardData}
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
        <Text as="h1" className="text-2xl font-semibold text-surface-900">Dashboard</Text>
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate('/contacts')}
            className="bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <Text as="span">Add Contact</Text>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Feature */}
      <MainFeature />

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <RecentActivities
          activities={recentActivities}
          onLogInteractionClick={() => navigate('/contacts')}
        />

        {/* Upcoming Tasks */}
        <UpcomingTasks
          tasks={upcomingTasks}
          onAddTaskClick={() => navigate('/tasks')}
        />
      </div>
    </div>
  );
};

export default DashboardPage;