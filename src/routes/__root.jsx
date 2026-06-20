import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Outlet is where child routes (like Login or Dashboard) will render */}
      <Outlet />
    </div>
  ),
});