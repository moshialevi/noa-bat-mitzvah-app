import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface LoginViewProps { 
  onBack: () => void;
  onLoginSuccess?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- DEMO LOGIN BYPASS ---
    // This allows you to enter without setting up Firebase Authentication users yet
    if (email === 'admin' && password === '123456') {
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 800);
      return;
    }
    // -------------------------

    try { 
      await signInWithEmailAndPassword(auth, email, password); 
      // Auth state listener in App.tsx will handle the redirect
    } 
    catch (err: any) { 
      console.error(err);
      setError('פרטי הכניסה שגויים. נסה את פרטי ההדגמה למטה.');
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-dark font-sans">
      <div className="glass-panel w-full max-w-md p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-accent to-pink-500"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-cyber-accent/10 rounded-2xl flex items-center justify-center text-cyber-accent shadow-[0_0_30px_rgba(167,139,250,0.3)] border border-cyber-accent/20">
            <ShieldCheck size={40} />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">כניסה למערכת</h2>
        <p className="text-center text-gray-400 mb-8 text-sm">גישה למנהלי אירוע בלבד</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-3">
             <label className="text-xs font-bold text-cyber-accent uppercase tracking-wider px-1">שם משתמש</label>
             <input 
                type="text" 
                required 
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyber-accent focus:bg-white/5 transition-all placeholder:text-gray-600" 
                placeholder="admin" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
             />
             
             <label className="text-xs font-bold text-cyber-accent uppercase tracking-wider px-1 mt-2 block">סיסמה</label>
             <input 
                type="password" 
                required 
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyber-accent focus:bg-white/5 transition-all placeholder:text-gray-600" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
             />
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-400/10 p-2 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyber-accent to-cyber-neon text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:shadow-[0_0_40px_rgba(167,139,250,0.6)] transition-all mt-4 transform hover:-translate-y-1">
            {loading ? 'מאמת פרטים...' : 'היכנס למערכת'}
          </button>
        </form>

        <button onClick={onBack} className="w-full mt-6 text-gray-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-2">
          <ArrowRight size={12} /> חזור לאירוע
        </button>
      </div>
    </div>
  );
};

export default LoginView;