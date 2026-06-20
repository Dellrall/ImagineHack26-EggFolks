import StatCard from '../shared/StatCard';
import { adminKpis } from '../../data/adminData';

export default function OverviewStats() {
  // Assuming the first KPI in your data is the Carbon Saved. 
  // If not, you can hardcode the specific data extraction here.
  const mainKpi = adminKpis[0]; 
  const secondaryKpis = adminKpis.slice(1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-xl font-black text-slate-950 dark:text-white">
        
      </h2>

      {/* The Glowing Hero Metric */}
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] dark:bg-emerald-950/40 dark:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
          
          {/* Subtle inner pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-emerald-400 opacity-20"></div>
          
          <div className="flex flex-col items-center">
            {/* Inline Leaf SVG for immediate use */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mb-1 text-emerald-600 dark:text-emerald-400"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {mainKpi?.value || '2,450'}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-500/70">
              Kg CO₂
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {mainKpi?.label || 'Total Carbon Saved'}
        </h3>
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
          ↑ 12% from last month
        </p>
      </div>

      <hr className="my-6 border-slate-100 dark:border-slate-800" />

      {/* Compact Secondary Metrics */}
      <div className="space-y-3">
        {secondaryKpis.map((kpi) => (
          <div 
            key={kpi.label} 
            className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
          >
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {kpi.label}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
}