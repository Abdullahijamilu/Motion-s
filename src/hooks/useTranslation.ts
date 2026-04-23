
import { useState, useEffect, useCallback } from 'react';
import { translateToSignLanguage } from '../services/geminiService';
import { SignLanguageOutput, TargetLanguage } from '../constants';

export function useTranslation(isMuted: boolean) {
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState<TargetLanguage>('ASL');
  const [isTranslating, setIsTranslating] = useState(false);
  const [output, setOutput] = useState<SignLanguageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setPlaybackIndex(-1);
    setPlaybackProgress(0);
    window.speechSynthesis.cancel();
  }, []);

  const handleTranslate = async () => {
    if (!input.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setError(null);
    resetPlayback();
    setOutput(null);

    try {
      const result = await translateToSignLanguage(input, targetLang);
      setOutput(result);
      if (result.clarification_needed) {
        setError(`Linguistic check: ${result.clarification_needed}`);
      }
    } catch (err: any) {
      setError(err.message || "Translation engine error.");
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying && output) {
      const totalGlosses = output.gloss_sequence.length;
      if (totalGlosses === 0) {
        setIsPlaying(false);
        return;
      }

      const durationPerGloss = output.duration_estimate_ms / totalGlosses;
      
      interval = setInterval(() => {
        setPlaybackIndex(prev => {
          const next = prev + 1;
          if (next >= totalGlosses) {
            setIsPlaying(false);
            setPlaybackProgress(100);
            return prev;
          }

          setPlaybackProgress(((next + 1) / totalGlosses) * 100);
          return next;
        });
      }, Math.max(durationPerGloss, 900));
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, output]);

  // TTS Side Effect
  useEffect(() => {
    if (playbackIndex >= 0 && output && !isMuted && isPlaying) {
      const gloss = output.gloss_sequence[playbackIndex];
      if (gloss) {
        const utterance = new SpeechSynthesisUtterance(gloss);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [playbackIndex, output, isMuted, isPlaying]);

  return {
    input, setInput,
    targetLang, setTargetLang,
    isTranslating,
    output,
    error, setError,
    isPlaying, setIsPlaying,
    playbackIndex,
    playbackProgress,
    handleTranslate,
    resetPlayback
  };
}
