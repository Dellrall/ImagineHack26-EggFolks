export default function EmptyState({ title = 'No data found' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900">
      {title}
    </div>
  );
}
