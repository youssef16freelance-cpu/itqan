// Web Audio API ambient sound procedural generator
// 100% client-side, zero network dependencies, infinite seamless loops

export interface AmbientTrackConfig {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
}

export const AMBIENT_TRACKS: AmbientTrackConfig[] = [
  {
    id: 'youtube_rain',
    name: 'مؤثرات اليوتيوب (مطر ورعد هادئ)',
    nameEn: 'YouTube Rain & Thunder Atmosphere',
    icon: 'CloudRain',
    color: 'from-amber-600 to-indigo-900',
    description: 'أجواء تلاوات اليوتيوب الخاشعة مع رذاذ المطر الرقيق ودوي رعد هادئ وبعيد يريح القلب'
  },
  {
    id: 'rain',
    name: 'صوت المطر الرقيق',
    nameEn: 'Gentle Rain',
    icon: 'CloudRain',
    color: 'from-blue-600 to-cyan-700',
    description: 'قطرات مطر متتالية تبعث على الهدوء والسكينة والتركيز التام'
  },
  {
    id: 'waves',
    name: 'أمواج البحر الهادئة',
    nameEn: 'Ocean Waves',
    icon: 'Waves',
    color: 'from-teal-600 to-emerald-800',
    description: 'حركة مد وجزر دورية مريحة تحاكي هدوء شاطئ منعزل'
  },
  {
    id: 'fire',
    name: 'موقد الحطب الدافئ',
    nameEn: 'Cozy Fireplace',
    icon: 'Flame',
    color: 'from-amber-600 to-orange-700',
    description: 'فرقعات خشب هادئة ودفء صوتي يزيل التوتر'
  },
  {
    id: 'stream',
    name: 'خرير جدول الماء',
    nameEn: 'Mountain Stream',
    icon: 'Droplets',
    color: 'from-cyan-600 to-blue-800',
    description: 'جريان ماء عذب متدفق في طبيعة جبلية صافية'
  },
  {
    id: 'forest',
    name: 'نسيم الغابة والطيور',
    nameEn: 'Forest Breeze',
    icon: 'Trees',
    color: 'from-emerald-600 to-green-800',
    description: 'رياح عليلة بين أوراق الشجر مع تغريدات هادئة متقطعة'
  },
  {
    id: 'crickets',
    name: 'أجواء الليل والهدوء',
    nameEn: 'Night Crickets',
    icon: 'Moon',
    color: 'from-indigo-600 to-violet-800',
    description: 'سكينة سكون الليل وأصوات طبيعية تريح الأعصاب'
  },
  {
    id: 'brown_noise',
    name: 'الضوضاء البنية للتركيز',
    nameEn: 'Deep Focus Noise',
    icon: 'Headphones',
    color: 'from-stone-600 to-stone-800',
    description: 'ترددات منخفضة عازلة للمشتتات ومحفزة للدخول في تدفق العمل'
  }
];

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private trackNodes: Map<
    string,
    {
      sourceNodes: (AudioNode | number)[];
      gainNode: GainNode;
      timerInterval?: number;
    }
  > = new Map();
  private volumes: Map<string, number> = new Map();
  private activeTracks: Set<string> = new Set();
  private masterVolume: number = 0.8;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Initialize default volumes
    AMBIENT_TRACKS.forEach(t => this.volumes.set(t.id, 0.6));
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleTrack(trackId: string) {
    if (this.activeTracks.has(trackId)) {
      this.stopTrack(trackId);
    } else {
      this.startTrack(trackId);
    }
    this.notify();
  }

  public isTrackPlaying(trackId: string): boolean {
    return this.activeTracks.has(trackId);
  }

  public getTrackVolume(trackId: string): number {
    return this.volumes.get(trackId) ?? 0.6;
  }

  public setTrackVolume(trackId: string, volume: number) {
    this.volumes.set(trackId, volume);
    const node = this.trackNodes.get(trackId);
    if (node && this.ctx) {
      node.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public hasAnyActive(): boolean {
    return this.activeTracks.size > 0;
  }

  public stopAll() {
    const active = Array.from(this.activeTracks);
    active.forEach(id => this.stopTrack(id));
    this.notify();
  }

  private startTrack(trackId: string) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.trackNodes.has(trackId)) {
      this.stopTrack(trackId);
    }

    const trackGain = this.ctx.createGain();
    const vol = this.volumes.get(trackId) ?? 0.6;
    trackGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    trackGain.connect(this.masterGain);

    const sourceNodes: (AudioNode | number)[] = [];
    let timerInterval: number | undefined;

    switch (trackId) {
      case 'youtube_rain': {
        // High quality YouTube-style rain with subtle sub-bass distant thunder
        const bufferSize = this.ctx.sampleRate * 3;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
          b6 = white * 0.115926;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(820, this.ctx.currentTime);

        rainSource.connect(rainFilter);
        rainFilter.connect(trackGain);
        rainSource.start();

        // Distant gentle thunder generator (sub-bass roll every 20 seconds)
        const thunderBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 3, this.ctx.sampleRate);
        const tOutput = thunderBuffer.getChannelData(0);
        let tLast = 0;
        for (let i = 0; i < thunderBuffer.length; i++) {
          const white = Math.random() * 2 - 1;
          tLast = (tLast + 0.02 * white) / 1.02;
          tOutput[i] = tLast * 2.8;
        }

        const thunderFilter = this.ctx.createBiquadFilter();
        thunderFilter.type = 'lowpass';
        thunderFilter.frequency.setValueAtTime(80, this.ctx.currentTime);

        const thunderGain = this.ctx.createGain();
        thunderGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        thunderFilter.connect(thunderGain);
        thunderGain.connect(trackGain);

        const playThunderRoll = () => {
          if (!this.ctx || !this.activeTracks.has('youtube_rain')) return;
          try {
            const tSource = this.ctx.createBufferSource();
            tSource.buffer = thunderBuffer;
            tSource.connect(thunderFilter);
            const now = this.ctx.currentTime;
            thunderGain.gain.cancelScheduledValues(now);
            thunderGain.gain.setValueAtTime(0.001, now);
            thunderGain.gain.linearRampToValueAtTime(0.28, now + 1.8);
            thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
            tSource.start(now);
            tSource.stop(now + 6.0);
          } catch (e) {}
        };

        const initialTimer = window.setTimeout(playThunderRoll, 3500);
        timerInterval = window.setInterval(playThunderRoll, 24000);

        sourceNodes.push(rainSource, rainFilter, thunderFilter, thunderGain, initialTimer);
        break;
      }

      case 'rain': {
        // Pink noise buffer with bandpass filter
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(trackGain);
        whiteNoise.start();

        sourceNodes.push(whiteNoise, filter);
        break;
      }

      case 'waves': {
        // Low brown noise modulated by slow rhythmic LFO
        const bufferSize = this.ctx.sampleRate * 3;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const brownNoise = this.ctx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        // LFO for periodic wave swell
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 seconds cycle

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        brownNoise.connect(filter);
        filter.connect(trackGain);

        brownNoise.start();
        lfo.start();
        sourceNodes.push(brownNoise, filter, lfo, lfoGain);
        break;
      }

      case 'fire': {
        // Warm low frequency rumble + intermittent subtle crackles
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (last + 0.015 * white) / 1.015;
          last = output[i];
          output[i] *= 3.0;
        }

        const rumble = this.ctx.createBufferSource();
        rumble.buffer = noiseBuffer;
        rumble.loop = true;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(280, this.ctx.currentTime);

        rumble.connect(lowpass);
        lowpass.connect(trackGain);
        rumble.start();
        sourceNodes.push(rumble, lowpass);

        // Crackle generator via periodic impulse
        const triggerCrackle = () => {
          if (!this.ctx || !this.activeTracks.has('fire')) return;
          const crackleOsc = this.ctx.createOscillator();
          crackleOsc.type = 'triangle';
          crackleOsc.frequency.setValueAtTime(600 + Math.random() * 1200, this.ctx.currentTime);

          const cGain = this.ctx.createGain();
          cGain.gain.setValueAtTime(0.08 * (this.volumes.get('fire') || 0.6), this.ctx.currentTime);
          cGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

          crackleOsc.connect(cGain);
          cGain.connect(this.masterGain!);

          crackleOsc.start();
          crackleOsc.stop(this.ctx.currentTime + 0.04);
        };

        timerInterval = window.setInterval(() => {
          if (Math.random() > 0.4) {
            triggerCrackle();
          }
        }, 150);

        break;
      }

      case 'stream': {
        // Bandpassed rushing water
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const bp1 = this.ctx.createBiquadFilter();
        bp1.type = 'bandpass';
        bp1.frequency.setValueAtTime(800, this.ctx.currentTime);
        bp1.Q.setValueAtTime(1.5, this.ctx.currentTime);

        source.connect(bp1);
        bp1.connect(trackGain);
        source.start();
        sourceNodes.push(source, bp1);
        break;
      }

      case 'forest': {
        // Gentle wind filtered noise + occasional chirps
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const windSource = this.ctx.createBufferSource();
        windSource.buffer = noiseBuffer;
        windSource.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
        windFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

        windSource.connect(windFilter);
        windFilter.connect(trackGain);
        windSource.start();
        sourceNodes.push(windSource, windFilter);

        // Chirp scheduler
        const triggerChirp = () => {
          if (!this.ctx || !this.activeTracks.has('forest')) return;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          const baseFreq = 2200 + Math.random() * 800;
          osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, this.ctx.currentTime + 0.08);
          osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, this.ctx.currentTime + 0.16);

          const cGain = this.ctx.createGain();
          const volMult = (this.volumes.get('forest') || 0.6) * 0.06;
          cGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          cGain.gain.linearRampToValueAtTime(volMult, this.ctx.currentTime + 0.04);
          cGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);

          osc.connect(cGain);
          cGain.connect(this.masterGain!);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.22);
        };

        timerInterval = window.setInterval(() => {
          if (Math.random() > 0.65) {
            triggerChirp();
          }
        }, 1800);

        break;
      }

      case 'crickets': {
        // High harmonic pulse
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4600, this.ctx.currentTime);

        const tremolo = this.ctx.createOscillator();
        tremolo.type = 'triangle';
        tremolo.frequency.setValueAtTime(14, this.ctx.currentTime);

        const tremGain = this.ctx.createGain();
        tremGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        tremolo.connect(tremGain.gain);

        osc.connect(tremGain);
        tremGain.connect(trackGain);

        osc.start();
        tremolo.start();
        sourceNodes.push(osc, tremolo, tremGain);
        break;
      }

      case 'brown_noise': {
        // Brownian noise generator
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(trackGain);
        source.start();
        sourceNodes.push(source, filter);
        break;
      }
    }

    this.trackNodes.set(trackId, {
      sourceNodes,
      gainNode: trackGain,
      timerInterval
    });

    this.activeTracks.add(trackId);
  }

  private stopTrack(trackId: string) {
    const node = this.trackNodes.get(trackId);
    if (node) {
      if (node.timerInterval) {
        clearInterval(node.timerInterval);
      }
      node.sourceNodes.forEach(s => {
        if (typeof s !== 'number' && 'stop' in s && typeof (s as any).stop === 'function') {
          try {
            (s as any).stop();
          } catch (e) {}
        }
        if (typeof s !== 'number' && 'disconnect' in s && typeof (s as any).disconnect === 'function') {
          try {
            (s as any).disconnect();
          } catch (e) {}
        }
      });
      try {
        node.gainNode.disconnect();
      } catch (e) {}
      this.trackNodes.delete(trackId);
    }
    this.activeTracks.delete(trackId);
  }

  // Play peaceful chime bell sound for Pomodoro completion
  public playCompletionChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Peaceful chord)
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + idx * 0.15;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 2.0);
    });
  }

  // Play gentle alert tone for Quran portion & focus reminders
  public playNotificationTone() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [587.33, 880.0]; // D5 then A5 - gentle pleasant alert
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + idx * 0.18;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 1.4);
    });
  }

  // YouTube Studio & Rain Atmosphere controls
  public startYouTubeAtmosphere(volume: number = 0.22) {
    this.initContext();
    this.volumes.set('youtube_rain', volume);
    if (!this.activeTracks.has('youtube_rain')) {
      this.startTrack('youtube_rain');
      this.notify();
    } else {
      const node = this.trackNodes.get('youtube_rain');
      if (node && this.ctx) {
        node.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
      }
    }
  }

  public stopYouTubeAtmosphere() {
    if (this.activeTracks.has('youtube_rain')) {
      this.stopTrack('youtube_rain');
      this.notify();
    }
  }

  public isYouTubeAtmosphereActive(): boolean {
    return this.activeTracks.has('youtube_rain');
  }

  // Play subtle soothing click for Tasbeeh counter
  public playTasbeehClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Play peaceful completion chime when finishing a Dhikr count
  public playTasbeehComplete() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });
    } catch (e) {}
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
