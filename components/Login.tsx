
import React, { useState } from 'react';
import { UserRole } from '../types';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (userId: string, role: UserRole) => void;
}

const PixelChibi: React.FC<{ seed: string, className?: string, style?: React.CSSProperties }> = ({ seed, className, style }) => (
  <img 
    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&backgroundColor=transparent`} 
    className={className} 
    style={style}
    alt="Chibi"
  />
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan Password wajib diisi!');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setIsLoading(true);

    if (isSignUp) {
      const { user, error: authError } = await authService.register(email, password);
      if (authError) {
        setError(authError);
        setIsLoading(false);
        return;
      }
      if (user) {
        onLogin(user.id, 'member');
      }
    } else {
      const { user, error: authError } = await authService.signIn(email, password);
      if (authError) {
        setError(authError);
        setIsLoading(false);
        return;
      }
      if (user) {
        onLogin(user.id, 'member');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center justify-center p-6 overflow-hidden relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59,130,246,0.05) 35px, rgba(59,130,246,0.05) 70px)' }}>
      {/* Pixel Art Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-5 left-5 animate-bounce"><PixelChibi seed="pixel1" className="w-20 h-20 opacity-40" /></div>
        <div className="absolute top-32 right-10 animate-pulse"><PixelChibi seed="pixel2" className="w-24 h-24 opacity-35" /></div>
        <div className="absolute bottom-24 left-20 animate-bounce" style={{ animationDelay: '0.5s' }}><PixelChibi seed="pixel3" className="w-16 h-16 opacity-40" /></div>
        <div className="absolute bottom-10 right-32 animate-pulse" style={{ animationDelay: '1s' }}><PixelChibi seed="pixel4" className="w-28 h-28 opacity-30" /></div>
        <div className="absolute top-1/2 left-10 animate-bounce" style={{ animationDelay: '0.3s' }}><PixelChibi seed="pixel5" className="w-14 h-14 opacity-35" /></div>
        <div className="absolute top-1/3 right-5 animate-pulse" style={{ animationDelay: '1.5s' }}><PixelChibi seed="pixel6" className="w-20 h-20 opacity-40" /></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="relative mb-4">
          <svg viewBox="0 0 24 24" className="h-16 w-16 fill-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]">
             <rect x="4" y="4" width="2" height="2" /> <rect x="18" y="4" width="2" height="2" />
             <rect x="6" y="6" width="2" height="2" /> <rect x="16" y="6" width="2" height="2" />
             <rect x="10" y="10" width="4" height="4" />
             <rect x="6" y="16" width="2" height="2" /> <rect x="16" y="16" width="2" height="2" />
             <rect x="4" y="18" width="2" height="2" /> <rect x="18" y="18" width="2" height="2" />
          </svg>
        </div>

        <div className="text-center mb-2 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-lg border-2 border-blue-300">
          <h1 className="text-2xl font-black tracking-widest text-blue-600" style={{ fontFamily: '"Courier New", monospace', textShadow: '2px 2px 0px rgba(59,130,246,0.3)' }}>{isSignUp ? 'DAFTAR' : 'MASUK KE'}<br/>PIXEL X</h1>
          <p className="text-gray-600 text-xs font-bold mt-2 tracking-wider">{isSignUp ? 'BUAT AKUN BARU' : 'SILAKAN MASUKKAN EMAIL'}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 ml-1 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm text-gray-900 placeholder-gray-400"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 ml-1 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm text-gray-900 placeholder-gray-400"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isSignUp ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-4 w-full">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="text-blue-600 text-xs font-bold hover:underline"
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </div>

        <div className="flex gap-4 mt-6 grayscale opacity-30">
           <PixelChibi seed="login1" className="w-6 h-6" />
           <PixelChibi seed="login2" className="w-6 h-6" />
           <PixelChibi seed="login3" className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Login;
