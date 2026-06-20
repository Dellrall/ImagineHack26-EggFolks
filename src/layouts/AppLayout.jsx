import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-appBg lg:flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
