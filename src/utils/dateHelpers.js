export const isOverdue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const isDueToday = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-accent-500',
    medium: 'bg-warning',
    high: 'bg-error'
  };
  return colors[priority] || 'bg-gray-500'; // Default color
};

export const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };
  return labels[priority] || 'Unknown';
};