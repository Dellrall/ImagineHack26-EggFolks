import { useState } from 'react';
import { Leaf, Zap, Route as RouteIcon, Clock } from 'lucide-react';
import CarbonTreeCard from '../../components/employee/CarbonTreeCard';
import DashboardHero from '../../components/employee/DashboardHero';
import EcoPointsRewardCard from '../../components/employee/EcoPointsRewardCard';
import TodayScheduleStatusCard from '../../components/employee/TodayScheduleStatusCard';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
import { usePoints } from '../../hooks/usePoints';
import { useRoutes } from '../../hooks/useRoutes';
import { useSchedule } from '../../hooks/useSchedule';

export default function EmployeeDashboard() {
  const [preference, setPreference] = useState('eco');
  const { recommended } = useRoutes(preference);
  const schedule = useSchedule();
  const points = usePoints();

  if (recommended.isLoading || schedule.isLoading || points.isLoading) return <LoadingState />;
  if (recommended.isError || schedule.isError || points.isError) {
    return (
      <ErrorState
        onRetry={() => {
          recommended.refetch();
          schedule.refetch();
          points.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHero
        carbonToday={recommended.data.carbonSavedTodayKg}
        pointsToday={points.data.pointsEarnedToday}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CarbonTreeCard
          carbonSaved={points.data.carbonSavedKg}
          goal={points.data.carbonGoalKg}
        />
        <div className="space-y-6">
          {/* Suggested Route Selector Card */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">Suggested Commute</h3>
                <p className="text-xs font-semibold text-slate-500">Based on your home to office route</p>
              </div>
              <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
                <button
                  onClick={() => setPreference('eco')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                    preference === 'eco'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Leaf size={14} />
                  Eco-Friendly
                </button>
                <button
                  onClick={() => setPreference('speed')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                    preference === 'speed'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Zap size={14} />
                  Speed
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-secondary dark:text-emerald-400">
                    Recommended Route
                  </p>
                  <h4 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                    {recommended.data.name}
                  </h4>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-2.5 text-white">
                  <RouteIcon size={22} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-950">
                  <Clock size={16} className="text-secondary dark:text-emerald-400" />
                  <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Duration</p>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{recommended.data.travelTime}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-950">
                  <Leaf size={16} className="text-secondary dark:text-emerald-400" />
                  <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">CO₂ Saved</p>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{recommended.data.carbonSaved}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-950">
                  <Zap size={16} className="text-secondary dark:text-emerald-400" />
                  <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Confidence</p>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{recommended.data.confidence}</p>
                </div>
              </div>
            </div>
          </section>

          <TodayScheduleStatusCard schedule={{ ...schedule.data, recommendedRoute: recommended.data.name }} />
        </div>
      </section>

      <EcoPointsRewardCard points={points.data} />
    </div>
  );
}

