import { Link, useRouterState } from '@tanstack/react-router';
import { BarChart3, FileText, Gift, Home, Leaf, Map, Ticket, User, Zap } from 'lucide-react';

const employeeNav = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/routes', label: 'Routes', icon: Map },
  { to: '/perks', label: 'Perks', icon: Gift },
  { to: '/vouchers', label: 'Vouchers', icon: Ticket },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/gamification', label: 'Perks', icon: Zap }, // <-- New Link
  { to: '/admin/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ variant = 'employee', open, onClose }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const items = variant === 'admin' ? adminNav : employeeNav;
  const title = variant === 'admin' ? 'Cortisons Admin' : 'Cortisons';

  return (
    <>
      {open && (
        <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} aria-label="Close menu" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-4 py-6 shadow-soft transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-3 text-white">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">{title}</p>
            <p className="text-xs font-bold uppercase text-slate-500">Workspace Optimizer</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            // Updated active check to handle sub-routes if necessary
            const active = pathname.startsWith(item.to); 
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-emerald-200/60'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-secondary dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}