import { getCurrentUser } from '../../lib/auth';

export default function EmployeeProfileRoute() {
  const employee = getCurrentUser();

  return (
    <section className="max-w-3xl overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <h2 className="text-3xl font-black">{employee.name}</h2>
        <p className="mt-1 text-emerald-100">{employee.department} Department</p>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        {[
          ['Employee Name', employee.name],
          ['Department', employee.department],
          ['Email', employee.email],
          ['Home Location', employee.homeLocation],
          ['Preferred Transport', employee.preferredTransport],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-1 font-black text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="px-6 pb-6">
        <button className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white">
          Edit Profile
        </button>
      </div>
    </section>
  );
}
