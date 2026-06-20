import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import cortisonLogo from '../../../frontend/Cortison Logo.jpg';

// Simulated Database Query
const verifyEmailInDatabase = async (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulating network latency
    setTimeout(() => {
      if (!email || !email.includes('@')) {
        reject(new Error('Please enter a valid email address.'));
        return;
      }
      
      // The password is for show and not validated here.
      // Simple logic to split roles for demonstration:
      const userRole = email.toLowerCase().includes('admin') ? 'admin' : 'employee';
      resolve({ email, role: userRole });
    }, 800);
  });
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Passing password just for show
      const user = await verifyEmailInDatabase(email, password);
      
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate({ to: '/admin/dashboard' });
      } else {
        navigate({ to: '/dashboard' });
      }
    } catch (err) {
      setError(err.message || 'Failed to find account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-emerald-100 p-4 flex items-center justify-center shadow-sm" style={{ width: '88px', height: '88px' }}>
            <img
              src={cortisonLogo}
              alt="Cortison logo"
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-emerald-950 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-emerald-600/80">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-emerald-900">
              Email address
            </label>
            <div className="mt-1.5 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-emerald-200 rounded-xl shadow-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-emerald-50/30"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-emerald-900">
              Password
            </label>
            <div className="mt-1.5 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-emerald-200 rounded-xl shadow-sm placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-emerald-50/30 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-400 hover:text-emerald-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.416-1.52c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-emerald-900 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-md">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white ${
                isLoading 
                  ? 'bg-emerald-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md active:bg-emerald-800'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}