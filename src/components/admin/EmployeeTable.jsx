import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

const filters = ['All', 'Office', 'WFH', 'Active', 'Inactive'];

export default function EmployeeTable({ employees }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesQuery = `${employee.id} ${employee.name} ${employee.department}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter =
        filter === 'All' || employee.workMode === filter || employee.status === filter;

      return matchesQuery && matchesFilter;
    });
  }, [employees, filter, query]);

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 lg:w-80">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search employees"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                filter === item
                  ? 'bg-secondary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-secondary'
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="py-3 font-bold">Employee ID</th>
              <th className="py-3 font-bold">Name</th>
              <th className="py-3 font-bold">Department</th>
              <th className="py-3 font-bold">Work Mode</th>
              <th className="py-3 font-bold">Carbon Credits</th>
              <th className="py-3 font-bold">Status</th>
              <th className="py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-slate-50">
                <td className="py-4 font-bold text-slate-950">{employee.id}</td>
                <td className="py-4 text-slate-700">{employee.name}</td>
                <td className="py-4 text-slate-700">{employee.department}</td>
                <td className="py-4 text-slate-700">{employee.workMode}</td>
                <td className="py-4 text-slate-700">{employee.credits}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      employee.status === 'Active'
                        ? 'bg-emerald-50 text-secondary'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-600">
                      View
                    </button>
                    <button className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-secondary">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
