export default function KpiCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-xl bg-emerald-50 p-3 text-secondary">
            <Icon size={22} />
          </div>
        )}
      </div>
    </article>
  );
}
