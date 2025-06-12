import DashboardPage from '@/components/pages/DashboardPage';
import ContactsPage from '@/components/pages/ContactsPage';
import DealsPage from '@/components/pages/DealsPage';
import TasksPage from '@/components/pages/TasksPage';
import CalendarPage from '@/components/pages/CalendarPage';
import CompaniesPage from '@/components/pages/CompaniesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: ContactsPage
  },
deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'TrendingUp',
    component: DealsPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TasksPage
  },
calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  companies: {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'Building2',
    component: CompaniesPage
  },
  notFound: { // Add NotFoundPage to routes for consistent import
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);