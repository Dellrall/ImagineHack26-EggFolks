import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      
      const data = await response.json();
      
      if (data.role === 'admin') {
        navigate({ to: '/admin/dashboard' });
      } else {
        navigate({ to: '/employee/dashboard' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center text-white">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-emerald-100">Sign in to your dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Work Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="name@company.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="••••••••"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}