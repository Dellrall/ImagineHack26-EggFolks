import { Outlet } from '@tanstack/react-router';
import { Bell, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-appBg lg:flex">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-appBg/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open admin navigation"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-950 md:text-2xl">
                  Admin Dashboard
                </h1>
                <p className="hidden text-sm text-slate-500 sm:block">
                  Corporate sustainability operations and workspace intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 md:flex">
                <Search size={17} />
                <span className="text-sm">Search admin data</span>
              </div>
              <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
