
import React, { useState, useEffect, useRef } from 'react';
import { generateVideo, extendVideo } from '../services/geminiService';
import { VideoClip } from '../types';

interface VideoGenerationModalProps {
  onClose: () => void;
  onGenerated: (clips: VideoClip[]) => void;
}

const VideoGenerationModal: React.FC<VideoGenerationModalProps> = ({ onClose, onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'key-required' | 'generating' | 'editing' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setStatus('key-required');
      }
    } catch (err) {
      console.error("Error checking API key:", err);
    }
  };

  const handleOpenKeyPicker = async () => {
    await (window as any).aistudio.openSelectKey();
    setStatus('idle');
  };

  const handleGenerate = async (extend: boolean = false) => {
    if (!prompt.trim()) return;
    setStatus('generating');
    try {
      let result;
      if (extend && clips.length > 0) {
        const lastClip = clips[clips.length - 1];
        result = await extendVideo(prompt, lastClip.uri || '', (msg) => setStatusMessage(msg));
      } else {
        result = await generateVideo(prompt, (msg) => setStatusMessage(msg));
      }

      const newClip: VideoClip = {
        id: Date.now().toString(),
        url: result.url,
        uri: result.uri,
        start: 0,
        end: 1
      };
      
      const newClips = [...clips, newClip];
      setClips(newClips);
      setActiveClipIndex(newClips.length - 1);
      setStatus('editing');
      setPrompt('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to generate video.');
      if (err.message?.includes("Requested entity was not found")) {
        setStatus('key-required');
      }
    }
  };

  const updateActiveTrim = (field: 'start' | 'end', value: number) => {
    const updatedClips = [...clips];
    const current = updatedClips[activeClipIndex];
    
    // Validation: ensure start is always less than end with a minimum duration
    let newStart = current.start;
    let newEnd = current.end;

    if (field === 'start') {
      newStart = Math.min(value, newEnd - 0.05);
    } else {
      newEnd = Math.max(value, newStart + 0.05);
    }

    updatedClips[activeClipIndex] = { ...current, start: newStart, end: newEnd };
    setClips(updatedClips);

    // Seek the video to provide immediate visual feedback of the trim point
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (field === 'start' ? newStart : newEnd) * videoRef.current.duration;
      // Ensure it stays playing for a "live" feel while adjusting
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleFinish = () => {
    onGenerated(clips);
    onClose();
  };

  const currentClip = clips[activeClipIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#000000] border border-[#2f3336] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-[#181818] rounded-full transition-colors" aria-label="Close modal">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" /></svg>
          </button>
          <div className="flex items-center gap-2">
             <span className="bg-[#1d9bf0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BETA</span>
             <h2 className="text-lg font-bold">AI Video Studio</h2>
          </div>
          {clips.length > 0 ? (
            <button 
              onClick={handleFinish}
              className="bg-white text-black px-4 py-1 rounded-full font-bold text-sm hover:bg-[#d7dbdc] transition-colors"
            >
              Done
            </button>
          ) : <div className="w-9" />}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Stage */}
          <div className="flex-1 bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
            {status === 'generating' ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 border-4 border-[#1d9bf0]/20 border-t-[#1d9bf0] rounded-full animate-spin"></div>
                <p className="text-xl font-bold animate-pulse">{statusMessage}</p>
              </div>
            ) : status === 'key-required' ? (
              <div className="max-w-md text-center space-y-4">
                <p className="text-lg font-bold">Paid API Key Required</p>
                <p className="text-sm text-[#71767b]">This feature requires a paid Gemini API key for video generation.</p>
                <button onClick={handleOpenKeyPicker} className="bg-[#1d9bf0] text-white font-bold px-6 py-2 rounded-full hover:bg-[#1a8cd8] transition-colors">Select Key</button>
              </div>
            ) : status === 'error' ? (
              <div className="text-center space-y-4 px-6">
                <div className="text-rose-500 mb-2">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 mx-auto fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
                <p className="text-lg font-bold">Generation Failed</p>
                <p className="text-sm text-[#71767b]">{errorMessage}</p>
                <button onClick={() => setStatus('idle')} className="bg-[#2f3336] text-white font-bold px-6 py-2 rounded-full hover:bg-[#3e4144] transition-colors">Try Again</button>
              </div>
            ) : clips.length > 0 ? (
              <div className="w-full max-w-2xl flex flex-col gap-4">
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#2f3336] shadow-lg relative group">
                  <video 
                    ref={videoRef}
                    key={currentClip.id}
                    src={currentClip.url} 
                    className="w-full h-full object-contain"
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (!v.duration) return;
                      const startTime = currentClip.start * v.duration;
                      const endTime = currentClip.end * v.duration;
                      
                      // Robust looping within trimmed bounds
                      if (v.currentTime >= endTime || v.currentTime < startTime - 0.1) {
                        v.currentTime = startTime;
                        if (v.paused) v.play().catch(() => {});
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      v.currentTime = currentClip.start * v.duration;
                      v.play().catch(() => {});
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    Clip {activeClipIndex + 1} of {clips.length}
                  </div>
                </div>

                {/* Trimming Controls */}
                <div className="bg-[#16181c] p-6 rounded-xl border border-[#2f3336] shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Trim Clip</span>
                      <span className="text-[10px] text-[#71767b] bg-[#2f3336] px-1.5 py-0.5 rounded">AUTO-LOOPING</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-[#1d9bf0]">
                      <span className="bg-black/40 px-2 py-1 rounded">START: {(currentClip.start * 100).toFixed(1)}%</span>
                      <span className="bg-black/40 px-2 py-1 rounded">END: {(currentClip.end * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="relative h-12 flex items-center group/timeline">
                    {/* Visual Timeline Base */}
                    <div className="w-full h-3 bg-[#2f3336] rounded-full relative overflow-hidden">
                       {/* Active Range Highlight */}
                       <div 
                        className="absolute h-full bg-[#1d9bf0] shadow-[0_0_15px_rgba(29,155,240,0.4)] transition-all duration-75" 
                        style={{ left: `${currentClip.start * 100}%`, width: `${(currentClip.end - currentClip.start) * 100}%` }}
                       />
                    </div>
                    
                    {/* Dual Range Sliders (Overlaid) */}
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <input 
                        type="range" min="0" max="1" step="0.001" 
                        value={currentClip.start}
                        onChange={(e) => updateActiveTrim('start', parseFloat(e.target.value))}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer range-thumb-blue z-20"
                        aria-label="Adjust start point"
                      />
                      <input 
                        type="range" min="0" max="1" step="0.001" 
                        value={currentClip.end}
                        onChange={(e) => updateActiveTrim('end', parseFloat(e.target.value))}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer range-thumb-blue z-10"
                        aria-label="Adjust end point"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] text-[#71767b] text-center italic">Adjust handles to update the live looping boundaries.</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#1d9bf0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg viewBox="0 0 24 24" className="h-10 w-10 fill-[#1d9bf0]"><path d="M19 7h-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM5 15V5h10v2H9c-1.1 0-2 .9-2 2v6H5zm14 4H9V9h10v10zM15 11l-3 4h6l-3-4z" /></svg>
                </div>
                <h3 className="text-2xl font-bold">Dream with AI</h3>
                <p className="text-[#71767b] max-w-sm mx-auto">Generate high-fidelity clips, merge them, and trim the perfect sequence using Gemini Veo 3.1.</p>
              </div>
            )}
          </div>

          {/* Sidebar / Prompt Panel */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#2f3336] p-4 bg-black flex flex-col shrink-0">
            <div className="flex-1 space-y-4">
              <label className="text-xs font-bold text-[#71767b] uppercase tracking-wider block">Prompt Instructions</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={clips.length > 0 ? "Add more to the story..." : "A futuristic city with flying neon taxis..."}
                className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl p-4 h-32 focus:outline-none focus:border-[#1d9bf0] resize-none text-sm transition-all shadow-inner placeholder:text-[#3e4144]"
              />
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleGenerate(false)}
                  disabled={!prompt.trim() || status === 'generating'}
                  className="w-full bg-[#1d9bf0] disabled:opacity-50 text-white font-bold py-3 rounded-full text-sm hover:bg-[#1a8cd8] transition-all shadow-md active:scale-95"
                >
                  {clips.length > 0 ? 'Generate New Separate Clip' : 'Generate Clip'}
                </button>
                {clips.length > 0 && (
                  <button 
                    onClick={() => handleGenerate(true)}
                    disabled={!prompt.trim() || status === 'generating'}
                    className="w-full border border-[#1d9bf0] text-[#1d9bf0] disabled:opacity-50 font-bold py-3 rounded-full text-sm hover:bg-[#1d9bf0]/10 transition-all active:scale-95"
                  >
                    ✨ Extend Previous Sequence
                  </button>
                )}
              </div>
            </div>

            {/* Clips Timeline (Merge View) */}
            {clips.length > 0 && (
              <div className="mt-8 border-t border-[#2f3336] pt-4">
                <h4 className="text-xs font-bold text-[#71767b] uppercase tracking-widest mb-3">Timeline (Merged Clips)</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {clips.map((clip, idx) => (
                    <div 
                      key={clip.id}
                      onClick={() => setActiveClipIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeClipIndex === idx ? 'border-[#1d9bf0] scale-105 shadow-[0_0_12px_rgba(29,155,240,0.6)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                      <video 
                        src={clip.url} 
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => {
                          e.currentTarget.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold bg-black/30 backdrop-blur-[1px] pointer-events-none">
                        #{idx + 1}
                      </div>
                      {/* Delete clip button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const newClips = clips.filter((_, i) => i !== idx);
                          setClips(newClips);
                          if (activeClipIndex >= newClips.length) setActiveClipIndex(Math.max(0, newClips.length - 1));
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full hover:bg-rose-500 transition-colors z-10"
                      >
                         <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .range-thumb-blue::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 24px;
          background: #1d9bf0;
          border: 2px solid white;
          border-radius: 4px;
          cursor: ew-resize;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transition: transform 0.1s ease;
        }
        .range-thumb-blue::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #1a8cd8;
        }
        .range-thumb-blue::-moz-range-thumb {
          width: 16px;
          height: 24px;
          background: #1d9bf0;
          border: 2px solid white;
          border-radius: 4px;
          cursor: ew-resize;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default VideoGenerationModal;
