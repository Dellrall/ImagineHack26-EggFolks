import { Gift } from 'lucide-react';

export default function RewardCard({ reward }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-emerald-50 p-3 text-secondary">
          <Gift size={22} />
        </div>
        <div>
          <h3 className="font-bold text-slate-950">{reward.title}</h3>
          <p className="text-sm text-slate-500">{reward.credits} Credits</p>
        </div>
      </div>
      <button className="mt-5 w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-secondary transition hover:border-secondary hover:bg-emerald-50">
        Redeem
      </button>
    </article>
  );
}
