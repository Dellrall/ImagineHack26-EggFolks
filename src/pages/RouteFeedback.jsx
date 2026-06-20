import { Star } from 'lucide-react';
import { useState } from 'react';
import { useLocalFeedback } from '../hooks/useLocalFeedback';

export default function RouteFeedback() {
  const { feedback, submitFeedback } = useLocalFeedback();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    submitFeedback({ rating, comment: comment.trim() || 'No comment provided.' });
    setRating(5);
    setComment('');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">Route Feedback</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Rate your commute</h2>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-bold text-slate-700">Rating</label>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star rating`}
                  className={`rounded-xl p-2 ${
                    star <= rating ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-300'
                  }`}
                  onClick={() => setRating(star)}
                >
                  <Star size={24} fill="currentColor" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-bold text-slate-700">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="6"
              className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-emerald-100"
              placeholder="Share comfort, delay, crowding, or weather notes"
            />
          </div>

          <button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100">
            Submit Feedback
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-black text-slate-950">Recent Feedback</h3>
        <div className="mt-5 space-y-3">
          {feedback.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Submitted feedback will appear here for this session.
            </p>
          ) : (
            feedback.map((item) => (
              <article key={item.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.comment}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
