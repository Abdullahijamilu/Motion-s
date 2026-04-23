
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { TargetLanguage } from '../constants';

interface NavbarProps {
  targetLang: TargetLanguage;
  setTargetLang: (lang: TargetLanguage) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export default function Navbar({ targetLang, setTargetLang, isMuted, setIsMuted }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Translate', href: '#translate' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'About', href: '#about' }
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 h-[56px] border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('#translate')}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Globe className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-tight text-white leading-none">MOTION-S</h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">by Signvrse</p>
        </div>
      </div>

      {/* Center Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(link => (
          <button 
            key={link.label}
            onClick={() => scrollTo(link.href)}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-full">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Sign Language:</span>
          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as TargetLanguage)}
            className="bg-transparent text-[11px] font-black text-indigo-400 outline-none cursor-pointer"
          >
            <option value="ASL">ASL</option>
            <option value="BSL">BSL</option>
            <option value="NSL">NSL</option>
          </select>
        </div>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-lg border transition-all ${isMuted ? 'border-red-500/20 text-red-500' : 'border-white/5 text-slate-400 hover:text-white'}`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button 
          className="md:hidden p-2 text-slate-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[56px] left-0 right-0 bg-slate-900 border-b border-white/5 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map(link => (
              <button 
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-left text-sm font-bold text-slate-200"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
