
import React from 'react';
import { ContentAsset } from '../types';

const ContentCard: React.FC<{ content: ContentAsset }> = ({ content }) => {
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Selfie': return 'from-pink-500 to-rose-400';
      case 'POV': return 'from-blue-500 to-indigo-400';
      case 'Landscape': return 'from-emerald-500 to-teal-400';
      case 'Animal': return 'from-amber-500 to-orange-400';
      default: return 'from-neutral-500 to-neutral-400';
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-neutral-800 rounded-[3.5rem] overflow-hidden group hover:border-pink-500/30 transition-all duration-700 shadow-2xl">
      <div className="relative aspect-[4/5] overflow-hidden">
        {content.imageUrl ? (
          <img 
            src={content.imageUrl} 
            alt="Meltem AI Content" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s] ease-out filter brightness-90 group-hover:brightness-100" 
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.3em]">Processing Frame</p>
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-10 left-10 flex flex-col gap-4">
          <div className="bg-black/40 backdrop-blur-2xl border border-white/5 px-5 py-2.5 rounded-2xl flex items-center gap-4">
            <i className={`fab fa-${content.platform.toLowerCase() === 'x' ? 'twitter' : content.platform.toLowerCase()} text-sm`}></i>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{content.platform}</span>
          </div>
          <div className={`bg-gradient-to-r ${getTypeColor(content.type)} px-4 py-1.5 rounded-xl self-start shadow-xl`}>
             <span className="text-[10px] font-black uppercase tracking-tighter text-white">{content.type}</span>
          </div>
        </div>

        {/* Neural Depth Diagnostics */}
        <div className="absolute bottom-8 left-8 right-8 space-y-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
          <div className="bg-black/90 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Neural Realism</span>
                <span className="text-sm font-black text-green-400">%{content.metrics?.naturalnessScore}</span>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full transition-all duration-1500" style={{ width: `${content.metrics?.naturalnessScore}%` }}></div>
             </div>
             <div className="mt-6 flex justify-between items-center text-[10px] font-black text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  ENG: %{content.metrics?.engagementRate.toFixed(1)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  AUDIO: {content.metrics?.audioDepth}dB
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-10">
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-black text-xl italic tracking-tight group-hover:text-pink-500 transition-colors uppercase leading-tight line-clamp-1">{content.hook}</h4>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
             <i className="fas fa-eye text-[11px] text-pink-500"></i>
             <span className="text-sm font-black tabular-nums">{content.metrics?.views.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-[13px] text-neutral-400 leading-relaxed h-14 line-clamp-2 font-medium italic mb-8">"{content.caption}"</p>
        
        <div className="flex items-center justify-between pt-8 border-t border-neutral-800/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-neutral-600 uppercase mb-1">Identity Lock</span>
            <div className="flex items-center gap-2">
              <i className="fas fa-fingerprint text-[10px] text-green-500"></i>
              <span className="text-[11px] font-black text-neutral-300">#{content.visualHash.slice(0, 10)}</span>
            </div>
          </div>
          <button className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all group-hover:scale-110 shadow-xl">
            <i className="fas fa-arrow-up-right-from-square text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
