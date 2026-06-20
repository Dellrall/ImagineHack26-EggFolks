import KpiCard from '../../components/admin/KpiCard';
import { heatmapSeats, workspaceStats } from '../../data/adminMockData';

const seatStyles = {
  available: 'bg-success',
  moderate: 'bg-warning',
  crowded: 'bg-danger',
};

export default function AdminWorkspace() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Workspace Management
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Office Utilization</h2>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {workspaceStats.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-black text-slate-950">Workspace Heatmap</h3>
          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
            <span>Green Available</span>
            <span>Yellow Moderate</span>
            <span>Red Crowded</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {heatmapSeats.map((seat, index) => (
            <div
              key={`${seat}-${index}`}
              className={`aspect-square rounded-xl ${seatStyles[seat]} shadow-sm`}
              title={seat}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
