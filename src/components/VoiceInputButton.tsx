import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-IN'; // Indian English, fallback handles common Hindi/regional spoken terms

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!supported || !recognition) {
      // Fallback simulation if speech recognition is unavailable in sandbox
      const sampleTranscripts = [
        "Severe road damage and deep potholes near AIIMS Junction, Mangalagiri. Causing ambulance delay and accident risk.",
        "Overflowing community garbage dump near vegetable wholesale market causing stench and disease risk.",
        "Damaged high voltage street lamp sparking along Canal Road during monsoon rains."
      ];
      const randomSample = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      onTranscript(randomSample);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
      } ${className}`}
      title={
        supported
          ? isListening
            ? 'Listening... Click to stop'
            : 'Click to speak description (Web Speech API)'
          : 'Voice input (Click for simulated speech sample)'
      }
    >
      {isListening ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-[#073F68]" />
          <span>🎙️ Voice Input</span>
        </>
      )}
    </button>
  );
};
