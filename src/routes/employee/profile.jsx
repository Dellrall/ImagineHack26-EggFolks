import { useState } from 'react';
import { getCurrentUser, updateCurrentUser } from '../../lib/auth';
import { usePoints } from '../../hooks/usePoints';
import LoadingState from '../../components/shared/LoadingState';
import ErrorState from '../../components/shared/ErrorState';

export default function EmployeeProfileRoute() {
  const employee = getCurrentUser();
  const points = usePoints();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    preferredTransport: employee.preferredTransport,
    department: employee.department,
    homeLocation: employee.homeLocation,
  });
  const [errors, setErrors] = useState({});

  if (points.isLoading) return <LoadingState />;
  if (points.isError) return <ErrorState onRetry={points.refetch} />;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter email in a valid format (e.g. name@domain.com)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateCurrentUser(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
    window.location.reload();
  };

  const transportOptions = [
    'LRT + Walk',
    'Bus + Walk',
    'Bike + LRT',
    'Carpool',
    'Walking',
    'Cycling',
    'MRT',
    'LRT',
    'Bus',
    'Car Pool',
    'Private Car',
  ];

  return (
    <section className="max-w-3xl mx-auto overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <h2 className="text-3xl font-black">{employee.name}</h2>
        <p className="mt-1 text-emerald-100">{employee.department} Department</p>
      </div>

      {isEditing ? (
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1">Employee Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl border p-3 text-sm font-semibold outline-none bg-slate-50 dark:bg-slate-950 dark:text-white ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-secondary dark:border-slate-800'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 focus:border-secondary p-3 text-sm font-semibold outline-none bg-slate-50 dark:bg-slate-950 dark:text-white dark:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Home Location</label>
              <input
                type="text"
                value={formData.homeLocation}
                onChange={(e) => setFormData({ ...formData, homeLocation: e.target.value })}
                className="w-full rounded-xl border border-slate-200 focus:border-secondary p-3 text-sm font-semibold outline-none bg-slate-50 dark:bg-slate-950 dark:text-white dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1">Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-xl border p-3 text-sm font-semibold outline-none bg-slate-50 dark:bg-slate-950 dark:text-white ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-secondary dark:border-slate-800'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1">Preferred Transport</label>
            <select
              value={formData.preferredTransport}
              onChange={(e) => setFormData({ ...formData, preferredTransport: e.target.value })}
              className="w-full rounded-xl border border-slate-200 focus:border-secondary p-3 text-sm font-semibold outline-none bg-slate-50 dark:bg-slate-950 dark:text-white dark:border-slate-800"
            >
              {transportOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90 active:scale-95 shadow"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setFormData({
                  name: employee.name,
                  email: employee.email,
                  preferredTransport: employee.preferredTransport,
                  department: employee.department,
                  homeLocation: employee.homeLocation,
                });
                setErrors({});
                setIsEditing(false);
              }}
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {[
              ['Employee Name', employee.name],
              ['Department', employee.department],
              ['Email', employee.email],
              ['Home Location', employee.homeLocation],
              ['Preferred Transport', employee.preferredTransport],
              ['Eco Points', `${points.data?.balance ?? 0} Points`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-1 font-black text-slate-950 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90 active:scale-95 shadow"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </section>
  );
}

