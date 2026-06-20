export default function DashboardCard({
  title,
  value,
  icon: Icon,
  children,
  accent = false,
  className = '',
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-soft ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && (
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {title}
            </p>
          )}
          {value && <h3 className="mt-2 text-2xl font-bold text-slate-950">{value}</h3>}
        </div>
        {Icon && (
          <div
            className={`rounded-xl p-3 ${
              accent
                ? 'bg-gradient-to-br from-primary to-secondary text-white'
                : 'bg-emerald-50 text-secondary'
            }`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
