import RecommendationCard from '../../components/admin/RecommendationCard';
import { aiRecommendations } from '../../data/adminMockData';

export default function AdminAIRecommendations() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          AI Recommendations
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Simulated AI Insights</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {aiRecommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.title} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
}
