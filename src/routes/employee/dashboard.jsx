import { CalendarDays, Leaf, Route, WalletCards } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import LoadingState from '../../components/shared/LoadingState';
import ErrorState from '../../components/shared/ErrorState';
import { recentNotifications } from '../../data/employeeData';
import { usePoints } from '../../hooks/usePoints';
import { useRoutes } from '../../hooks/useRoutes';
import { useSchedule } from '../../hooks/useSchedule';

export default function EmployeeDashboard() {
  const { recommended } = useRoutes();
  const schedule = useSchedule();
  const points = usePoints();

  if (recommended.isLoading || schedule.isLoading || points.isLoading) return <LoadingState />;
  if (recommended.isError || schedule.isError || points.isError) {
    return <ErrorState onRetry={() => { recommended.refetch(); schedule.refetch(); points.refetch(); }} />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Recommended Eco Route" value={recommended.data.name} icon={Route} />
        <StatCard label="Today's Schedule" value={schedule.data.today} icon={CalendarDays} />
        <StatCard label="Eco Points Balance" value={points.data.balance} icon={WalletCards} />
        <StatCard label="Carbon Saved" value={recommended.data.carbonSaved} icon={Leaf} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Monthly Progress</h2>
          <p className="mt-2 text-sm text-slate-500">{points.data.balance} / {points.data.monthlyTarget} points</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {schedule.data.week.map((item) => (
              <div key={item.day} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-bold text-slate-500">{item.day}</p>
                <p className="mt-1 font-black text-slate-950 dark:text-white">{item.mode}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Recent Notifications</h2>
          <div className="mt-5 space-y-3">
            {recentNotifications.map((item) => (
              <div key={item} className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-slate-700 dark:bg-emerald-950/30 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
