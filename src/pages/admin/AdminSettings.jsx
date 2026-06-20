const settingsSections = [
  'Company Profile',
  'Carbon Goals',
  'Workspace Policies',
  'Notification Preferences',
  'System Preferences',
];

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">Settings</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Platform Configuration</h2>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        {settingsSections.map((section) => (
          <article key={section} className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
            <h3 className="font-black text-slate-950">{section}</h3>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-600">Primary Setting</span>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-4 focus:ring-emerald-100"
                  defaultValue="Enabled"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <span className="text-sm font-bold text-slate-600">Auto optimization</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-secondary" />
              </label>
            </div>
          </article>
        ))}
      </section>

      <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100">
        Save Changes
      </button>
    </div>
  );
}
