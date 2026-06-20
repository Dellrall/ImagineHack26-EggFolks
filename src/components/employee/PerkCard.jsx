export default function PerkCard({ perk, onClaim, userBalance = 0 }) {
  const canClaim = userBalance >= perk.pointsRequired;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <img src={perk.image} alt="" className="h-40 w-full object-cover" />
      <div className="p-5">
        <h3 className="font-black text-slate-950 dark:text-white">{perk.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{perk.description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-secondary dark:bg-emerald-950/40">
            {perk.pointsRequired} pts
          </span>
          {canClaim ? (
            <button
              className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary/90 active:scale-95"
              onClick={() => onClaim(perk.id)}
            >
              Claim Perk
            </button>
          ) : (
            <button
              disabled
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
            >
              Insufficient Points
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
