import { Building2, Car, Clock, Coins, Leaf, Users } from 'lucide-react';
import KpiCard from '../../components/admin/KpiCard';
import OccupancyCard from '../../components/admin/OccupancyCard';
import { adminKpis, floorOccupancy, sustainabilityMetrics } from '../../data/adminMockData';

const icons = [Users, Users, Users, Leaf, Coins, Building2];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminKpis.map((kpi, index) => (
          <KpiCard key={kpi.label} {...kpi} icon={icons[index]} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sustainabilityMetrics.map((metric, index) => {
          const Icon = [Leaf, Car, Clock][index];
          return <KpiCard key={metric.label} {...metric} icon={Icon} />;
        })}
      </section>

      <section>
        <h2 className="text-2xl font-black text-slate-950">Occupancy Monitoring</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {floorOccupancy.map((floor) => (
            <OccupancyCard key={floor.floor} {...floor} />
          ))}
        </div>
      </section>
    </div>
  );
}
