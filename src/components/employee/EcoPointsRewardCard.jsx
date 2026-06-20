import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useEffect } from 'react';

export default function EcoPointsRewardCard({ points }) {
  const reward = points.nearestReward;
  const remaining = Math.max(0, reward.pointsRequired - points.balance);
  const progress = Math.min(100, Math.round((points.balance / reward.pointsRequired) * 100));
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (value) => Math.round(value).toLocaleString());

  useEffect(() => {
    count.set(points.balance);
  }, [count, points.balance]);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <article className="rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 28px rgba(34,197,94,0.45)', '0 0 0 rgba(34,197,94,0)'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-4 text-white"
          >
            <Trophy size={30} />
          </motion.div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-secondary">Eco Points Balance</p>
            <p className="mt-1 text-4xl font-black text-slate-950 dark:text-white">
              🏆 <motion.span>{rounded}</motion.span> Points
            </p>
          </div>
        </div>

        <p className="mt-6 text-lg font-bold text-slate-700 dark:text-slate-200">
          Only {remaining} points away from {reward.title}
        </p>
        <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-primary to-secondary"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm font-bold text-slate-500">
          <span>{points.balance} / {reward.pointsRequired}</span>
          <span>Reward: {reward.title}</span>
        </div>
      </article>

      <motion.article
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"
      >
        <img src={reward.image} alt="" className="h-40 w-full object-cover" />
        <div className="p-5">
          <p className="text-sm font-black uppercase tracking-wide text-secondary">Next Reward</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{reward.title}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {remaining} points remaining
          </p>
          <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-slate-700 dark:bg-emerald-950/30 dark:text-slate-200">
            Keep choosing eco routes to unlock your reward!
          </p>
        </div>
      </motion.article>
    </section>
  );
}
