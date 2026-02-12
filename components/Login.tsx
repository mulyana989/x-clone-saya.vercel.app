
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username dan Password wajib diisi!');
      return;
    }

    setIsLoading(true);

    // Simulasi proses autentikasi
    setTimeout(() => {
      let role: UserRole = 'member';
      
      // Easter egg/Secret login untuk role lain
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        role = 'developer';
      } else if (username.toLowerCase().includes('vip') && password === 'vip123') {
        role = 'vip';
      }

      onLogin(username, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 animate-bounce"><PixelChibi seed="star1" className="w-12 h-12" /></div>
        <div className="absolute bottom-20 right-20 animate-pulse"><PixelChibi seed="star2" className="w-16 h-16" /></div>
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

        <div className="text-center mb-2">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900" style={{ fontFamily: 'monospace' }}>MASUK KE PIXEL X</h1>
          <p className="text-gray-600 text-xs">Silakan masukkan akun Member Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 ml-1 uppercase">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm text-gray-900 placeholder-gray-400"
              autoComplete="username"
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
            ) : 'Masuk'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-4 w-full">
          <button className="text-blue-600 text-xs font-bold hover:underline">Lupa password?</button>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-[10px] text-gray-600">ATAU</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>
          <button className="w-full border border-gray-300 py-3 rounded-full text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all">Daftar Akun Baru</button>
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
