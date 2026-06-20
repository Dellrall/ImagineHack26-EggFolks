import { motion } from 'framer-motion';

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
  if (carbonSaved >= 75) return { icon: '🌳', label: 'Carbon Champion' };
  if (carbonSaved >= 35) return { icon: '🌿', label: 'Green Commuter' };
  return { icon: '🌱', label: 'Eco Beginner' };
}

export default function CarbonTreeCard({ carbonSaved, goal }) {
  const progress = Math.min(100, Math.round((carbonSaved / goal) * 100));
  const badge = getBadge(carbonSaved);
  const canopyScale = 0.65 + progress / 250;
  const greenOpacity = progress / 100;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <motion.div
          whileHover={{ y: -8, scale: 1.03 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative mx-auto h-72 w-full max-w-sm rounded-3xl bg-gradient-to-b from-emerald-50 to-slate-50 p-6 dark:from-emerald-950/30 dark:to-slate-950"
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
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
              className={`absolute z-20 rounded-[999px_999px_999px_0] bg-emerald-500 shadow-sm ${classes}`}
            />
          ))}
        </motion.div>

        <div className="flex-1">
          <p className="text-sm font-black uppercase tracking-wide text-secondary">
            Carbon Saved Visualization
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
            Your tree is growing
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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
          <div className="mt-6 flex flex-wrap gap-2">
            {['Eco Beginner', 'Green Commuter', 'Carbon Champion'].map((label) => {
              const active = badge.label === label;
              return (
                <span
                  key={label}
                  className={`rounded-full px-3 py-2 text-sm font-black ${
                    active
                      ? 'bg-emerald-100 text-secondary dark:bg-emerald-950/60'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                >
                  {label === 'Eco Beginner' ? '🌱' : label === 'Green Commuter' ? '🌿' : '🌳'} {label}
                </span>
              );
            })}
          </div>
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
