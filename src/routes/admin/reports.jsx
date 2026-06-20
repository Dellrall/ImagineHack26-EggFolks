import { CheckCircle2, Download, FileText } from 'lucide-react';
import AdminReportCard from '../../components/admin/AdminReportCard';
import { reportCards } from '../../data/adminData';

export default function AdminReports() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-12 align-top">
      
      {/* LEFT COLUMN: The Report Generators */}
      <div className="space-y-6 lg:col-span-8 xl:col-span-9">
        <div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">System Reports</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Generate and export granular data for ESG compliance and payroll.
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reportCards.map((report) => (
            <AdminReportCard key={report.title} report={report} />
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: The Glowing Compliance Hero */}
      <div className="lg:col-span-4 xl:col-span-3">
        <section className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-6 text-xl font-black text-slate-950 dark:text-white">
            Audit Health
          </h2>

          {/* Glowing Hero Metric */}
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full border-4 border-blue-500 bg-blue-50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] dark:bg-blue-950/40 dark:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
              
              {/* Pulse ring */}
              <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-20"></div>
              
              <div className="flex flex-col items-center">
                <CheckCircle2 size={28} className="mb-1 text-blue-600 dark:text-blue-400" />
                <span className="text-3xl font-black text-blue-700 dark:text-blue-400">
                  100<span className="text-xl">%</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-500/70">
                  Compliant
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Data Integrity
            </h3>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              All logs synced & ready for audit
            </p>
          </div>

          <hr className="my-6 border-slate-100 dark:border-slate-800" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              <Download size={18} />
              Export Master Log (.CSV)
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <FileText size={18} />
              View Legal Summary
            </button>
          </div>
        </section>
      </div>
      
    </div>
  );
}