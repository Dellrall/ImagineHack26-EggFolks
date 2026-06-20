import { Link } from '@tanstack/react-router';
import { Award, Bus, Coins, Footprints, Leaf, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { carbonSummary, employee, todaysRoute } from '../data/mockData';

export default function DashboardHome() {
  const progress = Math.round((carbonSummary.credits / carbonSummary.rewardTarget) * 100);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-emerald-700 p-6 text-white shadow-soft md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
            Sustainable commute plan
          </p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Welcome Back, {employee.name.split(' ')[0]}!
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Department</p>
              <p className="mt-1 text-lg font-bold">{employee.department}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Today's Mode</p>
              <p className="mt-1 text-lg font-bold">{employee.todaysMode}</p>
            </div>
          </div>
        </div>

        <DashboardCard title="Today's Eco Route" icon={Bus} accent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Recommended Route</p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {todaysRoute.recommendation}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Travel Time</p>
                <p className="font-bold text-slate-950">{todaysRoute.travelTime}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-slate-500">Carbon Saved</p>
                <p className="font-bold text-secondary">{todaysRoute.carbonSaved}</p>
              </div>
            </div>
            <Link
              to="/routes"
              className="inline-flex w-full justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
            >
              View Full Route
            </Link>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="CO₂ Saved" value={carbonSummary.savedThisMonth} icon={Leaf} />
        <DashboardCard title="Eco Trips" value={String(carbonSummary.ecoTrips)} icon={Footprints} />
        <DashboardCard title="Credits" value={String(carbonSummary.credits)} icon={Coins} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <DashboardCard title="Employee Reward Progress" icon={Award}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-black text-slate-950">
                {carbonSummary.credits} / {carbonSummary.rewardTarget} Credits
              </p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-secondary">
                {progress}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500">Reward: {carbonSummary.nextReward}</p>
          </div>
        </DashboardCard>

        <DashboardCard title="Carbon Impact Summary" icon={TrendingUp} className="bg-slate-950 text-white">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-300">Monthly Saved</p>
              <p className="mt-1 text-2xl font-black text-white">
                {carbonSummary.savedThisMonth}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Eco Trips</p>
              <p className="mt-1 text-2xl font-black text-white">{carbonSummary.ecoTrips}</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Credits Earned</p>
              <p className="mt-1 text-2xl font-black text-white">{carbonSummary.credits}</p>
            </div>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
