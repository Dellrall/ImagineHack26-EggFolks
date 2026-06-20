import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';

const copy = {
  employee: {
    title: 'Employee Dashboard',
    subtitle: 'Eco routes, perks, schedules, and personal impact',
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Sustainability operations, schedules, analytics, and reports',
  },
};

export default function SaaSLayout({ variant = 'employee' }) {
  const [open, setOpen] = useState(false);
  const content = copy[variant];
  const isAdmin = variant === 'admin';

  return (
    <div className="min-h-screen bg-appBg dark:bg-slate-950 lg:flex">
      {isAdmin && <Sidebar variant={variant} open={open} onClose={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <Navbar
          title={content.title}
          subtitle={content.subtitle}
          variant={variant}
          onMenuClick={() => setOpen(true)}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
