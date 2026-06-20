import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminChartCard from '../../components/admin/AdminChartCard';
import StatCard from '../../components/shared/StatCard';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
import { adminKpis } from '../../data/adminData';
import { useCarbonStats } from '../../hooks/useCarbonStats';
import { useSatisfactionStats } from '../../hooks/useSatisfactionStats';
import { useTardinessStats } from '../../hooks/useTardinessStats';

const colors = ['#22C55E', '#16A34A', '#10B981', '#F59E0B', '#38BDF8'];

export default function AdminOverview() {
  const carbon = useCarbonStats();
  const tardiness = useTardinessStats();
  const satisfaction = useSatisfactionStats();

  if (carbon.isLoading || tardiness.isLoading || satisfaction.isLoading) return <LoadingState />;
  if (carbon.isError || tardiness.isError || satisfaction.isError) {
    return <ErrorState onRetry={() => { carbon.refetch(); tardiness.refetch(); satisfaction.refetch(); }} />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {adminKpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <AdminChartCard title="Carbon Saved Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={carbon.data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Gridlock Hours Avoided">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tardiness.data.weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Satisfaction by Department">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={satisfaction.data.departments} dataKey="value" nameKey="name" outerRadius={95} label>
                {satisfaction.data.departments.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </section>
    </div>
  );
}
