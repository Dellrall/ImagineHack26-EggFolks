import { Navigate, Outlet, createRootRoute, createRoute } from '@tanstack/react-router';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminReports from './admin/reports';
import mainAdmin from './admin/main';
import AdminPerks from './admin/perks';
import EmployeeDashboard from './employee/dashboard';
import EmployeePerks from './employee/perks';
import EmployeeProfile from './employee/profile';
import EmployeeRoutes from './employee/routes';
import EmployeeVouchers from './employee/vouchers';

const rootRoute = createRootRoute({
  component: Outlet,
});

const adminPerksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/gamification',
  component: AdminPerks,
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

const employeeVouchersRoute = createRoute({
  getParentRoute: () => employeeLayoutRoute,
  path: '/vouchers',
  component: EmployeeVouchers,
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
    employeeVouchersRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminHomeRoute,
    adminPerksRoute,
    adminDashboardRoute,
    adminReportsRoute,
  ]),
]);