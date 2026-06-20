import { Coins } from 'lucide-react';
import RewardCard from '../components/RewardCard';
import { carbonSummary, rewards } from '../data/mockData';

export default function CarbonCredits() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-900 p-6 text-white shadow-soft md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">
              Current Credits
            </p>
            <h2 className="mt-2 text-4xl font-black">{carbonSummary.credits} Credits</h2>
          </div>
          <div className="w-fit rounded-2xl bg-white/10 p-4">
            <Coins size={34} />
          </div>
        </div>
      </section>

      <div>
        <h3 className="text-2xl font-black text-slate-950">Rewards List</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </div>
    </div>
  );
}
