import { createRootRoute, createRoute } from '@tanstack/react-router';
import AppLayout from '../layouts/AppLayout';
import CarbonCredits from '../pages/CarbonCredits';
import DashboardHome from '../pages/DashboardHome';
import EmployeeProfile from '../pages/EmployeeProfile';
import Notifications from '../pages/Notifications';
import RouteFeedback from '../pages/RouteFeedback';
import RouteRecommendations from '../pages/RouteRecommendations';
import WorkspaceSchedule from '../pages/WorkspaceSchedule';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardHome,
});

const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routes',
  component: RouteRecommendations,
});

const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  component: RouteFeedback,
});

const creditsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/credits',
  component: CarbonCredits,
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule',
  component: WorkspaceSchedule,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: Notifications,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: EmployeeProfile,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  routesRoute,
  feedbackRoute,
  creditsRoute,
  scheduleRoute,
  notificationsRoute,
  profileRoute,
]);
