const toneStyles = {
  red: 'bg-red-50 text-danger border-red-100',
  yellow: 'bg-amber-50 text-warning border-amber-100',
  green: 'bg-emerald-50 text-success border-emerald-100',
  blue: 'bg-sky-50 text-sky-600 border-sky-100',
};

export default function NotificationItem({ notification }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-slate-950">{notification.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase ${
            toneStyles[notification.tone]
          }`}
        >
          {notification.tone}
        </span>
      </div>
    </article>
  );
}
