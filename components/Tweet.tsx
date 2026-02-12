
import React, { useState, useRef, useEffect } from 'react';
import { Post, User } from '../types';
import { Icons } from '../constants';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

const formatCompactNumber = (number: number): string => {
  if (number < 1000) return number.toString();
  if (number < 1000000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
};

const Tweet: React.FC<{ post: Post, currentUser: User }> = ({ post, currentUser }) => {
  const [metrics, setMetrics] = useState({
    likes: post.likes,
    retweets: post.retweets,
    replies: post.replies,
    shares: post.shares,
    views: post.views,
    bookmarks: post.bookmarks || 0,
    quotes: post.quotes || 0
  });
  
  const [liked, setLiked] = useState(post.liked);
  const [retweeted, setRetweeted] = useState(post.retweeted);
  const [showBoostPanel, setShowBoostPanel] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    setMetrics(prev => ({
      ...prev,
      likes: newLikedState ? prev.likes + 1 : prev.likes - 1
    }));
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRetweetState = !retweeted;
    setRetweeted(newRetweetState);
    setMetrics(prev => ({
      ...prev,
      retweets: newRetweetState ? prev.retweets + 1 : prev.retweets - 1
    }));
  };

  // VIP Boost Actions
  const boost = (type: keyof typeof metrics, amount: number) => {
    setMetrics(prev => ({ ...prev, [type]: prev[type] + amount }));
  };

  const handleSpeech = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await generateSpeech(post.content);
    if (audioData) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decoded = decodeBase64(audioData);
        const buffer = await decodeAudioData(decoded, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } catch (err) {
        setIsSpeaking(false);
      }
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer group/tweet relative">
      <div className="flex gap-3">
        <div className="flex-shrink-0 relative">
          <img src={post.user.avatar} alt={post.user.handle} className="w-10 h-10 rounded-full hover:opacity-90" />
          <div className="absolute -bottom-1 -right-1 bg-yellow-500/80 text-black text-[7px] font-bold px-0.5 rounded border border-black">999</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="font-bold hover:underline truncate">{post.user.name}</span>
              {post.user.verified && (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#1d9bf0] flex-shrink-0">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.97-.2-4.01.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.33c-.46 1.4-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.97.2 4.01-.81s1.27-2.62.81-4.01c1.31-.66 2.19-1.9 2.19-3.33zM9.99 17L5.57 12.58l1.41-1.41 3.01 3 6.01-6.01 1.41 1.41L9.99 17z" />
                </svg>
              )}
              <span className="text-[#71767b] truncate text-xs">@{post.user.handle} · {post.timestamp}</span>
            </div>
            
            {/* VIP Boost Button */}
            {currentUser.role !== 'member' && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowBoostPanel(!showBoostPanel); }}
                className="p-1 hover:bg-[#1d9bf0]/10 rounded-full text-[#1d9bf0] transition-transform active:rotate-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.66-3.13 9.03-7 10.2-3.87-1.17-7-5.54-7-10.2V6.3l7-3.12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>
              </button>
            )}
          </div>
          
          <p className="text-[15px] leading-normal whitespace-pre-wrap mb-2">{post.content}</p>

          {post.image && (
            <div className="mt-3 rounded-2xl border border-[#2f3336] overflow-hidden">
              <img src={post.image} className="w-full h-auto" alt="Content" />
            </div>
          )}

          {/* Metrics */}
          <div className="flex justify-between mt-3 text-[#71767b] -ml-2 max-w-[450px]">
            {/* Reply */}
            <div className="flex items-center group/action" onClick={(e) => e.stopPropagation()}>
              <div className="p-2 rounded-full group-hover/action:bg-[#031018] group-hover/action:text-[#1d9bf0] transition-colors">
                <Icons.Reply />
              </div>
              <span className="text-[11px] px-1 group-hover/action:text-[#1d9bf0] transition-colors">{formatCompactNumber(metrics.replies)}</span>
            </div>

            {/* Retweet */}
            <div className="flex items-center group/action" onClick={handleRetweet}>
              <div className={`p-2 rounded-full group-hover/action:bg-[#03120b] ${retweeted ? 'text-green-500' : 'group-hover/action:text-green-500'} transition-colors`}>
                <Icons.Retweet active={retweeted} />
              </div>
              <span className={`text-[11px] px-1 transition-colors ${retweeted ? 'text-green-500' : 'group-hover/action:text-green-500'}`}>{formatCompactNumber(metrics.retweets)}</span>
            </div>

            {/* Like Section */}
            <div className="flex items-center group/action" onClick={handleLike}>
              <div className={`p-2 rounded-full group-hover/action:bg-[#120309] ${liked ? 'text-rose-500' : 'group-hover/action:text-rose-500'} transition-colors`}>
                <Icons.Like active={liked} />
              </div>
              <span className={`text-[11px] px-1 transition-colors ${liked ? 'text-rose-500' : 'group-hover/action:text-rose-500'}`}>{formatCompactNumber(metrics.likes)}</span>
            </div>

            {/* Views */}
            <div className="flex items-center group/action" onClick={(e) => e.stopPropagation()}>
              <div className="p-2 rounded-full group-hover/action:bg-[#031018] group-hover/action:text-[#1d9bf0] transition-colors">
                <Icons.Views />
              </div>
              <span className="text-[11px] px-1 group-hover/action:text-[#1d9bf0] transition-colors">{formatCompactNumber(metrics.views)}</span>
            </div>

            {/* TTS Audio */}
            <div className="flex items-center group/action" onClick={handleSpeech}>
              <div className={`p-2 rounded-full hover:bg-[#031018] transition-colors ${isSpeaking ? 'animate-pulse text-[#1d9bf0]' : ''}`}>
                <Icons.Audio />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP BOOST MODAL */}
      {showBoostPanel && (
        <div className="absolute right-4 top-12 z-50 bg-[#16181c] border border-[#1d9bf0]/30 rounded-2xl shadow-2xl p-4 w-72 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-4 border-b border-[#2f3336] pb-2">
            <span className="text-yellow-400 font-black text-xs">VIP CHEAT PANEL</span>
            <div className="flex-1 h-[1px] bg-[#1d9bf0]/20"></div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
            {[
              { label: 'LIKE', key: 'likes' as const },
              { label: 'VIEWER', key: 'views' as const },
              { label: 'FOLLOW', key: 'retweets' as const },
              { label: 'REPOST', key: 'retweets' as const },
              { label: 'QUOTE', key: 'quotes' as const },
              ...(currentUser.role === 'developer' ? [{ label: 'BOOKMARK', key: 'bookmarks' as const }] : [])
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#71767b]">{item.label} BOOST</span>
                <div className="grid grid-cols-4 gap-1">
                  {[100, 1000, 10000, 100000].map(val => (
                    <button 
                      key={val} 
                      onClick={() => boost(item.key, val)}
                      className="text-[9px] bg-black border border-[#2f3336] hover:border-[#1d9bf0] hover:text-[#1d9bf0] py-1 rounded transition-colors font-bold"
                    >
                      +{formatCompactNumber(val)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowBoostPanel(false)}
            className="w-full mt-4 bg-[#1d9bf0] text-white text-[10px] font-bold py-2 rounded-full hover:bg-[#1a8cd8]"
          >
            TUTUP PANEL
          </button>
        </div>
      )}
    </div>
  );
};

export default Tweet;
