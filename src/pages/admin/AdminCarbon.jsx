import {
  Area,
  AreaChart,
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
import ChartCard from '../../components/admin/ChartCard';
import KpiCard from '../../components/admin/KpiCard';
import {
  carbonMetrics,
  departmentContribution,
  monthlyCarbon,
  topEcoEmployees,
  weeklyCarbon,
} from '../../data/adminMockData';

const colors = ['#22C55E', '#16A34A', '#10B981', '#F59E0B', '#38BDF8'];

export default function AdminCarbon() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Carbon Analytics
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Sustainability Performance</h2>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {carbonMetrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Monthly Carbon Saved">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyCarbon}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="carbon" stroke="#16A34A" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Carbon Saved">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyCarbon}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="carbon" stroke="#22C55E" fill="#BBF7D0" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Carbon Contribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={departmentContribution} dataKey="value" nameKey="name" outerRadius={95} label>
                {departmentContribution.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Eco Employees">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEcoEmployees}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="credits" fill="#16A34A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}
