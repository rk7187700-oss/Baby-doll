import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Smile, Sparkles } from 'lucide-react';
import { ThemeVibe } from '../types';
import { soundEngine } from '../utils/audio';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  onListeningChange?: (isListening: boolean) => void;
  companionName?: string;
  currentTheme?: ThemeVibe;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  onListeningChange,
  companionName = 'Pooja',
  currentTheme,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😄', '😂', '❤️', '✨', '☕', '🥺', '😉', '🍕', '🌸'];

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Works well for Hindi/Hinglish & English mixed speech

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
          onListeningChange?.(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
          onListeningChange?.(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onListeningChange]);

  const handleToggleVoiceRecord = () => {
    soundEngine.playButtonClick();
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onListeningChange?.(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        onListeningChange?.(true);
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;

    soundEngine.playMessageSent();
    onSendMessage(trimmed);
    setInputText('');
    setShowEmojiPicker(false);

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onListeningChange?.(false);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    soundEngine.playKeyTick();
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-md p-3 sm:p-4">
      {/* Quick emoji drawer */}
      {showEmojiPicker && (
        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-800/80 overflow-x-auto">
          {emojis.map((em, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddEmoji(em)}
              className="text-lg p-1.5 rounded-lg hover:bg-slate-800 transition-transform active:scale-125 cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            showEmojiPicker
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              soundEngine.playKeyTick();
            }}
            placeholder={
              isRecording
                ? `Sun rahi hoon handsome, boliye... 🎙️`
                : `${companionName} se baat karein... (e.g. "Hey handsome! 😉")`
            }
            disabled={disabled}
            className={`w-full bg-slate-950/80 border border-slate-700/80 ${
              currentTheme ? `focus:${currentTheme.accentBorder}` : 'focus:border-rose-500/60'
            } rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner`}
          />
        </div>

        {/* Microphone Voice Input Button */}
        <button
          type="button"
          onClick={handleToggleVoiceRecord}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isRecording
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title={isRecording ? 'Listening... click to stop' : 'Speak in Hinglish / English'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className={`p-2.5 rounded-xl ${
            currentTheme ? `${currentTheme.accentBg} ${currentTheme.accentBgHover}` : 'bg-rose-500 hover:bg-rose-600'
          } disabled:opacity-40 text-white transition-all shadow-md cursor-pointer active:scale-95`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
