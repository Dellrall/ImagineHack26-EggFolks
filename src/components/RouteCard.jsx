import { Clock, Leaf, Route, Sparkles } from 'lucide-react';

export default function RouteCard({ route }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{route.name}</h3>
          <p className="mt-1 text-sm font-medium text-secondary">{route.transportType}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-secondary">
          <Route size={22} />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <Clock size={18} className="text-slate-400" />
          <span>{route.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <Leaf size={18} className="text-primary" />
          <span>{route.carbonSaved}</span>
        </div>
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-amber-500" />
          <span>{route.comfortScore} Comfort</span>
        </div>
      </dl>
      <button className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary">
        Select Route
      </button>
    </article>
  );
}
