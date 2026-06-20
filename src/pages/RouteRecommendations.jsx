import RouteCard from '../components/RouteCard';
import { routes } from '../data/mockData';

export default function RouteRecommendations() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Route Recommendations
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Available Eco Routes</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}
