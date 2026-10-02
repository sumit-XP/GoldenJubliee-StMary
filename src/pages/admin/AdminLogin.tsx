import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Lock, ArrowRight, ArrowLeft, Shield, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError(false);

    const success = await login(pin);
    if (!success) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#2D0304] text-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#3D0506] border border-amber-500/40 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="text-xs text-amber-300/80 hover:text-amber-200 flex items-center gap-1.5 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jubilee Public Portal</span>
        </button>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 mx-auto mb-4 shadow-lg">
          <div className="w-full h-full rounded-full bg-[#5A0506] flex items-center justify-center text-amber-300">
            <Shield className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Jubilee Admin Control
          </h2>
          <p className="text-xs text-amber-200/70 mt-1">
            St. Mary's School, Jajpur Road (1976 – 2026)
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Invalid Admin Passcode. Please verify and try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Admin Access PIN
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin passcode"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm outline-none font-mono"
              />
              <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-amber-300/50 mt-1.5 font-mono">
              Default passcode: <span className="text-amber-300 font-bold">stmarys1976</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Control'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-amber-500/20 text-center text-[11px] text-amber-200/40">
          Authorized personnel only • Golden Jubilee Committee Secretariat
        </div>

      </div>
    </div>
  );
};
