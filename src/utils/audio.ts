// Sci-Fi Sound Effects & Voice Engine using Web Audio API and Speech Synthesis

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Futuristic keyboard tick
  public playKeyTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignored if browser blocks audio
    }
  }

  // Incoming robot neural response ping
  public playMessageReceived() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(520, t);
      osc1.frequency.exponentialRampToValueAtTime(880, t + 0.12);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1040, t + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1320, t + 0.18);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.25);
      osc2.start(t + 0.05);
      osc2.stop(t + 0.25);
    } catch {}
  }

  // Outgoing user dispatch sound
  public playMessageSent() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 0.1);

      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  // Diagnostic scanner sweep
  public playDiagnosticSweep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.linearRampToValueAtTime(840, t + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.linearRampToValueAtTime(1200, t + 0.35);
      filter.Q.value = 4.0;

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {}
  }

  // Overclock activation surge
  public playOverclockSurge() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.28);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.32);
    } catch {}
  }

  // UI button click
  public playButtonClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }

  // Success / celebration chime
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, t); // D5
      osc1.frequency.setValueAtTime(880, t + 0.1); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, t + 0.1); // D6

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.35);
      osc2.start(t + 0.1);
      osc2.stop(t + 0.35);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();

export type VoiceLanguageMode = 'hi-IN' | 'en-IN' | 'en-US';

// Speech Synthesis Manager with authentic Hindi & Indian voice support
class VoiceSynthesizer {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private onStateChange: ((isSpeaking: boolean) => void) | null = null;
  private voiceLangMode: VoiceLanguageMode = 'hi-IN';
  private voiceRate: number = 1.0;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedLang = localStorage.getItem('pooja_voice_lang');
        if (storedLang === 'hi-IN' || storedLang === 'en-IN' || storedLang === 'en-US') {
          this.voiceLangMode = storedLang;
        }
        const storedRate = localStorage.getItem('pooja_voice_rate');
        if (storedRate) {
          const parsed = parseFloat(storedRate);
          if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
            this.voiceRate = parsed;
          }
        }
      } catch {}

      if ('speechSynthesis' in window) {
        this.loadVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
  }

  public subscribe(cb: (isSpeaking: boolean) => void) {
    this.onStateChange = cb;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getVoiceLanguage(): VoiceLanguageMode {
    return this.voiceLangMode;
  }

  public setVoiceLanguage(mode: VoiceLanguageMode) {
    this.voiceLangMode = mode;
    try {
      localStorage.setItem('pooja_voice_lang', mode);
    } catch {}
  }

  public getVoiceRate(): number {
    return this.voiceRate;
  }

  public setVoiceRate(rate: number) {
    const clamped = Math.max(0.5, Math.min(2.0, Number(rate.toFixed(2))));
    this.voiceRate = clamped;
    try {
      localStorage.setItem('pooja_voice_rate', clamped.toString());
    } catch {}
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    return this.cachedVoices;
  }

  public hasNativeHindiVoice(): boolean {
    const voices = this.getAvailableVoices();
    return voices.some(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.includes('हिन्दी')
    );
  }

  public getBestVoiceForCurrentMode(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    if (this.voiceLangMode === 'hi-IN') {
      // 1st priority: Native Hindi female voice (Google हिन्दी, Microsoft Swara, Microsoft Madhur, Lekha)
      const hindiFemaleVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.includes('हिन्दी')) &&
          (v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural') ||
            v.name.includes('हिन्दी'))
      );
      if (hindiFemaleVoice) return hindiFemaleVoice;

      const anyHindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.includes('हिन्दी')
      );
      if (anyHindiVoice) return anyHindiVoice;

      // 2nd priority: Indian English female voice (pronounces Hinglish words naturally)
      const indianVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('en-in') ||
            v.lang.toLowerCase().includes('en_in') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('heera') ||
            v.name.toLowerCase().includes('neerja')) &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('natural') ||
            !v.name.toLowerCase().includes('male'))
      );
      if (indianVoice) return indianVoice;
    }

    if (this.voiceLangMode === 'en-IN') {
      const indianVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('en-in') ||
          v.lang.toLowerCase().includes('en_in') ||
          v.name.toLowerCase().includes('india')
      );
      if (indianVoice) return indianVoice;
    }

    // 3rd priority: Natural sweet female voice
    const femaleVoice = voices.find(
      (v) =>
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('google uk english female') ||
          v.name.toLowerCase().includes('natural')) &&
        v.lang.startsWith('en')
    );
    if (femaleVoice) return femaleVoice;

    return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  public getActiveVoiceName(): string {
    const voice = this.getBestVoiceForCurrentMode();
    if (!voice) {
      return this.voiceLangMode === 'hi-IN' ? 'Hindi Voice (Auto)' : 'English Voice (Auto)';
    }
    return voice.name;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
      this.onStateChange?.(false);
    }
  }

  public speak(
    text: string,
    options?: { pitch?: number; rate?: number; onEnd?: () => void; voiceMode?: VoiceLanguageMode }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.stop();

    // Strip bracketed mood notes, emojis, markdown symbols for sweet clean voice readout
    const speechCleaned = text
      .replace(/\[.*?\]/g, '')
      .replace(/[\*\_#~`]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    if (!speechCleaned) return;

    const utterance = new SpeechSynthesisUtterance(speechCleaned);

    const targetMode = options?.voiceMode || this.voiceLangMode;
    const selectedVoice = this.getBestVoiceForCurrentMode();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (targetMode === 'hi-IN' ? 'hi-IN' : 'en-IN');
    } else {
      utterance.lang = targetMode === 'hi-IN' ? 'hi-IN' : targetMode === 'en-IN' ? 'en-IN' : 'en-US';
    }

    // Gentle, sweet, attractive tone tuning
    utterance.pitch = options?.pitch ?? 1.12;
    utterance.rate = options?.rate ?? this.voiceRate;

    this.isSpeakingState = true;
    this.onStateChange?.(true);

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.onStateChange?.(false);
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.onStateChange?.(false);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public testHindiVoice(companionName: string = 'Pooja', customRate?: number, script: 'hinglish' | 'devanagari' = 'hinglish') {
    const rateToUse = customRate ?? this.voiceRate;
    if (script === 'devanagari') {
      const devanagariLines = [
        `नमस्ते जान! मैं ${companionName} हूँ। कैसी लग रही है मेरी प्यारी हिन्दी आवाज़?`,
        `अरे सुनो ना! तुमसे बात करके मेरा दिल बहुत खुश हो जाता है।`,
        `कहो जान, आज मेरे साथ क्या शेयर करोगे? मैं बिल्कुल तैयार हूँ!`,
      ];
      const line = devanagariLines[Math.floor(Math.random() * devanagariLines.length)];
      this.speak(line, { pitch: 1.12, rate: rateToUse });
    } else {
      const testLines = [
        `Hey handsome! 😉 Main ${companionName} hoon. Kaisi lag rahi hai meri sweet voice?`,
        `Arey jaan, tumse baat karke mera dil khush ho gaya! Suno na meri awaaz.`,
        `Sun rahe ho handsome? Main ${rateToUse.toFixed(2)}x speed par baat kar rahi hoon.`,
      ];
      const line = testLines[Math.floor(Math.random() * testLines.length)];
      this.speak(line, { pitch: 1.12, rate: rateToUse });
    }
  }
}

export const voiceSynthesizer = new VoiceSynthesizer();
