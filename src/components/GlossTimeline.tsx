
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SignLanguageOutput } from '../constants';

interface GlossTimelineProps {
  output: SignLanguageOutput | null;
  playbackIndex: number;
}

export default function GlossTimeline({ output, playbackIndex }: GlossTimelineProps) {
  if (!output) return null;

  return (
    <div className="w-full bg-slate-900/20 border-y border-white/5 py-8 md:py-12 overflow-hidden overflow-x-auto custom-scrollbar">
       <div className="container mx-auto px-8">
         <div className="flex gap-4 min-w-max pb-4">
            {output.gloss_sequence.map((gloss, idx) => {
              const params = output.handshape_params[idx];
              const isActive = playbackIndex === idx;
              
              return (
                <motion.div 
                  key={`${gloss}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: playbackIndex > idx ? 0.3 : 1,
                    scale: isActive ? 1.05 : 1,
                    borderColor: isActive ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                  className={`w-48 h-28 p-5 bg-slate-900 border rounded-3xl flex flex-col justify-between transition-colors shadow-xl ${isActive ? 'bg-indigo-600/10' : ''}`}
                >
                  <div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Sign {idx + 1}</span>
                    <h4 className={`text-xl font-black uppercase tracking-tight truncate ${isActive ? 'text-indigo-400' : 'text-white'}`}>{gloss}</h4>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>{params?.location || 'Neutral'}</span>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                  </div>
                </motion.div>
              );
            })}
         </div>
       </div>
    </div>
  );
}
