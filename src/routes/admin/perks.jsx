import { Edit2, Gift, Plus, Trash2, TrendingUp, Trophy, Users, Zap } from 'lucide-react';

// Mock Data
const activeMultipliers = [
  { id: 1, title: 'Rainy Day Transit', rule: '3x Points for Public Transit on Rainy Days', status: 'Active' },
  { id: 2, title: 'Cross-Department Carpool', rule: '+500 Flat Bonus for mixing departments', status: 'Active' },
];

const rewardsCatalog = [
  { id: 101, name: '$50 Coffee Shop Gift Card', cost: 5000, stock: 45 },
  { id: 102, name: 'Extra 1/2 PTO Day', cost: 15000, stock: 'Unlimited' },
  { id: 103, name: 'Premium Parking Spot (1 Week)', cost: 8000, stock: 2 },
];

export default function AdminPerks() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-12 align-top">
      
      {/* LEFT COLUMN: Engine & Catalog */}
      <div className="space-y-6 lg:col-span-8 xl:col-span-9">
        <div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Gamification Control Center</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage point multipliers and the rewards catalog to drive eco-friendly behavior.
          </p>
        </div>
        
        {/* Rules Engine / Multipliers */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-amber-500" /> Active Multipliers
            </h2>
            <button className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20">
              <Plus size={16} /> New Rule
            </button>
          </div>
          <div className="p-5 space-y-3">
            {activeMultipliers.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{rule.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{rule.rule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Active</span>
                  <button className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rewards Catalog */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
           <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift size={20} className="text-blue-500" /> Rewards Catalog
            </h2>
            <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="overflow-hidden overflow-x-auto rounded-b-xl">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Item Name</th>
                  <th className="px-5 py-3">Cost (Pts)</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rewardsCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{item.name}</td>
                    <td className="px-5 py-3 font-bold text-amber-500 dark:text-amber-400">{item.cost.toLocaleString()}</td>
                    <td className="px-5 py-3">{item.stock}</td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button className="text-slate-400 hover:text-blue-500"><Edit2 size={16} /></button>
                      <button className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Economy Health & Leaderboard */}
      <div className="lg:col-span-4 xl:col-span-3">
        <section className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-6 text-xl font-black text-slate-950 dark:text-white">
            Economy Health
          </h2>

          {/* The Glowing Hero Metric */}
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full border-4 border-amber-500 bg-amber-50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] dark:bg-amber-950/40 dark:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
              
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-amber-400 opacity-20"></div>
              
              <div className="flex flex-col items-center">
                <Trophy size={28} className="mb-1 text-amber-600 dark:text-amber-400" />
                <span className="text-3xl font-black text-amber-700 dark:text-amber-400">
                  492
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600/70 dark:text-amber-500/70">
                  Active Users
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              High Engagement
            </h3>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-500">
              85% of workforce participating
            </p>
          </div>

          <hr className="my-6 border-slate-100 dark:border-slate-800" />

          {/* Secondary Economy Stats */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Zap size={16} className="text-amber-500" /> Circulation
              </span>
              <span className="font-bold text-slate-900 dark:text-white">1.2M</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Gift size={16} className="text-emerald-500" /> Redeemed
              </span>
              <span className="font-bold text-slate-900 dark:text-white">850K</span>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Top Earners</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Jenkins', dept: 'Engineering', pts: 24500 },
              { name: 'Michael Chen', dept: 'Marketing', pts: 21200 },
              { name: 'Aisha Patel', dept: 'Finance', pts: 19800 }
            ].map((user, idx) => (
              <div key={user.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.dept}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{user.pts.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}