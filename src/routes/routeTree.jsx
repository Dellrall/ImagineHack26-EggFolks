import { Navigate, Outlet, createRootRoute, createRoute } from '@tanstack/react-router';
import Login from './index';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminReports from './admin/reports';
import mainAdmin from './admin/main';
import AdminPerks from './admin/perks';
import EmployeeDashboard from './employee/dashboard';
import EmployeePerks from './employee/perks';
import EmployeeProfile from './employee/profile';
import EmployeeRoutes from './employee/routes';

const rootRoute = createRootRoute({
  component: Outlet,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});

const adminPerksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/gamification',
  component: AdminPerks,
});

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: EmployeeLayout,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/employee/dashboard',
  component: EmployeeDashboard,
});

const employeeRoutesRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/employee/routes',
  component: EmployeeRoutes,
});

const employeePerksRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/employee/perks',
  component: EmployeePerks,
});

const employeeProfileRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/employee/profile',
  component: EmployeeProfile,
});

// Admin Routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin',
  component: AdminLayout,
});

// Redirect /admin straight to the new unified dashboard
const adminHomeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: () => <Navigate to="/admin/dashboard" />,
});

// The Unified Dashboard Route
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/dashboard',
  component: mainAdmin,
});

// Kept reports as a separate page so the UI doesn't get cluttered
const adminReportsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/reports',
  component: AdminReports,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  employeeLayoutRoute.addChildren([
    employeeDashboardRoute,
    employeeRoutesRoute,
    employeePerksRoute,
    employeeProfileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminHomeRoute,
    adminPerksRoute,
    adminDashboardRoute,
    adminReportsRoute,
  ]),
]);