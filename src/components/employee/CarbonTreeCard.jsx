import { motion } from 'framer-motion';
import { Leaf, Sprout, TreePine } from 'lucide-react';

const leafPositions = [
  ['left-1/2 top-8 h-5 w-8 -translate-x-1/2', 10],
  ['left-[42%] top-14 h-4 w-7', 25],
  ['left-[55%] top-14 h-4 w-7', 25],
  ['left-[34%] top-20 h-5 w-8', 50],
  ['left-[62%] top-20 h-5 w-8', 50],
  ['left-[27%] top-28 h-5 w-8', 75],
  ['left-[69%] top-28 h-5 w-8', 75],
  ['left-[44%] top-3 h-4 w-7', 90],
  ['left-[58%] top-4 h-4 w-7', 90],
];

function getBadge(carbonSaved) {
  if (carbonSaved >= 75) return { icon: TreePine, label: 'Carbon Champion', next: 'Goal complete' };
  if (carbonSaved >= 35) return { icon: Leaf, label: 'Green Commuter', next: '30kg to Carbon Champion' };
  return { icon: Sprout, label: 'Eco Beginner', next: '35kg to Green Commuter' };
}

export default function CarbonTreeCard({ carbonSaved, goal }) {
  const progress = Math.min(100, Math.round((carbonSaved / goal) * 100));
  const badge = getBadge(carbonSaved);
  const BadgeIcon = badge.icon;
  const canopyScale = 0.65 + progress / 250;
  const greenOpacity = progress / 100;
  const remaining = Math.max(0, goal - carbonSaved);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          whileHover={{ y: -8, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50 to-slate-50 p-5 dark:from-emerald-950/30 dark:to-slate-950"
        >
          <motion.div
            animate={{ scale: canopyScale }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute left-1/2 top-8 h-36 w-44 -translate-x-1/2 rounded-full bg-slate-300/60 blur-sm dark:bg-slate-700/60"
          />
          <motion.div
            animate={{ opacity: greenOpacity, scale: canopyScale }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute left-1/2 top-8 h-36 w-44 -translate-x-1/2 rounded-full bg-emerald-400/70 blur-sm"
          />

          <svg viewBox="0 0 220 240" className="relative z-10 h-full w-full">
            <motion.path
              d="M110 215 C110 168 106 130 110 92"
              className="fill-none stroke-slate-500 dark:stroke-slate-500"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.path
              d="M110 132 C82 112 64 94 48 62"
              className="fill-none stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <motion.path
              d="M111 126 C142 104 160 82 176 48"
              className="fill-none stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <motion.path
              d="M111 156 C144 150 166 138 190 116"
              className="fill-none stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <motion.path
              d="M110 158 C82 152 60 140 36 118"
              className="fill-none stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <motion.ellipse cx="110" cy="226" rx="70" ry="10" className="fill-emerald-900/10" />
          </svg>

          {leafPositions.map(([classes, threshold], index) => (
            <motion.span
              key={`${classes}-${index}`}
              animate={{
                opacity: progress >= threshold ? 1 : 0,
                rotate: progress >= threshold ? [-2, 3, -2] : 0,
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.12,
              }}
              className={`absolute z-20 rounded-[999px_999px_999px_0] bg-emerald-500 shadow-sm ${classes}`}
            />
          ))}
        </motion.div>

        <div className="flex min-w-0 flex-col">
          <p className="text-sm font-black uppercase tracking-wide text-secondary">
            Carbon Saved Visualization
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">
                Your tree is growing
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Cleaner commutes add leaves and expand your monthly carbon tree.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-secondary dark:bg-emerald-950/60">
              <BadgeIcon size={20} />
              <span className="text-sm font-black">{badge.label}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Carbon Saved" value={`${carbonSaved}kg`} />
            <Metric label="Goal" value={`${goal}kg`} />
            <Metric label="Progress" value={`${progress}%`} />
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="mt-4 text-sm font-bold text-slate-500">
            {remaining}kg left to complete this month's goal.
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
