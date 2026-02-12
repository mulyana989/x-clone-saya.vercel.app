
import React from 'react';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 'n1',
      type: 'like',
      // Fix: Added missing role and level properties for User type
      user: { id: 'u1', name: 'Elon Musk', handle: 'elonmusk', avatar: 'https://picsum.photos/seed/elon/48/48', role: 'vip', level: 999 },
      content: 'menyukai postingan Anda',
      timestamp: '2j',
      read: false
    },
    {
      id: 'n2',
      type: 'follow',
      // Fix: Added missing role and level properties for User type
      user: { id: 'u2', name: 'React', handle: 'reactjs', avatar: 'https://picsum.photos/seed/react/48/48', role: 'member', level: 1 },
      content: 'mulai mengikuti Anda',
      timestamp: '5j',
      read: true
    },
    {
      id: 'n3',
      type: 'message',
      // Fix: Added missing role and level properties for User type
      user: { id: 'u3', name: 'Chef Gordon', handle: 'gordonr', avatar: 'https://picsum.photos/seed/chef/48/48', role: 'member', level: 50 },
      content: 'mengirim pesan kepada Anda',
      timestamp: '1h',
      read: true
    }
  ];

  return (
    <div className="flex-1 max-w-[600px] border-x border-[#2f3336] min-h-screen">
      <div className="sticky top-0 bg-black/60 backdrop-blur-md z-10 p-4 border-b border-[#2f3336]">
        <h2 className="text-xl font-bold">Notifikasi</h2>
      </div>
      
      <div className="divide-y divide-[#2f3336]">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 flex gap-3 hover:bg-[#080808] transition-colors cursor-pointer ${!notif.read ? 'bg-[#1d9bf0]/5' : ''}`}>
            <div className="mt-1">
              {notif.type === 'like' && <svg viewBox="0 0 24 24" className="h-6 w-6 fill-rose-500"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" /></svg>}
              {notif.type === 'follow' && <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#1d9bf0]"><path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.366 6.31 0 .73-.12 1.41-.35 2.05h-15.76c-.228-.64-.35-1.32-.35-2.05 0-2.51.89-4.73 2.367-6.31C2.394 11.58 1 9.21 1 6.5 1 3.46 3.46 1 6.5 1s5.5 2.46 5.5 5.5c0 2.71-1.394 5.08-3.513 6.94 2.119 1.86 3.513 4.23 3.513 6.94 0-2.71 1.394-5.08 3.513-6.94-2.119-1.86-3.513-4.23-3.513-6.94 0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5c0 2.71-1.394 5.08-3.514 6.94z" /></svg>}
              {notif.type === 'message' && <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#1d9bf0]"><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119-2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 5.056 8-5.056v-2.764c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 5.056-8-5.056v7.537c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-7.537z" /></svg>}
            </div>
            <div className="flex flex-col">
              <img src={notif.user.avatar} className="w-8 h-8 rounded-full mb-2" alt={notif.user.name} />
              <div className="text-sm">
                <span className="font-bold">{notif.user.name}</span> {notif.content}
              </div>
              <span className="text-[#71767b] text-xs mt-1">{notif.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
