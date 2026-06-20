export default function AdminReportCard({ report }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-black text-slate-950 dark:text-white">{report.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{report.description}</p>
      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          View
        </button>
        <button className="flex-1 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white">
          Export
        </button>
      </div>
    </article>
  );
}
