import { Link, useRouterState } from '@tanstack/react-router';
import {
  BarChart3,
  Bell,
  Brain,
  Building2,
  FileText,
  LayoutDashboard,
  Leaf,
  Map,
  Settings,
  Users,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Employee Management', icon: Users },
  { to: '/admin/workspace', label: 'Workspace Management', icon: Building2 },
  { to: '/admin/carbon', label: 'Carbon Analytics', icon: BarChart3 },
  { to: '/admin/routes', label: 'Route Analytics', icon: Map },
  { to: '/admin/ai', label: 'AI Recommendations', icon: Brain },
  { to: '/admin/notifications', label: 'Notifications Center', icon: Bell },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close admin navigation"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-100 bg-white px-4 py-6 shadow-soft transition-transform lg:static lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-3 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-950">EcoRoute Admin</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sustainability Platform
            </p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-emerald-200'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-secondary'
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
