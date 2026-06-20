import { Link, useRouterState } from '@tanstack/react-router';
import { Bell, BrainCircuit, Clock, Leaf, Menu, Moon, Route, Sun, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { recentNotifications } from '../../data/employeeData';
import { getCurrentUser } from '../../lib/auth';
import { recommendTransportationRoute } from '../../lib/transportationRouter';

const employeeNav = [
  { to: '/employee/dashboard', label: 'Dashboard' },
  { to: '/employee/routes', label: 'Routes' },
  { to: '/employee/perks', label: 'Perks' },
  { to: '/employee/profile', label: 'Profile' },
];

export default function Navbar({ title, subtitle, variant = 'employee', onMenuClick }) {
  const [dark, setDark] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [smartOpen, setSmartOpen] = useState(false);
  const [isRushing, setIsRushing] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const user = getCurrentUser();
  const isAdmin = variant === 'admin';
  const recommendation = recommendTransportationRoute({
    start_location: 'Subang Jaya',
    destination: 'KL Sentral',
    departure_time: '08:00',
    expected_arrival: '09:00',
    is_rushing: isRushing,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-appBg/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {isAdmin && (
            <button
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          )}
          <div className="shrink-0">
            <h1 className="text-xl font-black text-slate-950 dark:text-white md:text-2xl">
              {title}
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
          </div>

        </div>

        {!isAdmin && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 lg:flex">
            {employeeNav.map((item) => (
              <TopNavLink key={item.to} item={item} active={pathname === item.to} />
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-secondary shadow-sm transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300"
                onClick={() => setSmartOpen((value) => !value)}
                aria-label="Open smart recommendation"
                aria-expanded={smartOpen}
              >
                <BrainCircuit size={18} />
                <span className="hidden text-sm font-black md:inline">Smart Route</span>
              </button>

              {smartOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:w-96">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 dark:border-slate-800 dark:from-emerald-950/30 dark:to-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-2 text-white">
                        <BrainCircuit size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-wide text-secondary">
                          Smart Recommendation
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Subang Jaya to KL Sentral
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-950">
                      <button
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
                          isRushing
                            ? 'bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-300'
                            : 'bg-secondary text-white'
                        }`}
                        onClick={() => setIsRushing(false)}
                      >
                        <Leaf size={16} />
                        Not Rush
                      </button>
                      <button
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
                          isRushing
                            ? 'bg-secondary text-white'
                            : 'bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-300'
                        }`}
                        onClick={() => setIsRushing(true)}
                      >
                        <Zap size={16} />
                        Rush
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-secondary">
                            Recommended Route
                          </p>
                          <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                            {recommendation.recommended_route}
                          </h3>
                        </div>
                        <Route className="text-secondary" size={24} />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <MiniMetric
                          icon={Clock}
                          label="ETA"
                          value={`${recommendation.estimated_travel_time}m`}
                        />
                        <MiniMetric
                          icon={Leaf}
                          label="CO₂"
                          value={`${recommendation.carbon_saved_kg}kg`}
                        />
                        <MiniMetric
                          icon={Zap}
                          label="Score"
                          value={recommendation.environmental_score}
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {recommendation.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            onClick={() => setDark((value) => !value)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isAdmin && (
            <div className="relative">
              <button
                className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-emerald-200 hover:text-secondary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                onClick={() => setNotificationsOpen((value) => !value)}
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={20} />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-black text-white">
                  {recentNotifications.length}
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:w-96">
                  <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <p className="text-sm font-black uppercase tracking-wide text-secondary">
                      Notifications
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Commute and workspace updates
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-3">
                    {recentNotifications.map((item) => (
                      <button
                        key={item}
                        className="block w-full rounded-xl p-3 text-left transition hover:bg-emerald-50 dark:hover:bg-slate-800"
                      >
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">Just now</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black text-white">
            {user.name.split(' ').map((part) => part[0]).join('')}
          </div>
        </div>
      </div>

      {!isAdmin && (
        <nav className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1 lg:hidden">
          {employeeNav.map((item) => (
            <TopNavLink key={item.to} item={item} active={pathname === item.to} mobile />
          ))}
        </nav>
      )}
    </header>
  );
}

function TopNavLink({ item, active, mobile = false }) {
  return (
    <Link
      to={item.to}
      className={`${mobile ? 'shrink-0' : ''} rounded-xl px-4 py-2 text-sm font-black transition ${
        active
          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
          : 'bg-white text-slate-500 hover:bg-emerald-50 hover:text-secondary dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {item.label}
    </Link>
  );
}

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
      <Icon size={15} className="text-secondary" />
      <p className="mt-2 text-[11px] font-bold uppercase text-slate-400">{label}</p>
      <p className="text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
