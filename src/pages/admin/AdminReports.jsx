import ReportCard from '../../components/admin/ReportCard';
import { reports } from '../../data/adminMockData';

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">Reports</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Downloadable Reports</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
