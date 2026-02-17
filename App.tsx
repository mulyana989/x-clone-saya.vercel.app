
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import RightSidebar from './components/RightSidebar';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Login from './components/Login';
import Profile from './components/Profile';
import { User, UserRole } from './types';
import { authService, UserProfile } from './services/authService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      authService.onAuthStateChange((user) => {
        (() => {
          if (user) {
            (async () => {
              const profile = await authService.getUserProfile(user.id);
              const userName = profile?.name || user.email?.split('@')[0] || 'User';

              setCurrentUser({
                id: user.id,
                name: userName,
                handle: userName.toLowerCase().replace(/\s+/g, '_'),
                avatar: profile?.profile_photo_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.id}`,
                role: 'member',
                level: 999,
                verified: false
              });
              setIsLoading(false);
            })();
          } else {
            setCurrentUser(null);
            setIsLoading(false);
          }
        })();
      });
    };

    checkAuth();
  }, []);

  const handleLogin = (userId: string, role: UserRole) => {
    const userName = userId.split('@')[0] || 'User';

    setCurrentUser({
      id: userId,
      name: userName,
      handle: userName.toLowerCase().replace(/\s+/g, '_'),
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userId}`,
      role: role,
      level: 999,
      verified: role !== 'member'
    });
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setActiveTab('home');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Feed currentUser={currentUser} />;
      case 'notifications':
        return <Notifications />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile currentUser={currentUser} />;
      default:
        return <Feed currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-black text-[#e7e9ea]">
      <div className="flex w-full max-w-[1300px]">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
        {renderContent()}
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
