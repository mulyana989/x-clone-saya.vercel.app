
import React, { useState } from 'react';
import { Icons } from '../constants';
import { improveTweet, generateProImage } from '../services/geminiService';
import VideoGenerationModal from './VideoGenerationModal';
import { VideoClip, User } from '../types';

interface TweetBoxProps {
  onPost: (content: string, media?: { type: 'image' | 'video', url?: string, sequence?: VideoClip[] }) => void;
  currentUser: User;
}

const TweetBox: React.FC<TweetBoxProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoSequence, setVideoSequence] = useState<VideoClip[] | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handlePost = () => {
    if (content.trim() || videoSequence || generatedImg) {
      onPost(content, 
        videoSequence ? { type: 'video', sequence: videoSequence } : 
        generatedImg ? { type: 'image', url: generatedImg } : undefined
      );
      setContent('');
      setVideoSequence(null);
      setGeneratedImg(null);
    }
  };

  const handleGenImage = async () => {
    if (!content.trim()) return;
    setIsGeneratingImg(true);
    try {
      const url = await generateProImage(content, '1K', '1:1');
      setGeneratedImg(url);
    } catch (err) {
      alert("Gagal menghasilkan gambar AI.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-[#2f3336] flex gap-4">
      {showVideoModal && <VideoGenerationModal onClose={() => setShowVideoModal(false)} onGenerated={(clips) => setVideoSequence(clips)} />}
      <div className="relative flex-shrink-0">
        <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-[#2f3336]" />
        {currentUser.role !== 'member' && <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>}
      </div>
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Apa yang sedang terjadi?!"
          className="w-full bg-transparent text-xl placeholder-[#71767b] focus:outline-none resize-none min-h-[50px]"
        />

        {(generatedImg || isGeneratingImg) && (
          <div className="relative mt-3 rounded-2xl overflow-hidden border border-[#2f3336] bg-black">
            {isGeneratingImg ? <div className="p-10 text-center animate-pulse text-[#1d9bf0] text-xs">Menghasilkan Gambar AI...</div> : <img src={generatedImg!} className="w-full h-auto" />}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 border-t border-[#2f3336] pt-3">
          <div className="flex items-center gap-1">
            <button onClick={handleGenImage} className="p-2 rounded-full hover:bg-[#1d9bf0]/10" title="AI Image"><Icons.ImageGen /></button>
            
            {/* VIP Restricted Video */}
            <div className="relative group">
              <button 
                onClick={() => currentUser.role !== 'member' ? setShowVideoModal(true) : alert("Fitur Video hanya untuk VIP!")} 
                className={`p-2 rounded-full hover:bg-[#1d9bf0]/10 ${currentUser.role === 'member' ? 'opacity-30 grayscale' : ''}`} 
                title="AI Video Studio (VIP)"
              >
                <Icons.VideoGen />
              </button>
              {currentUser.role === 'member' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1d9bf0] text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  VIP ONLY
                </div>
              )}
            </div>

            <button className="p-2 rounded-full hover:bg-[#1d9bf0]/10"><Icons.Gif /></button>
            <button className="p-2 rounded-full hover:bg-[#1d9bf0]/10"><Icons.Poll /></button>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handlePost} disabled={!content.trim()} className="bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-full transition-colors">Posting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
