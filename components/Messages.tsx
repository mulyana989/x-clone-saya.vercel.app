
import React, { useState } from 'react';
// Fix: Removed ChatMessage import as it is not exported from types.ts and not used in this file
import { Conversation } from '../types';
import { Icons } from '../constants';

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'primary' | 'requests'>('primary');
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [chatInput, setChatInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: 'c1',
      // Fix: Added missing role and level properties for User type
      participant: { id: 'u1', name: 'Elon Musk', handle: 'elonmusk', avatar: 'https://picsum.photos/seed/elon/48/48', role: 'vip', level: 999 },
      lastMessage: 'Kapan kita kirim roket ke Mars?',
      timestamp: '10m',
      unreadCount: 2,
      isRequest: false
    },
    {
      id: 'c2',
      // Fix: Added missing role and level properties for User type
      participant: { id: 'u4', name: 'Stranger X', handle: 'mystery_user', avatar: 'https://picsum.photos/seed/stranger/48/48', role: 'member', level: 1 },
      lastMessage: 'Halo, boleh kenalan?',
      timestamp: '1h',
      unreadCount: 0,
      isRequest: true
    }
  ];

  const filteredConversations = conversations.filter(c => 
    activeTab === 'primary' ? !c.isRequest : c.isRequest
  );

  return (
    <div className="flex-1 flex max-w-[1000px] border-x border-[#2f3336] h-screen overflow-hidden">
      {/* Inbox List */}
      <div className={`w-full ${selectedChat ? 'hidden md:flex' : 'flex'} md:w-[400px] flex-col border-r border-[#2f3336]`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Pesan</h2>
          <div className="flex gap-2">
            <Icons.More />
          </div>
        </div>

        <div className="flex border-b border-[#2f3336]">
          <button 
            onClick={() => setActiveTab('primary')}
            className={`flex-1 py-4 text-sm font-bold transition-colors relative hover:bg-[#181818] ${activeTab === 'primary' ? '' : 'text-[#71767b]'}`}
          >
            Utama
            {activeTab === 'primary' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0]" />}
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-4 text-sm font-bold transition-colors relative hover:bg-[#181818] ${activeTab === 'requests' ? '' : 'text-[#71767b]'}`}
          >
            Permintaan
            {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0]" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setSelectedChat(conv)}
              className={`p-4 flex gap-3 hover:bg-[#080808] cursor-pointer transition-colors ${selectedChat?.id === conv.id ? 'bg-[#181818] border-r-2 border-[#1d9bf0]' : ''}`}
            >
              <img src={conv.participant.avatar} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-bold text-sm truncate">{conv.participant.name}</span>
                    <span className="text-[#71767b] text-sm truncate">@{conv.participant.handle}</span>
                  </div>
                  <span className="text-[#71767b] text-xs">{conv.timestamp}</span>
                </div>
                <p className="text-[#71767b] text-sm truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="bg-[#1d9bf0] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Detail */}
      <div className={`flex-1 ${selectedChat ? 'flex' : 'hidden md:flex'} flex-col bg-black relative`}>
        {selectedChat ? (
          <>
            <div className="sticky top-0 bg-black/60 backdrop-blur-md z-10 p-4 border-b border-[#2f3336] flex items-center gap-4">
              <button onClick={() => setSelectedChat(null)} className="md:hidden">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" /></svg>
              </button>
              <img src={selectedChat.participant.avatar} className="w-8 h-8 rounded-full" alt="" />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">{selectedChat.participant.name}</span>
                <span className="text-[#71767b] text-xs">@{selectedChat.participant.handle}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col items-center py-8 border-b border-[#2f3336] mb-4 text-center">
                <img src={selectedChat.participant.avatar} className="w-16 h-16 rounded-full mb-2" alt="" />
                <span className="font-bold text-lg">{selectedChat.participant.name}</span>
                <span className="text-[#71767b]">@{selectedChat.participant.handle}</span>
                <p className="text-sm text-[#71767b] mt-4 max-w-xs">Ini adalah awal percakapan legendaris Anda dengan {selectedChat.participant.name}.</p>
              </div>

              {/* Simulated Messages */}
              <div className="flex justify-start">
                <div className="bg-[#2f3336] text-white p-3 rounded-2xl rounded-bl-none max-w-[80%] text-sm">
                  {selectedChat.lastMessage}
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-[#1d9bf0] text-white p-3 rounded-2xl rounded-br-none max-w-[80%] text-sm">
                  Tentu, Elon! Ayo kita bicarakan detailnya besok.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#2f3336] bg-black">
              <div className="flex items-center gap-2 bg-[#202327] rounded-2xl px-4 py-2">
                <div className="text-[#1d9bf0]"><Icons.Media /></div>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Kirim pesan baru"
                  className="bg-transparent flex-1 text-sm focus:outline-none"
                />
                <button className={`transition-colors ${chatInput.trim() ? 'text-[#1d9bf0]' : 'text-[#1d9bf0]/50'}`}>
                   <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-3xl font-bold mb-2">Pilih sebuah pesan</h3>
            <p className="text-[#71767b] max-w-xs">Pilih dari percakapan yang sudah ada, mulai yang baru, atau tetaplah santai.</p>
            <button className="mt-6 bg-[#1d9bf0] text-white font-bold px-6 py-3 rounded-full hover:bg-[#1a8cd8] transition-colors">
              Pesan baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
