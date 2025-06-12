import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import taskService from '../services/api/taskService';
import contactService from '../services/api/contactService';

const Calendar = () => {
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

  const getContactName = (contactId) => {
    if (!contactId) return '';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === dateStr;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
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

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date && date.getMonth() === currentDate.getMonth();
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load calendar</h3>
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
        <h1 className="text-2xl font-semibold text-surface-900">Calendar</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'day'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (view === 'month') navigateMonth(-1);
              else if (view === 'week') navigateWeek(-1);
              else navigateDay(-1);
            }}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </button>
          
          <h2 className="text-xl font-semibold text-surface-900">
            {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {view === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => {
              if (view === 'month') navigateMonth(1);
              else if (view === 'week') navigateWeek(1);
              else navigateDay(1);
            }}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Views */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        {view === 'month' && (
          <div>
            {/* Week Headers */}
            <div className="grid grid-cols-7 border-b border-surface-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center font-medium text-surface-600 bg-surface-50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((date, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`min-h-[120px] p-2 border-r border-b border-surface-200 ${
                    !date ? 'bg-surface-50' :
                    !isCurrentMonth(date) ? 'bg-surface-50 text-surface-400' :
                    isToday(date) ? 'bg-primary-50' : 'bg-white'
                  }`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday(date) ? 'text-primary-600' : 'text-surface-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getTasksForDate(date).slice(0, 3).map(task => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded cursor-pointer break-words ${
                              task.status === 'completed'
                                ? 'bg-accent-100 text-accent-800'
                                : task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            {task.title}
                          </div>
                        ))}
                        {getTasksForDate(date).length > 3 && (
                          <div className="text-xs text-surface-500">
                            +{getTasksForDate(date).length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div>
            {/* Week Headers */}
            <div className="grid grid-cols-8 border-b border-surface-200">
              <div className="p-4 bg-surface-50"></div>
              {getWeekDays(currentDate).map(date => (
                <div key={date.toISOString()} className={`p-4 text-center font-medium ${
                  isToday(date) ? 'bg-primary-50 text-primary-600' : 'bg-surface-50 text-surface-600'
                }`}>
                  <div className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-lg">{date.getDate()}</div>
                </div>
              ))}
            </div>
            
            {/* Week Grid */}
            <div className="grid grid-cols-8">
              <div className="p-4 border-r border-surface-200 bg-surface-50">
                <div className="text-sm text-surface-600">All Day</div>
              </div>
              {getWeekDays(currentDate).map(date => (
                <div key={date.toISOString()} className="min-h-[300px] p-2 border-r border-surface-200">
                  <div className="space-y-1">
                    {getTasksForDate(date).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-2 rounded cursor-pointer break-words ${
                          task.status === 'completed'
                            ? 'bg-accent-100 text-accent-800'
                            : task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        onClick={() => handleTaskComplete(task.id)}
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.contactId && (
                          <div className="text-xs opacity-75">
                            {getContactName(task.contactId)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="p-6">
            <div className="space-y-4">
              {getTasksForDate(currentDate).length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500">No tasks scheduled for this day</p>
                </div>
              ) : (
                getTasksForDate(currentDate).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      task.status === 'completed'
                        ? 'border-accent-500 bg-accent-50'
                        : task.priority === 'high'
                        ? 'border-error bg-red-50'
                        : task.priority === 'medium'
                        ? 'border-warning bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleTaskComplete(task.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              task.status === 'completed'
                                ? 'bg-accent-600 border-accent-600 text-white'
                                : 'border-surface-300 hover:border-accent-600'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <ApperIcon name="Check" size={12} />
                            )}
                          </button>
                          <h3 className={`font-semibold break-words ${
                            task.status === 'completed'
                              ? 'text-surface-500 line-through'
                              : 'text-surface-900'
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        
                        {task.description && (
                          <p className={`mt-2 text-sm break-words ${
                            task.status === 'completed'
                              ? 'text-surface-400'
                              : 'text-surface-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-surface-500">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Flag" size={14} />
                            <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
                          </div>
                          
                          {task.contactId && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="User" size={14} />
                              <span className="break-words">{getContactName(task.contactId)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;