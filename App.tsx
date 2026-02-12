
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import RightSidebar from './components/RightSidebar';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Login from './components/Login';
import Profile from './components/Profile';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string, role: UserRole) => {
    // Generate avatar seed berdasarkan username
    const avatarSeed = username || 'guest';
    
    setCurrentUser({
      id: 'me-' + Math.random().toString(36).substr(2, 9),
      name: username,
      handle: username.toLowerCase().replace(/\s+/g, '_'),
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}`,
      role: role,
      level: 999,
      verified: role !== 'member'
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

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
