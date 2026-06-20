import AdminReportCard from '../../components/admin/AdminReportCard';
import { reportCards } from '../../data/adminData';

export default function AdminReports() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {reportCards.map((report) => (
        <AdminReportCard key={report.title} report={report} />
      ))}
    </div>
  );
}
