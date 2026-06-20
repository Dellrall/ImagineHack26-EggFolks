export default function LoadingState({ label = 'Loading data...' }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 text-sm font-bold text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      {label}
    </div>
  );
}
