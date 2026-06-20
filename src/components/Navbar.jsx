import { Bell, Menu, Search } from 'lucide-react';
import { employee } from '../data/mockData';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-appBg/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-950 md:text-2xl">
              Employee Dashboard
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Eco-route planning and dynamic workspace decisions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 md:flex">
            <Search size={17} />
            <span className="text-sm">Search routes</span>
          </div>
          <button
            aria-label="Notifications"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
          >
            <Bell size={20} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black text-white">
            {employee.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
