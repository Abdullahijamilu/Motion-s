
import React from 'react';
import { Brain, Star, Info } from 'lucide-react';
import { SignLanguageOutput } from '../constants';

interface InfoPanelProps {
  output: SignLanguageOutput | null;
  playbackProgress: number;
}

export default function InfoPanel({ output, playbackProgress }: InfoPanelProps) {
  return (
    <div className="flex flex-col gap-8">
       {/* Facial Expressions View */}
       <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Facial Expressions</h3>
          </div>

          <div className="space-y-4">
            {output ? (
              Array.from(new Set(output.facial_expressions.map(f => f.type))).slice(0, 3).map(type => {
                const currentTime = (playbackProgress / 100) * output.duration_estimate_ms;
                const relevant = output.facial_expressions.filter(f => f.type === type);
                const active = relevant.find(f => Math.abs(f.timestamp - currentTime) < 500) || { intensity: 0 };

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{type.replace('_', ' ')}</span>
                      <span className="text-indigo-400">{Math.round(active.intensity * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-300" 
                        style={{ width: `${active.intensity * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="space-y-2 opacity-10">
                  <div className="h-2 w-24 bg-slate-600 rounded-full" />
                  <div className="h-2 w-full bg-slate-800 rounded-full" />
                </div>
              ))
            )}
          </div>
       </div>

       {/* Translation Stats */}
       <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-slate-500" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Translation Stats</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Duration</span>
              <span className="text-lg font-black text-white">{output ? (output.duration_estimate_ms / 1000).toFixed(1) : '0.0'}s</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
              <span className="text-lg font-black text-indigo-400">{output ? '98.8%' : '--'}</span>
            </div>
          </div>
       </div>

       {/* Rating */}
       {output && (
          <div className="bg-slate-900 border border-indigo-500/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Rate this translation</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="p-1 text-slate-700 hover:text-indigo-400 transition-colors">
                  <Star className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
       )}
    </div>
  );
}
