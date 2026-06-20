import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminChartCard from './AdminChartCard';
import ErrorState from '../shared/ErrorState';
import LoadingState from '../shared/LoadingState';
import { useCarbonStats } from '../../hooks/useCarbonStats';
import { useTardinessStats } from '../../hooks/useTardinessStats';

export default function OverviewCharts() {
  const carbon = useCarbonStats();
  const tardiness = useTardinessStats();

  if (carbon.isLoading || tardiness.isLoading) return <LoadingState />;
  if (carbon.isError || tardiness.isError) {
    return <ErrorState onRetry={() => { carbon.refetch(); tardiness.refetch(); }} />;
  }

  // Notice we dropped the pie chart to keep the UI compact and focused on positive growth
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AdminChartCard title="Total Carbon Saved Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={carbon.data.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </AdminChartCard>

      <AdminChartCard title="Gridlock Hours Avoided">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tardiness.data.weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="value" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </AdminChartCard>
    </div>
  );
}