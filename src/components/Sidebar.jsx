import { Link, useRouterState } from '@tanstack/react-router';
import {
  Bell,
  CalendarDays,
  Coins,
  Home,
  Leaf,
  Map,
  MessageSquare,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/routes', label: 'Route Recommendations', icon: Map },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/credits', label: 'Carbon Credits', icon: Coins },
  { to: '/schedule', label: 'Workspace Schedule', icon: CalendarDays },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-100 bg-white px-4 py-6 shadow-soft transition-transform lg:static lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-3 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-950">EcoRoute</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Workspace Optimizer
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
