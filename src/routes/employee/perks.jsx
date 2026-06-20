import PerkCard from '../../components/employee/PerkCard';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
import { usePerks } from '../../hooks/usePerks';

export default function EmployeePerks() {
  const { perks, claim } = usePerks();

  if (perks.isLoading) return <LoadingState />;
  if (perks.isError) return <ErrorState onRetry={perks.refetch} />;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {perks.data.map((perk) => (
        <PerkCard key={perk.id} perk={perk} onClaim={claim.mutate} />
      ))}
    </div>
  );
}
