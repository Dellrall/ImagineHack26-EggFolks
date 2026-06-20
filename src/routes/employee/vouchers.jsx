import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, Ticket, QrCode, Inbox, ArrowRight } from 'lucide-react';
import ErrorState from '../../components/shared/ErrorState';
import LoadingState from '../../components/shared/LoadingState';
import { useClaimedPerks } from '../../hooks/usePerks';

export default function EmployeeVouchers() {
  const { data: vouchers, isLoading, isError, refetch } = useClaimedPerks();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">My Vouchers</h2>
        <p className="mt-1 text-sm text-slate-500">View and redeem your claimed rewards and perks.</p>
      </div>

      {vouchers && vouchers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vouchers.map((voucher) => {
            const dateStr = new Date(voucher.claimedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const mockCode = `EGO-${voucher.id.toUpperCase()}-${voucher.claimedAt.split('T')[0].replace(/-/g, '')}`;

            return (
              <article
                key={voucher.claimId}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img src={voucher.image} alt="" className="h-40 w-full object-cover" />
                    <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white shadow">
                      Active
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-slate-950 dark:text-white">{voucher.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar size={12} /> Claimed on {dateStr}
                    </p>
                    <p className="mt-3 text-sm text-slate-500 line-clamp-2">{voucher.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="font-mono text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    {mockCode}
                  </div>
                  <button
                    onClick={() => setSelectedVoucher({ ...voucher, code: mockCode })}
                    className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary/90"
                  >
                    <QrCode size={14} /> Use Voucher
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-secondary dark:bg-emerald-950/30">
            <Ticket size={32} />
          </div>
          <h3 className="mt-6 text-lg font-black text-slate-950 dark:text-white">No Vouchers Yet</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            You haven't claimed any perks. Earn eco points by using sustainable transport and claim rewards from the perks page!
          </p>
          <div className="mt-8">
            <Link
              to="/perks"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90 shadow-lg shadow-emerald-200/20 dark:shadow-none"
            >
              Browse Perks <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* QR Code Modal Dialog */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 text-center shadow-soft dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">Redeem Reward</h3>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                {/* SVG mock QR Code */}
                <svg width="150" height="150" viewBox="0 0 100 100" className="text-slate-950">
                  <path d="M0,0 h30 v30 h-30 z M0,10 h20 v10 h-20 z M10,10 h0 v0 z" fill="currentColor" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor" />
                  <path d="M40,0 h10 v10 h-10 z M50,20 h10 v10 h-10 z M30,40 h20 v10 h-20 z M60,40 h10 v10 h-10 z" fill="currentColor" />
                  <path d="M40,60 h10 v20 h-10 z M50,80 h20 v10 h-20 z M80,50 h10 v20 h-10 z M90,80 h10 v10 h-10 z" fill="currentColor" />
                  <path d="M70,60 h20 v10 h-20 z M30,10 h10 v10 h-10 z M60,20 h10 v20 h-10 z" fill="currentColor" />
                </svg>
              </div>
              <p className="mt-4 font-mono text-sm font-black text-slate-950 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded">
                {selectedVoucher.code}
              </p>
              <p className="mt-2 text-xs text-slate-400">Show this QR code or code at check out to redeem your reward.</p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  alert("Voucher marked as successfully redeemed!");
                  setSelectedVoucher(null);
                }}
                className="w-full rounded-xl bg-secondary py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
              >
                Mark as Used
              </button>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
