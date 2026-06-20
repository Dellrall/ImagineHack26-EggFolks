export default function ChartCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-5 h-72">{children}</div>
    </section>
  );
}
