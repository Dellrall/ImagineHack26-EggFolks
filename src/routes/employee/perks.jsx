import PerkCard from '../../components/employee/PerkCard';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
import { usePerks } from '../../hooks/usePerks';
import { usePoints } from '../../hooks/usePoints';

export default function EmployeePerks() {
  const { perks, claim } = usePerks();
  const points = usePoints();

  if (perks.isLoading || points.isLoading) return <LoadingState />;
  if (perks.isError || points.isError) {
    return (
      <ErrorState
        onRetry={() => {
          perks.refetch();
          points.refetch();
        }}
      />
    );
  }

  const balance = points.data?.balance ?? 0;

  const handleClaim = (perkId) => {
    const perk = perks.data.find((p) => p.id === perkId);
    claim.mutate(perkId, {
      onSuccess: (res) => {
        if (res && res.ok === false) {
          alert(`Failed to claim: ${res.error}`);
        } else {
          alert(`Successfully claimed: ${perk?.title ?? 'Perk'}!`);
        }
      },
      onError: (err) => {
        alert(`Error claiming perk: ${err.message}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Redeem Perks</h2>
          <p className="mt-1 text-sm text-slate-500">Use your eco points to redeem rewards and benefits.</p>
        </div>
        <div className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Your Eco Points</p>
          <p className="text-2xl font-black mt-0.5">{balance.toLocaleString()} Points</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {perks.data.map((perk) => (
          <PerkCard
            key={perk.id}
            perk={perk}
            userBalance={balance}
            onClaim={handleClaim}
          />
        ))}
      </div>
    </div>
  );
}
