import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Brain, Fingerprint, Info, AlertTriangle, ChevronRight, 
  Download, Terminal, Mic, MicOff, History, Trash2, Star, 
  Play, Pause, RotateCcw, Volume2, VolumeX, Settings, X, ChevronDown, Check, Activity, Globe
} from 'lucide-react';
import { translateToSignLanguage } from '../services/geminiService';
import { SignLanguageOutput, TargetLanguage } from '../constants';
import SignAvatar from './SignAvatar';

interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  targetLang: TargetLanguage;
  output: SignLanguageOutput;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export default function Translator() {
  const [input, setInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [output, setOutput] = useState<SignLanguageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [targetLang, setTargetLang] = useState<TargetLanguage>('ASL');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [rating, setRating] = useState(0);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'history' | 'analytics'>('history');

  const timelineRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = output?.pace === 'slow' ? 0.7 : 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => window.speechSynthesis.cancel();

  useEffect(() => {
    let interval: any;
    if (isPlaying && output) {
      const totalGlosses = output.gloss_sequence.length;
      const durationPerGloss = output.duration_estimate_ms / totalGlosses;
      
      interval = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= totalGlosses - 1) {
            setIsPlaying(false);
            setPlaybackProgress(100);
            stopSpeaking();
            return prev;
          }
          const next = prev + 1;
          setPlaybackProgress(((next + 1) / totalGlosses) * 100);
          return next;
        });
      }, durationPerGloss);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, output]);

  useEffect(() => {
    setRating(0);
    setFeedbackSuccess(false);
    setPlaybackIndex(-1);
    setPlaybackProgress(0);
    setIsPlaying(false);
    stopSpeaking();
  }, [output]);

  useEffect(() => {
    const saved = localStorage.getItem('motion_s_history');
    if (saved) setHistory(JSON.parse(saved));
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    if (playbackIndex !== -1 && timelineRef.current) {
      const activeEl = timelineRef.current.children[playbackIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [playbackIndex]);

  const saveToHistory = (inputStr: string, lang: TargetLanguage, outputObj: SignLanguageOutput) => {
    const newItem: HistoryItem = { id: Math.random().toString(36).substring(2, 9), timestamp: Date.now(), input: inputStr, targetLang: lang, output: outputObj };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('motion_s_history', JSON.stringify(updated));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.input);
    setTargetLang(item.targetLang);
    setOutput(item.output);
    setIsSidebarOpen(false);
  };

  const handleTranslate = async () => {
    if (!input.trim() || isTranslating) return;
    setIsTranslating(true);
    setError(null);
    try {
      const result = await translateToSignLanguage(input, targetLang);
      setOutput(result);
      if (result.clarification_needed) setError(result.clarification_needed);
      else saveToHistory(input, targetLang, result);
    } catch (err: any) {
      setError(err.message || "Neural engine processing error.");
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setError("Speech recognition not supported.");
    if (isListening) { setIsListening(false); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  return (
    <div className="h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 flex overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative z-20">
        {/* Simple Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
               <Globe className="text-white w-6 h-6" />
             </div>
             <div>
               <h1 className="text-lg font-bold tracking-tight text-white leading-none">Motion-S</h1>
               <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">Real-time Sign Protocol</p>
             </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as TargetLanguage)}
                  className="bg-transparent text-xs font-bold uppercase tracking-wider text-slate-300 outline-none cursor-pointer"
                >
                  <option value="ASL" className="bg-slate-900 font-sans">ASL (USA)</option>
                  <option value="BSL" className="bg-slate-900 font-sans">BSL (UK)</option>
                  <option value="NSL" className="bg-slate-900 font-sans">NSL (NG)</option>
                </select>
             </div>

             <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl border transition-all ${isMuted ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}
             >
               {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>

             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all"
             >
               <History className="w-4 h-4" />
             </button>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left: Input & Interaction */}
          <div className="w-[450px] border-r border-white/5 flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Source Context</label>
                {isTranslating && (
                   <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                     <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Synthesizing...</span>
                   </motion.div>
                )}
              </div>
              <div className="relative group">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type anything to translate into sign language..."
                  className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-base leading-relaxed text-slate-200 placeholder:text-slate-700 resize-none outline-none focus:border-indigo-500/50 transition-all font-serif"
                />
                <button
                  onClick={toggleListening}
                  className={`absolute bottom-6 left-6 p-4 rounded-full border transition-all ${isListening ? 'bg-red-500 border-red-400 text-white shadow-xl shadow-red-500/20' : 'bg-black/40 border-white/10 text-slate-500 hover:text-white'}`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleTranslate}
                  disabled={!input.trim() || isTranslating}
                  className="absolute bottom-6 right-6 h-12 px-6 bg-white text-black hover:bg-slate-200 disabled:opacity-30 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/10 active:scale-95"
                >
                  {isTranslating ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Finalize
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200 leading-relaxed font-mono">{error}</p>
              </motion.div>
            )}

            {output && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 block">Glossematic Sequence</label>
                  <div ref={timelineRef} className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {output.gloss_sequence.map((gloss, idx) => (
                      <motion.div 
                        key={`${gloss}-${idx}`}
                        animate={{ 
                          backgroundColor: playbackIndex === idx ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                          borderColor: playbackIndex === idx ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.05)',
                          x: playbackIndex === idx ? 8 : 0
                        }}
                        className="p-4 rounded-2xl border flex items-center justify-between group cursor-default transition-all"
                      >
                         <div className="flex items-center gap-4">
                           <span className="text-[10px] font-mono text-slate-600 font-black">{(idx + 1).toString().padStart(2, '0')}</span>
                           <span className={`text-sm font-bold font-serif ${playbackIndex === idx ? 'text-indigo-400' : 'text-slate-400'}`}>{gloss}</span>
                         </div>
                         <div className={`w-1.5 h-1.5 rounded-full ${playbackIndex >= idx ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Visualization Stage */}
          <div className="flex-1 bg-black relative overflow-hidden flex flex-col">
             {/* Scene Background */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
             
             {/* Main Avatar Canvas */}
             <div className="flex-1 relative">
                <SignAvatar 
                  output={output} 
                  playbackIndex={playbackIndex} 
                  playbackProgress={playbackProgress}
                  isPlaying={isPlaying}
                />

                {/* Overlays on Stage */}
                <div className="absolute top-10 left-10 flex flex-col gap-4">
                   <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`} />
                      <span className="text-[10px] font-black uppercase text-slate-300 font-mono tracking-widest">
                        Stream.{isPlaying ? 'Active' : 'Buffered'}
                      </span>
                   </div>
                   
                   {output && (
                     <div className="flex gap-2">
                       <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">{output.sign_language} Protocol</span>
                       </div>
                       <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                         <span className="text-[9px] font-bold text-slate-500 uppercase">{output.pace} Pace</span>
                       </div>
                     </div>
                   )}
                </div>

                {/* Main Interaction Hub */}
                {output && (
                  <div className="absolute bottom-12 inset-x-0 flex justify-center px-12">
                    <div className="max-w-2xl w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 flex items-center grow shadow-2xl ring-1 ring-white/5">
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                           <button onClick={() => { setIsPlaying(false); setPlaybackIndex(-1); setPlaybackProgress(0); stopSpeaking(); }} className="p-4 text-slate-500 hover:text-white transition-colors">
                             <RotateCcw className="w-5 h-5" />
                           </button>
                        </div>

                        <div className="flex-1 flex flex-col gap-2 px-8">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reconstruction Flow</span>
                              <span className="text-[10px] font-mono text-indigo-400 font-bold">{Math.round(playbackProgress)}%</span>
                           </div>
                           <div className="h-1 (W-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500" 
                                animate={{ width: `${playbackProgress}%` }} 
                                transition={{ duration: 0.1 }}
                              />
                           </div>
                        </div>

                        <button 
                          onClick={() => {
                            if (isPlaying) { setIsPlaying(false); stopSpeaking(); }
                            else { if (playbackIndex === -1 || playbackIndex >= output.gloss_sequence.length - 1) { setPlaybackIndex(-1); setPlaybackProgress(0); } speak(input); setIsPlaying(true); }
                          }}
                          className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 shrink-0"
                        >
                          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
                        </button>
                    </div>
                  </div>
                )}

                {/* Empty State Instructions */}
                {!output && !isTranslating && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                      <div className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center mb-8 relative">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }} 
                          className="absolute inset-0 border-t-2 border-indigo-500/20 rounded-full" 
                        />
                        <Brain className="w-10 h-10 text-slate-800" />
                      </div>
                      <h2 className="text-2xl font-serif italic text-slate-600 mb-2">Awaiting Neural Instructions</h2>
                      <p className="text-xs text-slate-700 max-w-xs leading-relaxed uppercase tracking-widest font-mono">Input linguistic data to begin synthesis process</p>
                   </div>
                )}
             </div>

             {/* Bottom Metadata Bar */}
             <div className="h-12 border-t border-white/5 px-8 flex items-center justify-between bg-black/50">
               <div className="flex gap-6">
                 <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                   <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter">Engine: GEMINI_FLASH_2.0</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-green-500/50 rounded-full" />
                   <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter">Latency: 42ms</span>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-widest leading-none pr-4 border-r border-white/5">© 2026 MOTION_S</span>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                 </div>
               </div>
             </div>
          </div>
        </main>
      </div>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 inset-y-0 w-96 bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                 <h2 className="text-xl font-bold text-white tracking-tight">System Archive</h2>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20">
                    <History className="w-12 h-12 mb-4" />
                    <p className="text-xs uppercase tracking-widest font-mono">No Records Identified</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-sm text-slate-300 font-serif leading-relaxed mb-4 line-clamp-2">{item.input}</p>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest border-t border-white/5 pt-4">
                        <span className="text-indigo-400 font-black">{item.targetLang}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-white/5 bg-black/50">
                <button 
                  onClick={() => { localStorage.removeItem('motion_s_history'); setHistory([]); }}
                  className="w-full py-4 rounded-2xl border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/5 transition-all text-center"
                >
                  Purge Local Archive
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}
