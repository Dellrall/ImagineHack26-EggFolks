import { motion } from 'framer-motion';
import { Building2, Home, RefreshCw } from 'lucide-react';

const statusMap = {
  Office: {
    label: 'OFFICE DAY',
    icon: Building2,
    badge: 'bg-emerald-100 text-secondary dark:bg-emerald-950/60',
  },
  WFH: {
    label: 'WORK FROM HOME',
    icon: Home,
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  },
  Hybrid: {
    label: 'HYBRID DAY',
    icon: RefreshCw,
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
};

export default function TodayScheduleStatusCard({ schedule }) {
  const status = statusMap[schedule.today] ?? statusMap.Office;
  const Icon = status.icon;
  const isWfh = schedule.today === 'WFH';
  const isHybrid = schedule.today === 'Hybrid';
  const details = isWfh
    ? [
        { label: 'Online Start', value: schedule.onlineStartTime },
        { label: 'Work Hours', value: schedule.wfhHours },
        { label: 'Commute', value: 'Not required' },
      ]
    : isHybrid
      ? [
          { label: 'Office Hours', value: schedule.officeHours },
          { label: 'WFH Hours', value: schedule.wfhHours },
          { label: 'Route', value: schedule.recommendedRoute },
        ]
      : [
          { label: 'Arrival', value: schedule.arrivalTime },
          { label: 'Leave Home', value: schedule.suggestedDepartureTime },
          { label: 'Route', value: schedule.recommendedRoute },
        ];

  return (
    <motion.section
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl p-4 ${status.badge}`}>
            <Icon size={30} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">Today's Status</p>
            <h2 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{status.label}</h2>
          </div>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-black ${status.badge}`}>
          {schedule.location}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {details.map((item) => (
          <Info key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      {isWfh && (
        <p className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
          No transport route is needed today because your schedule is fully remote.
        </p>
      )}
    </motion.section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{value ?? '-'}</p>
    </div>
  );
}
