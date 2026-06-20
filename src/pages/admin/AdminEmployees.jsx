import EmployeeTable from '../../components/admin/EmployeeTable';
import { employees } from '../../data/adminMockData';

export default function AdminEmployees() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Employee Management
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Employees</h2>
      </div>
      <EmployeeTable employees={employees} />
    </div>
  );
}
