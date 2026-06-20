export default function ErrorState({ title = 'Something went wrong', onRetry }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
      <p className="font-black text-danger">{title}</p>
      {onRetry && (
        <button className="mt-4 rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
