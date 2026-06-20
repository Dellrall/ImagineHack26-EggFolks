import { useMemo, useState } from 'react';
import EmptyState from '../../components/shared/EmptyState';
import ErrorState from '../../components/shared/ErrorState';
import FilterDropdown from '../../components/shared/FilterDropdown';
import LoadingState from '../../components/shared/LoadingState';
import SearchBar from '../../components/shared/SearchBar';
import Table from '../../components/shared/Table';
import { useRoutes } from '../../hooks/useRoutes';

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'route', label: 'Route' },
  { key: 'transportType', label: 'Transport Type' },
  { key: 'travelTime', label: 'Travel Time' },
  { key: 'carbonSaved', label: 'Carbon Saved' },
  { key: 'rating', label: 'Satisfaction Rating' },
];

export default function EmployeeRoutes() {
  const { history, feedback } = useRoutes();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const rows = useMemo(() => {
    const data = history.data ?? [];
    return data.filter((row) => {
      const matchesSearch = `${row.route} ${row.transportType}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'All' || row.transportType.includes(filter);
      return matchesSearch && matchesFilter;
    });
  }, [filter, history.data, query]);

  const pageRows = rows.slice((page - 1) * 5, page * 5);
  const pageCount = Math.max(1, Math.ceil(rows.length / 5));

  if (history.isLoading) return <LoadingState />;
  if (history.isError) return <ErrorState onRetry={history.refetch} />;

  function handleSubmit(event) {
    event.preventDefault();
    feedback.mutate({ rating: Number(rating), comment });
    setComment('');
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchBar value={query} onChange={setQuery} placeholder="Search route history" />
          <FilterDropdown value={filter} onChange={setFilter} options={['All', 'LRT', 'Bus', 'Carpool', 'Bike']} />
        </div>
      </section>

      {pageRows.length ? <Table columns={columns} rows={pageRows} /> : <EmptyState title="No route history found" />}

      <div className="flex items-center justify-end gap-2">
        <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200" onClick={() => setPage((value) => Math.max(1, value - 1))}>
          Previous
        </button>
        <span className="text-sm font-bold text-slate-500">Page {page} of {pageCount}</span>
        <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200" onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
          Next
        </button>
      </div>

      <form className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit}>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Feedback Submission</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-end">
          <label>
            <span className="text-sm font-bold text-slate-500">Rating</span>
            <FilterDropdown value={rating} onChange={setRating} options={['1', '2', '3', '4', '5']} />
          </label>
          <label>
            <span className="text-sm font-bold text-slate-500">Comment</span>
            <input value={comment} onChange={(event) => setComment(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
          </label>
          <button className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
