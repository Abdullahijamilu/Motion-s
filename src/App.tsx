
/// <reference types="vite/client" />
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import InputPanel from './components/InputPanel';
import AvatarView from './components/AvatarView';
import GlossTimeline from './components/GlossTimeline';
import InfoPanel from './components/InfoPanel';
import { useTranslation } from './hooks/useTranslation';
import { useSpeechInput } from './hooks/useSpeechInput';
import { Zap, Shield, Heart } from 'lucide-react';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const {
    input, setInput,
    targetLang, setTargetLang,
    isTranslating,
    output,
    error,
    isPlaying, setIsPlaying,
    playbackIndex,
    playbackProgress,
    handleTranslate,
    resetPlayback
  } = useTranslation(isMuted);

  const { isListening, toggleListening } = useSpeechInput(setInput);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar 
        targetLang={targetLang} 
        setTargetLang={setTargetLang} 
        isMuted={isMuted} 
        setIsMuted={setIsMuted} 
      />

      {/* ZONE 2: Hero / Translator */}
      <section id="translate" className="min-h-[calc(100vh-56px)] flex items-center py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left Side: Input */}
            <div className="order-2 lg:order-1">
              <InputPanel 
                input={input}
                setInput={setInput}
                targetLang={targetLang}
                isTranslating={isTranslating}
                isListening={isListening}
                toggleListening={toggleListening}
                onTranslate={handleTranslate}
                error={error}
              />
            </div>

            {/* Right Side: Avatar */}
            <div className="order-1 lg:order-2 h-[400px] md:h-[600px]">
              <AvatarView 
                output={output}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playbackIndex={playbackIndex}
                playbackProgress={playbackProgress}
                onReset={resetPlayback}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ZONE 3: Gloss Timeline */}
      <GlossTimeline output={output} playbackIndex={playbackIndex} />

      {/* ZONE 4: Stacked Info Content */}
      <div className="bg-slate-900/40 backdrop-blur-3xl border-t border-white/5">
        <div className="container mx-auto px-6 md:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Info and Analytics Column */}
            <div className="lg:col-span-1">
              <InfoPanel output={output} playbackProgress={playbackProgress} />
            </div>

            {/* Content Column */}
            <div className="lg:col-span-2 space-y-24">
              {/* How it works */}
              <section id="how-it-works" className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white tracking-tight">How it works</h2>
                  <p className="text-lg text-slate-400 max-w-xl">Motion-S uses advanced linguistic analysis to reconstruct natural language into spatial animations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: <Zap className="text-indigo-400" />, title: "Translate", desc: "Type or speak any phrase. Our neural model identifies the core linguistic units." },
                    { icon: <Shield className="text-indigo-400" />, title: "Process", desc: "The engine maps glosses to 3D joint rotations specific to ASL, BSL, or NSL." },
                    { icon: <Heart className="text-indigo-400" />, title: "Visualize", desc: "The humanoid avatar performs the reconstructed sequence in real-time." }
                  ].map((step, i) => (
                    <div key={i} className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                        {step.icon}
                      </div>
                      <h4 className="text-xl font-bold text-white">{step.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* About */}
              <section id="about" className="space-y-12 pt-12 border-t border-white/5">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white tracking-tight">About Motion-S</h2>
                  <p className="text-lg text-slate-400 max-w-2xl">
                    Our mission is to bridge the gap between text-based communication and sign language accessibility. 
                    Motion-S provides a high-fidelity visual interface for learning and cross-linguistic translation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Accessibility First</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Every joint and finger on our 3D model is designed to express the nuances of sign language handshapes, 
                      ensuring clear and readable visual output for users worldwide.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Global Standards</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Whether you are in the US using ASL, the UK with BSL, or Nigeria with NSL, 
                      our platform adapts to regional variations in signing grammar and vocabulary.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="container mx-auto px-8 flex flex-col md:row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                <Globe className="text-slate-500 w-3 h-3" />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">© 2026 MOTION-S by Signvrse</span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Globe(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
