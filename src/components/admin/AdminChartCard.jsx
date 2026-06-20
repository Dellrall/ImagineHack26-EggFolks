export default function AdminChartCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-5 h-72">{children}</div>
    </section>
  );
}
