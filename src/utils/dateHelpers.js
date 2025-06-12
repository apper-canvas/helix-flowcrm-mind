import { isToday as isDateToday } from 'date-fns';

// Check if a date is today
export function isToday(date) {
  return isDateToday(date);
}

// Priority color mapping
export function getPriorityColor(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
// Priority label mapping
export function getPriorityLabel(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'High Priority';
    case 'medium':
      return 'Medium Priority';
    case 'low':
      return 'Low Priority';
    default:
      return 'Unknown Priority';
  }
}