import { useMemo, useState } from 'react';
import FilterDropdown from '../shared/FilterDropdown';
import SearchBar from '../shared/SearchBar';
import Table from '../shared/Table';
import { adminSchedules } from '../../data/adminData';

const columns = [
  { key: 'employee', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
];

export default function AdminSchedules() {
  const [department, setDepartment] = useState('All');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    return adminSchedules
      .map((row, index) => ({ id: `${row.employee}-${index}`, ...row }))
      .filter((row) => {
        const matchesDepartment = department === 'All' || row.department === department;
        const matchesSearch = row.employee.toLowerCase().includes(query.toLowerCase());
        return matchesDepartment && matchesSearch;
      });
  }, [department, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">WFH Management</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchBar value={query} onChange={setQuery} placeholder="Search employees" />
          <FilterDropdown value={department} onChange={setDepartment} options={['All', 'IT', 'Marketing', 'Finance', 'HR']} />
        </div>
      </section>
      <Table
        columns={columns}
        rows={rows}
        renderActions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-secondary dark:bg-emerald-950/40">Assign WFH</button>
            <button className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">Edit Schedule</button>
          </div>
        )}
      />
    </div>
  );
}