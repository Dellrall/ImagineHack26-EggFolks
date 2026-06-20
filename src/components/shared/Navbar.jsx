import { Moon, Search, Sun, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../lib/auth';

export default function Navbar({ title, subtitle, onMenuClick }) {
  const [dark, setDark] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-appBg/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-950 dark:text-white md:text-2xl">{title}</h1>
            <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 dark:border-slate-800 dark:bg-slate-900 md:flex">
            <Search size={17} />
            <span className="text-sm">Search</span>
          </div>
          <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black text-white">
            {user.name.split(' ').map((part) => part[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
