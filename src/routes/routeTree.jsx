import { Navigate, Outlet, createRootRoute, createRoute } from '@tanstack/react-router';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminEmployees from './admin/employees';
import AdminOverview from './admin/overview';
import AdminReports from './admin/reports';
import AdminSchedules from './admin/schedules';
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
  component: () => <Navigate to="/dashboard" />,
});

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: EmployeeLayout,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/dashboard',
  component: EmployeeDashboard,
});

const employeeRoutesRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/routes',
  component: EmployeeRoutes,
});

const employeePerksRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/perks',
  component: EmployeePerks,
});

const employeeProfileRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/profile',
  component: EmployeeProfile,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin',
  component: AdminLayout,
});

const adminHomeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: () => <Navigate to="/admin/overview" />,
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/overview',
  component: AdminOverview,
});

const adminSchedulesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/schedules',
  component: AdminSchedules,
});

const adminEmployeesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/employees',
  component: AdminEmployees,
});

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
    adminOverviewRoute,
    adminSchedulesRoute,
    adminEmployeesRoute,
    adminReportsRoute,
  ]),
]);
