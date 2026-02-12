
import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import Tweet from './Tweet';
import EditProfileModal from './EditProfileModal';
import { authService, UserProfile } from '../services/authService';

interface ProfileProps {
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await authService.getUserProfile(currentUser.id);
      setProfile(userProfile);
      setIsLoadingProfile(false);
    };
    loadProfile();
  }, [currentUser.id]);

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };
  // Mock data for user's own posts
  const userPosts: Post[] = [
    {
      id: 'p-1',
      user: currentUser,
      content: `Halo dunia! Ini adalah postingan pertama saya sebagai ${currentUser.role} di Pixel X. 🚀`,
      timestamp: '1j',
      likes: 42,
      retweets: 5,
      replies: 2,
      shares: 1,
      views: 1337,
      bookmarks: 3,
      quotes: 0,
    },
    {
      id: 'p-2',
      user: currentUser,
      content: 'Sedang mencoba fitur-fitur baru di X-Clone ini. Sangat keren! 👾✨',
      image: 'https://picsum.photos/seed/pixel-profile/800/400',
      timestamp: '3j',
      likes: 88,
      retweets: 12,
      replies: 8,
      shares: 4,
      views: 5400,
      bookmarks: 10,
      quotes: 2,
    },
  ];

  return (
    <div className="flex-1 max-w-[600px] border-x border-[#2f3336] min-h-screen pb-20 xl:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-black/60 backdrop-blur-md z-10 px-4 h-14 flex items-center gap-6 border-b border-[#2f3336]">
        <button className="p-2 hover:bg-[#181818] rounded-full transition-colors">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" /></svg>
        </button>
        <div>
          <h2 className="text-xl font-bold leading-tight">{currentUser.name}</h2>
          <span className="text-xs text-[#71767b]">{userPosts.length} Postingan</span>
        </div>
      </div>

      {/* Banner & Avatar Section */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <div className="px-4">
          <div className="relative -mt-16 mb-3">
            <img
              src={profile?.profile_photo_url || currentUser.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-black bg-black object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded border-2 border-black shadow-lg">
              LV.{currentUser.level}
            </div>
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-2xl font-black">{profile?.name || currentUser.name}</h1>
                {currentUser.verified && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.97-.2-4.01.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.33c-.46 1.4-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.97.2 4.01-.81s1.27-2.62.81-4.01c1.31-.66 2.19-1.9 2.19-3.33zM9.99 17L5.57 12.58l1.41-1.41 3.01 3 6.01-6.01 1.41 1.41L9.99 17z" /></svg>
                )}
              </div>
              <p className="text-[#71767b]">@{currentUser.handle}</p>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-1.5 border border-[#cfd9de] text-white font-bold rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Edit profil
            </button>
          </div>

          <p className="mb-3 text-[15px]">{profile?.bio || 'Digital artisan exploring the pixelated frontier of social media. Level 999 since day one. 👾'}</p>

          {profile?.birthdate && (
            <div className="flex gap-4 text-[#71767b] text-sm mb-4">
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M7 4V3h2v1h6V3h2v1h1.5C19.881 4 21 5.119 21 6.5v12c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-12C3 5.119 4.119 4 5.5 4H7zm0 2v2h6V6H7z" /></svg>
                {new Date(profile.birthdate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}

          {(profile?.youtube_url || profile?.twitter_url || profile?.tiktok_url || profile?.instagram_url || profile?.github_url || profile?.website_url) && (
            <div className="flex gap-4 mb-4 text-[15px]">
              {profile?.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">🌐 Website</a>
              )}
              {profile?.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">▶️ YouTube</a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">𝕏 Twitter</a>
              )}
              {profile?.tiktok_url && (
                <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">♪ TikTok</a>
              )}
              {profile?.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">📷 Instagram</a>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">⚙️ GitHub</a>
              )}
            </div>
          )}

          <div className="flex gap-4 text-[#71767b] text-sm mb-4">
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M7 4V3h2v1h6V3h2v1h1.5C19.881 4 21 5.119 21 6.5v12c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-12C3 5.119 4.119 4 5.5 4H7zM5.5 6c-.276 0-.5.224-.5.5v12c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-12c0-.276-.224-.5-.5-.5h-13z" /></svg>
              Bergabung Januari 2024
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
              currentUser.role === 'developer' ? 'bg-purple-500 text-white' : 
              currentUser.role === 'vip' ? 'bg-[#1d9bf0] text-white' : 
              'bg-[#2f3336] text-[#71767b]'
            }`}>
              {currentUser.role}
            </div>
            <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded">
              VERIFIED
            </div>
          </div>

          <div className="flex gap-4 text-sm mb-4">
            <span className="hover:underline cursor-pointer"><span className="font-bold">42</span> <span className="text-[#71767b]">Mengikuti</span></span>
            <span className="hover:underline cursor-pointer"><span className="font-bold">999K</span> <span className="text-[#71767b]">Pengikut</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2f3336]">
        {['Postingan', 'Balasan', 'Sorotan', 'Media', 'Suka'].map((tab, idx) => (
          <button 
            key={tab} 
            className={`flex-1 py-4 text-sm font-bold transition-colors relative hover:bg-[#181818] ${idx === 0 ? '' : 'text-[#71767b]'}`}
          >
            {tab}
            {idx === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="divide-y divide-[#2f3336]">
        {userPosts.map(post => (
          <Tweet key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        userId={currentUser.id}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default Profile;
