import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/storage';
import { ArrowRight, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      registerUser(formData.name, formData.email);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="pt-32 min-h-screen bg-stone-50 pb-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-xl rounded-sm">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-stone-800 mb-2">Begin Your Journey</h1>
          <p className="text-stone-500 font-light text-sm">
            Join our community of makers and collectors.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
              Full Name
            </label>
            <input 
              required 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Matsuo Basho"
              className="w-full p-4 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
              Email Address
            </label>
            <input 
              required 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="artisan@example.com"
              className="w-full p-4 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all" 
            />
             <p className="text-[10px] text-stone-400 mt-2">
              * This will be your unique identifier for this demo. No password required.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors uppercase tracking-widest text-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Create Identity <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-stone-100">
          <p className="text-stone-500 text-sm">
            Already have an identity?{' '}
            <Link to="/login" className="text-terracotta hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;