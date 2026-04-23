
import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SignLanguageOutput } from '../constants';
import SignAvatar from './SignAvatar';

interface AvatarViewProps {
  output: SignLanguageOutput | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackIndex: number;
  playbackProgress: number;
  onReset: () => void;
}

export default function AvatarView({ 
  output, isPlaying, setIsPlaying, playbackIndex, playbackProgress, onReset 
}: AvatarViewProps) {
  return (
    <div className="relative w-full h-full bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group">
      {/* 3D Scene */}
      <SignAvatar 
        output={output} 
        playbackIndex={playbackIndex} 
        playbackProgress={playbackProgress}
        isPlaying={isPlaying}
      />

      {/* Overlays */}
      <div className="absolute top-8 left-8">
        <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-slate-600'}`} />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Visual Reconstruction</span>
        </div>
      </div>

      {output && (
        <div className="absolute bottom-10 inset-x-0 flex justify-center px-10 pointer-events-none">
          <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center gap-6 pointer-events-auto shadow-2xl">
            <button 
              onClick={onReset}
              className="p-3 text-slate-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>

            <div className="flex-1 flex flex-col gap-1.5 pr-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                <span>Timeline</span>
                <span className="text-indigo-400">{Math.round(playbackProgress)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-100" 
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Overlay */}
      {!output && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
          <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center mb-6 opacity-20">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h3 className="text-lg font-black text-white/40 uppercase tracking-widest mb-2">Avatar Standby</h3>
          <p className="text-xs text-slate-600 max-w-xs uppercase font-bold tracking-tight">Translation engine awaiting linguistic input</p>
        </div>
      )}
    </div>
  );
}
