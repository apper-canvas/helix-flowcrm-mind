import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import CalendarView from '@/components/organisms/CalendarView';
import taskService from '@/services/api/taskService';
import contactService from '@/services/api/contactService';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const handleTaskComplete = async (taskId) => {
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded w-20 animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 h-96 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Failed to load calendar</Text>
          <Text as="p" className="text-surface-500 mb-4">{error}</Text>
          <Button
            onClick={loadData}
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
        <Text as="h1" className="text-2xl font-semibold text-surface-900">Calendar</Text>

        <div className="flex space-x-2">
          <Button
            onClick={() => setView('month')}
            className={`text-sm font-medium ${
              view === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Month
          </Button>
          <Button
            onClick={() => setView('week')}
            className={`text-sm font-medium ${
              view === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Week
          </Button>
          <Button
            onClick={() => setView('day')}
            className={`text-sm font-medium ${
              view === 'day'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Day
          </Button>
        </div>
      </div>

      <CalendarView
        tasks={tasks}
        contacts={contacts}
        currentDate={currentDate}
        view={view}
        navigateMonth={navigateMonth}
        navigateWeek={navigateWeek}
        navigateDay={navigateDay}
        setCurrentDate={setCurrentDate}
        onTaskComplete={handleTaskComplete}
      />
    </div>
  );
};

export default CalendarPage;