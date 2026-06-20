import { Mail, Pencil, TrainFront, Users } from 'lucide-react';
import { employee } from '../data/mockData';

export default function EmployeeProfile() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-black">
                {employee.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div>
                <h2 className="text-3xl font-black">{employee.name}</h2>
                <p className="text-emerald-100">{employee.department} Department</p>
              </div>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-secondary">
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <ProfileRow icon={Mail} label="Email" value={employee.email} />
          <ProfileRow icon={Users} label="Department" value={employee.department} />
          <ProfileRow icon={TrainFront} label="Preferred Transport" value={employee.preferredTransport} />
        </div>
      </section>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-secondary">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="truncate font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}
