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
          <TodayScheduleStatusCard schedule={schedule.data} />
        </div>
      </section>

      <EcoPointsRewardCard points={points.data} />
    </div>
  );
}
