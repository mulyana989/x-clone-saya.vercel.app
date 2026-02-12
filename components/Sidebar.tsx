
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-3 rounded-full cursor-pointer transition-colors hover:bg-[#181818] w-fit pr-6 group`}
  >
    <div className="flex items-center justify-center">
      {icon}
    </div>
    <span className={`text-xl ${active ? 'font-bold' : 'font-normal'} hidden xl:block`}>{label}</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, currentUser, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#2f3336] xl:relative xl:border-t-0 xl:bg-transparent xl:flex xl:flex-col xl:justify-between h-auto xl:h-screen xl:p-4 xl:w-64 xl:max-w-xs">
      <div className="flex justify-around items-center xl:flex-col xl:items-start xl:gap-2">
        <div className="hidden xl:block p-3 mb-1 cursor-pointer" onClick={() => onTabChange('home')}>
          <Icons.X />
        </div>
        
        <SidebarItem 
          icon={<Icons.Home active={activeTab === 'home'} />} 
          label="Beranda" 
          active={activeTab === 'home'} 
          onClick={() => onTabChange('home')}
        />
        <SidebarItem 
          icon={<Icons.Explore active={activeTab === 'explore'} />} 
          label="Jelajah" 
          active={activeTab === 'explore'} 
          onClick={() => onTabChange('explore')}
        />
        <SidebarItem 
          icon={<Icons.Notifications active={activeTab === 'notifications'} />} 
          label="Notifikasi" 
          active={activeTab === 'notifications'} 
          onClick={() => onTabChange('notifications')}
        />
        <SidebarItem 
          icon={<Icons.Messages active={activeTab === 'messages'} />} 
          label="Pesan" 
          active={activeTab === 'messages'} 
          onClick={() => onTabChange('messages')}
        />
        <SidebarItem 
          icon={<Icons.Profile active={activeTab === 'profile'} />} 
          label="Profil" 
          active={activeTab === 'profile'} 
          onClick={() => onTabChange('profile')}
        />
        <SidebarItem 
          icon={<Icons.More />} 
          label="Lainnya" 
          onClick={() => {}} 
        />

        <button className="hidden xl:block mt-4 w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-full text-lg transition-colors">
          Posting
        </button>
      </div>

      <div className="relative">
        {showLogoutConfirm && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-black border border-[#2f3336] rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] py-3 z-50 animate-in fade-in slide-in-from-bottom-2">
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-3 hover:bg-[#181818] transition-colors font-bold text-rose-500 text-sm"
            >
              Keluar dari @{currentUser.handle}
            </button>
            <div className="h-[1px] bg-[#2f3336] my-1"></div>
            <button 
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full text-left px-4 py-2 hover:bg-[#181818] transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        )}
        
        <div 
          onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          className="hidden xl:flex items-center gap-3 p-3 mt-auto rounded-full cursor-pointer hover:bg-[#181818] transition-colors border border-white/5 bg-[#16181c]/50 group"
        >
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-[#2f3336]"
            />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[8px] font-black px-1 rounded-sm border border-black">
              LV.999
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1">
              <p className="font-bold truncate text-sm">{currentUser.name}</p>
              {currentUser.role !== 'member' && <span className="text-[10px]">⭐</span>}
            </div>
            <p className="text-[#71767b] truncate text-xs uppercase tracking-tighter">@{currentUser.handle}</p>
          </div>
          <div className="text-white opacity-50 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
          </div>
        </div>

        {/* Mobile Logout Button (optional, since space is limited) */}
        <div className="xl:hidden flex items-center justify-center p-2">
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" transform="rotate(45 12 12)"/></svg>
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
