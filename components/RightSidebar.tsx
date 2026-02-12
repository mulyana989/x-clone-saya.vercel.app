
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { getAITrends, searchPeople } from '../services/geminiService';
import { Trend, User } from '../types';

const RightSidebar: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoadingTrends(true);
      const aiTrends = await getAITrends();
      setTrends(aiTrends);
      setIsLoadingTrends(false);
    };
    fetchTrends();

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setShowResults(true);
        const results = await searchPeople(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleFollow = (id: string) => {
    setFollowingState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="hidden lg:block w-[350px] p-4 sticky top-0 h-screen overflow-y-auto">
      <div className="relative mb-4" ref={searchRef}>
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${showResults ? 'text-[#1d9bf0]' : 'text-[#71767b]'}`}>
          <Icons.Explore />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          placeholder="Cari teman..."
          className="w-full bg-[#202327] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-[#1d9bf0] focus:bg-black transition-all"
        />

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#2f3336] rounded-2xl shadow-2xl z-50 overflow-hidden min-h-[100px] max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="p-8 flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1d9bf0]"></div>
                <span className="text-xs text-[#71767b]">Mencari profil...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((user, idx) => (
                  <div key={user.id || idx} className="px-4 py-3 flex items-center justify-between hover:bg-[#16181c] transition-colors cursor-pointer group">
                    <div className="flex gap-3 min-w-0">
                      <img src={`https://picsum.photos/seed/${user.handle}/40/40`} className="w-10 h-10 rounded-full bg-[#2f3336]" alt={user.name} />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm truncate group-hover:underline">{user.name}</span>
                          {user.verified && (
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1d9bf0]"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.97-.2-4.01.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.33c-.46 1.4-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.97.2 4.01-.81s1.27-2.62.81-4.01c1.31-.66 2.19-1.9 2.19-3.33zM9.99 17L5.57 12.58l1.41-1.41 3.01 3 6.01-6.01 1.41 1.41L9.99 17z" /></svg>
                          )}
                        </div>
                        <span className="text-[#71767b] text-xs truncate">@{user.handle}</span>
                        <p className="text-white/80 text-[11px] mt-1 line-clamp-1">{user.bio}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFollow(user.id || `s-${idx}`); }}
                      className={`font-bold px-3 py-1 rounded-full text-xs transition-colors shrink-0 ${followingState[user.id || `s-${idx}`] ? 'border border-[#2f3336] text-white hover:border-rose-500 hover:text-rose-500 hover:after:content-["Batal"] after:content-["Mengikuti"]' : 'bg-white text-black hover:bg-[#d7dbdc]'}`}
                    >
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-[#71767b] text-sm">Tidak ada hasil ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-[#16181c] rounded-2xl mb-4 overflow-hidden border border-[#2f3336]">
        <h2 className="text-xl font-bold px-4 py-3">Berlangganan Premium</h2>
        <p className="px-4 text-sm font-medium mb-3 leading-tight">Berlangganan untuk membuka fitur baru.</p>
        <div className="px-4 pb-4">
          <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-4 py-2 rounded-full transition-colors">
            Langganan
          </button>
        </div>
      </div>

      <div className="bg-[#16181c] rounded-2xl mb-4 overflow-hidden border border-[#2f3336]">
        <h2 className="text-xl font-bold px-4 py-3">Tren untuk Anda</h2>
        {isLoadingTrends ? (
          <div className="px-4 py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9bf0]"></div>
          </div>
        ) : (
          trends.map(trend => (
            <div key={trend.id} className="px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer">
              <div className="flex justify-between text-[#71767b] text-xs">
                <span>{trend.category}</span>
                <Icons.More />
              </div>
              <p className="font-bold">{trend.topic}</p>
              <p className="text-[#71767b] text-xs mt-0.5">{trend.postCount}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#16181c] rounded-2xl mb-4 overflow-hidden border border-[#2f3336]">
        <h2 className="text-xl font-bold px-4 py-3">Untuk diikuti</h2>
        {[1, 2, 3].map(i => (
          <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-[#1d1f23] transition-colors cursor-pointer">
            <div className="flex gap-3">
              <img src={`https://picsum.photos/seed/suggest${i}/48/48`} alt="Avatar" className="w-10 h-10 rounded-full" />
              <div className="flex flex-col">
                <span className="font-bold text-sm hover:underline">User {i}</span>
                <span className="text-[#71767b] text-sm">@user_{i}</span>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFollow(`f-${i}`); }}
              className={`font-bold px-4 py-1.5 rounded-full text-sm transition-colors ${followingState[`f-${i}`] ? 'border border-[#2f3336] text-white' : 'bg-white text-black hover:bg-[#d7dbdc]'}`}
            >
              {followingState[`f-${i}`] ? 'Mengikuti' : 'Ikuti'}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
