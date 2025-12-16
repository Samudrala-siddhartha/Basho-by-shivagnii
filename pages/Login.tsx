import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/storage';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      const success = loginUser(email);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('We could not find an artisan with this email. Please sign up first.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="pt-32 min-h-screen bg-stone-50 pb-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-xl rounded-sm">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-stone-800 mb-2">Return to Sanctuary</h1>
          <p className="text-stone-500 font-light text-sm">
            Enter your email to access your history and orders.
          </p>
        </div>

        {/* Demo Disclaimer */}
        <div className="bg-stone-100 border-l-2 border-stone-400 p-3 mb-6">
          <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold mb-1">Hackathon Demo Mode</p>
          <p className="text-xs text-stone-600">
            <strong>No password required.</strong> We use a session-based identity claim system. 
            Enter the email you used during signup.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
              Email Address
            </label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="artisan@example.com"
              className="w-full p-4 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all" 
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-sm text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors uppercase tracking-widest text-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Enter Studio <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-stone-100">
          <p className="text-stone-500 text-sm">
            First time visiting?{' '}
            <Link to="/signup" className="text-terracotta hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;