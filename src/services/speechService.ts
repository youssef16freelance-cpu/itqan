class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private currentTrackId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  public speak(trackId: string, text: string, onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95; // gentle, deliberate pace for Arabic motivation
    utterance.pitch = 1.0;

    // Try finding an Arabic voice
    const voices = this.synth.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arab'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentTrackId = trackId;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentTrackId = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      this.isSpeaking = false;
      this.currentTrackId = null;
      this.notify();
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentTrackId = null;
    this.notify();
  }
}

export const speechService = new SpeechService();
