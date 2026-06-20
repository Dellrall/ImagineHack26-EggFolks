import { AlertTriangle, Bell, CheckCircle2 } from 'lucide-react';

const toneStyles = {
  green: {
    wrapper: 'border-emerald-100 bg-emerald-50/70',
    badge: 'bg-emerald-100 text-secondary',
    icon: CheckCircle2,
  },
  yellow: {
    wrapper: 'border-amber-100 bg-amber-50/70',
    badge: 'bg-amber-100 text-amber-700',
    icon: Bell,
  },
  red: {
    wrapper: 'border-rose-100 bg-rose-50/70',
    badge: 'bg-rose-100 text-rose-700',
    icon: AlertTriangle,
  },
};

export default function NotificationCard({ notification }) {
  const tone = toneStyles[notification.tone] ?? toneStyles.green;
  const Icon = tone.icon;

  return (
    <article className={`rounded-2xl border p-5 ${tone.wrapper}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className={`h-fit rounded-xl p-3 ${tone.badge}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-950">{notification.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{notification.detail}</p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${tone.badge}`}>
          {notification.tone}
        </span>
      </div>
    </article>
  );
}
