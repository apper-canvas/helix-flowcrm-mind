import Dashboard from '../pages/Dashboard';
import Contacts from '../pages/Contacts';
import Deals from '../pages/Deals';
import Tasks from '../pages/Tasks';
import Calendar from '../pages/Calendar';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'TrendingUp',
    component: Deals
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  }
};

export const routeArray = Object.values(routes);