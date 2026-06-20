import Table from '../../components/shared/Table';
import { adminEmployees } from '../../data/adminData';

const columns = [
  { key: 'id', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'carbonSaved', label: 'Carbon Saved' },
  { key: 'ecoPoints', label: 'Eco Points' },
  { key: 'satisfaction', label: 'Satisfaction' },
  { key: 'tardiness', label: 'Tardiness' },
];

export default function AdminEmployees() {
  return (
    <Table
      columns={columns}
      rows={adminEmployees}
      renderActions={() => (
        <div className="flex gap-2">
          <button className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">View</button>
          <button className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-secondary dark:bg-emerald-950/40">Edit</button>
        </div>
      )}
    />
  );
}
