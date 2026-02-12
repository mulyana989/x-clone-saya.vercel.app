
import React, { useState } from 'react';
import Tweet from './Tweet';
import TweetBox from './TweetBox';
import { Post, VideoClip, User } from '../types';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Elon Pixel',
      handle: 'elonmusk',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Elon',
      verified: true,
      role: 'developer',
      level: 999
    },
    content: 'X Chibi Edition is the ultimate social network! VIPs get all the power. 👾🚀',
    timestamp: '2h',
    likes: 245000,
    retweets: 42000,
    replies: 15000,
    shares: 8900,
    views: 12000000,
    bookmarks: 500,
    quotes: 200,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Chibi Dev',
      handle: 'pixel_dev',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Dev',
      verified: true,
      role: 'vip',
      level: 999
    },
    content: 'Baru saja membuka akses VIP untuk semua orang! Coba fitur upload video di bawah. 🎬✨',
    image: 'https://picsum.photos/seed/pixelart/1200/800',
    timestamp: '5h',
    likes: 12000,
    retweets: 2400,
    replies: 450,
    shares: 560,
    views: 1200000,
    bookmarks: 100,
    quotes: 50,
  }
];

const Feed: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [tab, setTab] = useState<'for-you' | 'following'>('for-you');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handlePost = (content: string, media?: { type: 'image' | 'video', url?: string, sequence?: VideoClip[] }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      image: media?.type === 'image' ? media.url : undefined,
      video: media?.type === 'video' ? media.url : undefined,
      videoSequence: media?.type === 'video' ? media.sequence : undefined,
      timestamp: 'now',
      likes: 0,
      retweets: 0,
      replies: 0,
      shares: 0,
      views: 0,
      bookmarks: 0,
      quotes: 0
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <main className="flex-1 max-w-[600px] border-x border-[#2f3336] min-h-screen mb-16 xl:mb-0">
      <div className="sticky top-0 bg-black/60 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div className="flex h-12">
          <button onClick={() => setTab('for-you')} className="flex-1 hover:bg-[#181818] transition-colors relative">
            <span className={`h-full flex items-center justify-center ${tab === 'for-you' ? 'font-bold' : 'text-[#71767b]'}`}>Untuk Anda</span>
            {tab === 'for-you' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />}
          </button>
          <button onClick={() => setTab('following')} className="flex-1 hover:bg-[#181818] transition-colors relative">
            <span className={`h-full flex items-center justify-center ${tab === 'following' ? 'font-bold' : 'text-[#71767b]'}`}>Mengikuti</span>
            {tab === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full" />}
          </button>
        </div>
      </div>

      <TweetBox onPost={handlePost} currentUser={currentUser} />

      <div className="divide-y divide-[#2f3336]">
        {posts.map(post => (
          <Tweet key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </main>
  );
};

export default Feed;
