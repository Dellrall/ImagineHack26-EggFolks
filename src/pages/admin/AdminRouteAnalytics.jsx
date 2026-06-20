import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../../components/admin/ChartCard';
import KpiCard from '../../components/admin/KpiCard';
import { routeAnalytics, routeChartData } from '../../data/adminMockData';

export default function AdminRouteAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Route Analytics
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Commute Performance</h2>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Most Selected Route" value="Route A" />
        <KpiCard label="Average Travel Time" value="36 mins" />
        <KpiCard label="Average Carbon Reduction" value="2.2kg" />
        <KpiCard label="Route Satisfaction Score" value="4.5 / 5" />
      </section>

      <ChartCard title="Most Selected Routes">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={routeChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#22C55E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Route</th>
                <th className="px-5 py-4 font-bold">Usage Count</th>
                <th className="px-5 py-4 font-bold">Avg Time</th>
                <th className="px-5 py-4 font-bold">Carbon Saved</th>
                <th className="px-5 py-4 font-bold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {routeAnalytics.map((route) => (
                <tr key={route.route} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-black text-slate-950">{route.route}</td>
                  <td className="px-5 py-4">{route.usage}</td>
                  <td className="px-5 py-4">{route.avgTime}</td>
                  <td className="px-5 py-4">{route.carbonSaved}</td>
                  <td className="px-5 py-4">{route.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
