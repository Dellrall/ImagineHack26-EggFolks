import { Outlet, createRootRoute, createRoute } from '@tanstack/react-router';
import AdminLayout from '../layouts/AdminLayout';
import AppLayout from '../layouts/AppLayout';
import AdminAIRecommendations from '../pages/admin/AdminAIRecommendations';
import AdminCarbon from '../pages/admin/AdminCarbon';
import AdminEmployees from '../pages/admin/AdminEmployees';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminReports from '../pages/admin/AdminReports';
import AdminRouteAnalytics from '../pages/admin/AdminRouteAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminWorkspace from '../pages/admin/AdminWorkspace';
import CarbonCredits from '../pages/CarbonCredits';
import DashboardHome from '../pages/DashboardHome';
import EmployeeProfile from '../pages/EmployeeProfile';
import Notifications from '../pages/Notifications';
import RouteFeedback from '../pages/RouteFeedback';
import RouteRecommendations from '../pages/RouteRecommendations';
import WorkspaceSchedule from '../pages/WorkspaceSchedule';

const rootRoute = createRootRoute({
  component: Outlet,
});

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/',
  component: DashboardHome,
});

const routesRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/routes',
  component: RouteRecommendations,
});

const feedbackRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/feedback',
  component: RouteFeedback,
});

const creditsRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/credits',
  component: CarbonCredits,
});

const scheduleRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/schedule',
  component: WorkspaceSchedule,
});

const notificationsRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/notifications',
  component: Notifications,
});

const profileRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/profile',
  component: EmployeeProfile,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin',
  component: AdminLayout,
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminOverview,
});

const adminEmployeesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/employees',
  component: AdminEmployees,
});

const adminWorkspaceRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/workspace',
  component: AdminWorkspace,
});

const adminCarbonRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/carbon',
  component: AdminCarbon,
});

const adminRoutesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/routes',
  component: AdminRouteAnalytics,
});

const adminAiRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/ai',
  component: AdminAIRecommendations,
});

const adminNotificationsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/notifications',
  component: AdminNotifications,
});

const adminReportsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/reports',
  component: AdminReports,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/settings',
  component: AdminSettings,
});

export const routeTree = rootRoute.addChildren([
  employeeLayoutRoute.addChildren([
    dashboardRoute,
    routesRoute,
    feedbackRoute,
    creditsRoute,
    scheduleRoute,
    notificationsRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminOverviewRoute,
    adminEmployeesRoute,
    adminWorkspaceRoute,
    adminCarbonRoute,
    adminRoutesRoute,
    adminAiRoute,
    adminNotificationsRoute,
    adminReportsRoute,
    adminSettingsRoute,
  ]),
]);
