export default function OccupancyCard({ floor, occupancy }) {
  const tone =
    occupancy >= 80 ? 'bg-danger' : occupancy >= 55 ? 'bg-warning' : 'bg-success';

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-black text-slate-950">{floor}</h3>
        <span className="text-lg font-black text-slate-950">{occupancy}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${occupancy}%` }} />
      </div>
    </article>
  );
}
