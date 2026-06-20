import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth';

export default function DashboardHero({ carbonToday, pointsToday }) {
  const user = getCurrentUser();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  })();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-white shadow-soft dark:border-emerald-800 md:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            {greeting}, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-emerald-50 md:text-lg">
            Every eco-friendly commute helps grow a greener future.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <Leaf size={22} className="text-emerald-100" />
              <p className="text-sm font-bold text-emerald-100">Today's Carbon Impact</p>
            </div>
            <p className="mt-2 text-2xl font-black">+{carbonToday}kg CO₂ Saved</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={22} className="text-yellow-100" />
              <p className="text-sm font-bold text-emerald-100">Today's Eco Points</p>
            </div>
            <p className="mt-2 text-2xl font-black">+{pointsToday}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
