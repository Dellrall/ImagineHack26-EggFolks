import { FileText } from 'lucide-react';

export default function ReportCard({ report }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="rounded-xl bg-emerald-50 p-3 text-secondary w-fit">
        <FileText size={24} />
      </div>
      <h3 className="mt-5 font-black text-slate-950">{report.title}</h3>
      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white">
          Download
        </button>
        <button className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
          View
        </button>
      </div>
    </article>
  );
}
