import { Brain } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-emerald-50 p-3 text-secondary">
          <Brain size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-950">{recommendation.title}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-700">{recommendation.action}</p>
          <p className="mt-1 text-sm text-slate-500">{recommendation.impact}</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-500">Confidence Score</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-secondary">
              {recommendation.confidence}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
