
import React from 'react';
import { Send, Mic, MicOff, AlertTriangle, Activity } from 'lucide-react';
import { TargetLanguage } from '../constants';

interface InputPanelProps {
  input: string;
  setInput: (val: string) => void;
  targetLang: TargetLanguage;
  isTranslating: boolean;
  isListening: boolean;
  toggleListening: () => void;
  onTranslate: () => void;
  error: string | null;
}

export default function InputPanel({ 
  input, setInput, targetLang, isTranslating, isListening, toggleListening, onTranslate, error 
}: InputPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-2">What do you want to sign?</h2>
        <p className="text-sm text-slate-500">Your text will be reconstructed as {targetLang} animations.</p>
      </div>

      <div className="relative">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Hello, how are you today?"
          className="w-full h-48 bg-slate-900 border border-white/5 rounded-3xl p-6 text-lg text-white placeholder:text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
        />
        
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all ${isListening ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'}`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          {isListening && (
            <span className="text-[10px] font-black text-red-400 animate-pulse uppercase tracking-widest">Listening...</span>
          )}
        </div>

        <button 
          onClick={onTranslate}
          disabled={!input.trim() || isTranslating}
          className="absolute bottom-6 right-6 h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-500 disabled:opacity-30 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          {isTranslating ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Translate
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="text-red-500 w-5 h-5" />
          <p className="text-xs text-red-200 font-bold uppercase tracking-tight">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <div className="px-4 py-2 bg-slate-900 rounded-full border border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Ready</span>
        </div>
        <div className="px-4 py-2 bg-slate-900 rounded-full border border-white/5 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{targetLang} Mode Activated</span>
        </div>
      </div>
    </div>
  );
}
