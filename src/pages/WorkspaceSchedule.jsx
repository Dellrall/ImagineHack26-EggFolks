import { Briefcase, Home } from 'lucide-react';
import { workspaceSchedule } from '../data/mockData';

export default function WorkspaceSchedule() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Workspace Schedule
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Upcoming Schedule</h2>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {workspaceSchedule.map((item) => {
          const isOffice = item.mode === 'Office';
          const Icon = isOffice ? Briefcase : Home;

          return (
            <article key={item.day} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                  isOffice ? 'bg-emerald-50 text-secondary' : 'bg-sky-50 text-sky-600'
                }`}
              >
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-950">{item.day}</h3>
              <p className={`mt-1 font-bold ${isOffice ? 'text-secondary' : 'text-sky-600'}`}>
                {item.mode}
              </p>
              <p className="mt-3 text-sm text-slate-500">{item.focus}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
