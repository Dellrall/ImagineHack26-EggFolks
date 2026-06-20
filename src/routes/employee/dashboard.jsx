import CarbonTreeCard from '../../components/employee/CarbonTreeCard';
import DashboardHero from '../../components/employee/DashboardHero';
import EcoPointsRewardCard from '../../components/employee/EcoPointsRewardCard';
import TodayScheduleStatusCard from '../../components/employee/TodayScheduleStatusCard';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
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
      <DashboardHero carbonToday={recommended.data.carbonSavedTodayKg} pointsToday={120} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CarbonTreeCard
          carbonSaved={points.data.carbonSavedKg}
          goal={points.data.carbonGoalKg}
        />
        <div className="space-y-6">
          <TodayScheduleStatusCard schedule={schedule.data} />
          <article className="rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              Recent Notifications
            </h2>
            <div className="mt-5 space-y-3">
              {recentNotifications.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-slate-700 dark:bg-emerald-950/30 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <EcoPointsRewardCard points={points.data} />
    </div>
  );
}
