import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <section className="w-full max-w-lg rounded-xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
          <button className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-200" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
