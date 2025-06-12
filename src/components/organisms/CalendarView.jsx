import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { isToday as isDateToday } from '@/utils/dateHelpers';

const CalendarView = ({
  tasks,
  contacts,
  currentDate,
  view,
  navigateMonth,
  navigateWeek,
  navigateDay,
  setCurrentDate,
  onTaskComplete
}) => {
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

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

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

  const isCurrentMonth = (date) => {
    return date && date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-surface-200">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              if (view === 'month') navigateMonth(-1);
              else if (view === 'week') navigateWeek(-1);
              else navigateDay(-1);
            }}
            className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 bg-transparent"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>

          <Text as="h2" className="text-xl font-semibold text-surface-900">
            {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {view === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Button
            onClick={() => {
              if (view === 'month') navigateMonth(1);
              else if (view === 'week') navigateWeek(1);
              else navigateDay(1);
            }}
            className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 bg-transparent"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>

        <Button
          onClick={() => setCurrentDate(new Date())}
          className="bg-primary-600 text-white hover:bg-primary-700"
        >
          Today
        </Button>
      </div>

      {/* Calendar Views */}
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
                  isDateToday(date) ? 'bg-primary-50' : 'bg-white'
                }`}
              >
                {date && (
                  <>
                    <Text as="div" className={`text-sm font-medium mb-2 ${
                      isDateToday(date) ? 'text-primary-600' : 'text-surface-900'
                    }`}>
                      {date.getDate()}
                    </Text>
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
                          onClick={() => onTaskComplete(task.id)}
                        >
                          {task.title}
                        </div>
                      ))}
                      {getTasksForDate(date).length > 3 && (
                        <Text as="div" className="text-xs text-surface-500">
                          +{getTasksForDate(date).length - 3} more
                        </Text>
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
                isDateToday(date) ? 'bg-primary-50 text-primary-600' : 'bg-surface-50 text-surface-600'
              }`}>
                <Text as="div" className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                <Text as="div" className="text-lg">{date.getDate()}</Text>
              </div>
            ))}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-8">
            <div className="p-4 border-r border-surface-200 bg-surface-50">
              <Text as="div" className="text-sm text-surface-600">All Day</Text>
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
                      onClick={() => onTaskComplete(task.id)}
                    >
                      <Text as="div" className="font-medium">{task.title}</Text>
                      {task.contactId && (
                        <Text as="div" className="text-xs opacity-75">
                          {getContactName(task.contactId)}
                        </Text>
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
                <Text as="p" className="text-surface-500">No tasks scheduled for this day</Text>
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
                        <Button
                          onClick={() => onTaskComplete(task.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors p-0 bg-transparent hover:bg-transparent ${
                            task.status === 'completed'
                              ? 'bg-accent-600 border-accent-600 text-white'
                              : 'border-surface-300 hover:border-accent-600'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <ApperIcon name="Check" size={12} />
                          )}
                        </Button>
                        <Text as="h3" className={`font-semibold break-words ${
                          task.status === 'completed'
                            ? 'text-surface-500 line-through'
                            : 'text-surface-900'
                        }`}>
                          {task.title}
                        </Text>
                      </div>

                      {task.description && (
                        <Text as="p" className={`mt-2 text-sm break-words ${
                          task.status === 'completed'
                            ? 'text-surface-400'
                            : 'text-surface-600'
                        }`}>
                          {task.description}
                        </Text>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-surface-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Flag" size={14} />
                          <Text as="span">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</Text>
                        </div>

                        {task.contactId && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="User" size={14} />
                            <Text as="span" className="break-words">{getContactName(task.contactId)}</Text>
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
  );
};

export default CalendarView;