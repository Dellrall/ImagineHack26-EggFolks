import { useState } from 'react';
import OverviewStats from '../../components/admin/OverviewStats.jsx';
import OverviewCharts from '../../components/admin/OverviewCharts.jsx';
import AdminSchedules from '../../components/admin/AdminSchedules.jsx';
import AdminEmployees from '../../components/admin/AdminEmployees.jsx';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('schedules');

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-12 align-top">
      
      {/* LEFT/MAIN COLUMN: Insights and Management */}
      <div className="space-y-6 lg:col-span-8 xl:col-span-9">
        
        {/* INSIGHTS: Charts */}
        <section>
          <OverviewCharts />
        </section>

        {/* MANAGEMENT SANDBOX: Tabbed Interface */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex space-x-6 border-b border-slate-100 px-6 pt-4 dark:border-slate-800">
            <button 
              className={`pb-3 font-bold transition-colors ${
                activeTab === 'schedules' 
                  ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('schedules')}
            >
              WFH Management
            </button>
            <button 
              className={`pb-3 font-bold transition-colors ${
                activeTab === 'employees' 
                  ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('employees')}
            >
              Employee Directory
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'schedules' ? <AdminSchedules /> : <AdminEmployees />}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: The Sticky System Overview */}
      <div className="lg:col-span-4 xl:col-span-3">
        <section className="sticky top-6">
          <OverviewStats />
        </section>
      </div>

    </div>
  );
}