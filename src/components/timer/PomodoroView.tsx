import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Coffee,
  CheckCircle2,
  Sliders,
  Award,
  BookOpen
} from 'lucide-react';
import { AMBIENT_TRACKS, ambientAudioEngine } from '../../services/ambientAudio';
import { MOTIVATIONAL_TRACKS } from '../../data/motivationalData';
import { storageService } from '../../services/storage';

interface PomodoroPreset {
  id: string;
  name: string;
  workMinutes: number;
  breakMinutes: number;
  icon: string;
  theme: string;
}

const PRESETS: PomodoroPreset[] = [
  { id: 'standard', name: 'بومودورو قياسي', workMinutes: 25, breakMinutes: 5, icon: 'Clock', theme: 'منجز المهام' },
  { id: 'deep', name: 'جلسة تركيز عميق', workMinutes: 50, breakMinutes: 10, icon: 'Zap', theme: 'إنجاز مشاريع' },
  { id: 'quran', name: 'وِرد القرآن والتدبر', workMinutes: 30, breakMinutes: 5, icon: 'BookOpen', theme: 'سكينة وبركة' },
  { id: 'hifz', name: 'تثبيت ومراجعة الحفظ', workMinutes: 45, breakMinutes: 10, icon: 'Sparkles', theme: 'حفظ متقن' },
  { id: 'quick', name: 'إنجاز سريع', workMinutes: 15, breakMinutes: 3, icon: 'Timer', theme: 'حسم عاجل' }
];

interface PomodoroViewProps {
  initialMinutes?: number;
  onSessionComplete?: (minutes: number) => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  initialMinutes = 25,
  onSessionComplete
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(PRESETS[0]);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [durationSeconds, setDurationSeconds] = useState<number>(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Motivational audio on start option
  const [autoPlayMotivation, setAutoPlayMotivation] = useState<boolean>(() =>
    storageService.getMotivationalIntroEnabled()
  );
  const [selectedMotivationTrack, setSelectedMotivationTrack] = useState<string>(MOTIVATIONAL_TRACKS[0].id);

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completedMinutesLogged, setCompletedMinutesLogged] = useState<number>(0);

  // Quick ambient sound toggle
  const [quickAmbientId, setQuickAmbientId] = useState<string>('rain');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.6);
  const [isAmbientActive, setIsAmbientActive] = useState<boolean>(false);

  // Timer interval & real motivation audio ref
  const timerRef = useRef<number | null>(null);
  const motivationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Subscribe to ambient engine
  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setIsAmbientActive(ambientAudioEngine.hasAnyActive());
    });
    setIsAmbientActive(ambientAudioEngine.hasAnyActive());
    return () => unsub();
  }, []);

  // Update seconds when preset changes (only if not running)
  useEffect(() => {
    if (!isRunning) {
      const minutes = mode === 'work' ? selectedPreset.workMinutes : selectedPreset.breakMinutes;
      setDurationSeconds(minutes * 60);
      setSecondsLeft(minutes * 60);
    }
  }, [selectedPreset, mode]);

  // Main countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, durationSeconds]);

  const handleStartTimer = () => {
    setIsRunning(true);

    // If starting a work session and real human motivational intro is enabled
    if (autoPlayMotivation && mode === 'work' && secondsLeft === durationSeconds) {
      const track = MOTIVATIONAL_TRACKS.find(t => t.id === selectedMotivationTrack) || MOTIVATIONAL_TRACKS[0];
      if (motivationAudioRef.current && track.audioUrl) {
        motivationAudioRef.current.src = track.audioUrl;
        motivationAudioRef.current.currentTime = 0;
        motivationAudioRef.current.play().catch(e => {
          console.warn('Motivation audio play error, trying fallback', e);
          if (track.fallbackUrls && track.fallbackUrls[0]) {
            motivationAudioRef.current!.src = track.fallbackUrls[0];
            motivationAudioRef.current!.play().catch(err => console.warn(err));
          }
        });
      }
    }
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
    if (motivationAudioRef.current) {
      motivationAudioRef.current.pause();
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    if (motivationAudioRef.current) {
      motivationAudioRef.current.pause();
      motivationAudioRef.current.currentTime = 0;
    }
    const minutes = mode === 'work' ? selectedPreset.workMinutes : selectedPreset.breakMinutes;
    setSecondsLeft(minutes * 60);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (motivationAudioRef.current) {
      motivationAudioRef.current.pause();
      motivationAudioRef.current.currentTime = 0;
    }
    ambientAudioEngine.playCompletionChime();

    if (mode === 'work') {
      const finishedMins = selectedPreset.workMinutes;
      setCompletedMinutesLogged(finishedMins);
      setShowCompletionModal(true);

      // Award points & update storage stats
      const points = Math.max(15, finishedMins);
      const stats = storageService.getStats();
      stats.totalFocusMinutes += finishedMins;
      stats.points += points;
      stats.level = Math.floor(stats.points / 200) + 1;
      storageService.saveStats(stats);

      if (onSessionComplete) {
        onSessionComplete(finishedMins);
      }

      // Switch to break
      setMode('break');
      const breakMins = selectedPreset.breakMinutes;
      setDurationSeconds(breakMins * 60);
      setSecondsLeft(breakMins * 60);
    } else {
      // Finished break
      setMode('work');
      const workMins = selectedPreset.workMinutes;
      setDurationSeconds(workMins * 60);
      setSecondsLeft(workMins * 60);
    }
  };

  // Toggle ambient track directly inside timer
  const handleToggleAmbient = (trackId: string) => {
    setQuickAmbientId(trackId);
    ambientAudioEngine.toggleTrack(trackId);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circle progress calculation
  const progressPercent = durationSeconds > 0 ? (durationSeconds - secondsLeft) / durationSeconds : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Real audio element for human male motivation playback */}
      <audio ref={motivationAudioRef} preload="auto" />

      {/* Preset Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PRESETS.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                if (!isRunning) {
                  setSelectedPreset(preset);
                  setMode('work');
                }
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] border-[#c59b27]/60 shadow-md shadow-[#020e0a]'
                  : 'bg-[#062017]/70 text-[#ded3c0]/75 border-[#c59b27]/20 hover:bg-[#082a20] hover:text-[#fbf8f2]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{preset.name}</span>
                <span className="opacity-75 font-mono text-[#d4af37]">({preset.workMinutes}د)</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Timer Display Card: Astrolabe & Modern Islamic Architecture */}
      <div className="manuscript-border rounded-3xl bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 islamic-pattern-bg opacity-30 pointer-events-none" />

        {/* Warm lantern center glow when running */}
        {isRunning && (
          <div className="absolute inset-0 lantern-glow-center pointer-events-none" />
        )}

        {/* Corner Gilded Accents */}
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />

        {/* Mode indicator (Work vs Break) */}
        <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#041913] border border-[#c59b27]/30 mb-6 text-xs shadow-sm">
          <span className={`w-2 h-2 rounded-full ${mode === 'work' ? 'bg-[#d4af37] animate-pulse' : 'bg-[#e5c158]'}`} />
          <span className="font-medium text-[#fbf8f2]">
            {mode === 'work' ? `جلسة تركيز: ${selectedPreset.name}` : `استراحة قصيرة (${selectedPreset.breakMinutes} دقائق)`}
          </span>
        </div>

        {/* Circular Countdown Ring with Astrolabe-inspired Gold Gauge */}
        <div className="relative z-10 w-72 h-72 md:w-80 md:h-80 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="rgba(197, 155, 39, 0.15)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Stroke in Gilded Gold / Emerald */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={mode === 'work' ? '#d4af37' : '#e5c158'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
            />
          </svg>

          {/* Time digits & Status in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono tabular-nums text-5xl md:text-6xl font-bold tracking-tight text-[#fbf8f2] select-none drop-shadow-md">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-[#ded3c0]/70 mt-2">
              {isRunning ? (mode === 'work' ? 'التركيز جارٍ ببركة الله ✨' : 'وقت الاستراحة والسكينة') : 'جاهز للبدء'}
            </span>
          </div>
        </div>

        {/* Controls: Play, Pause, Reset */}
        <div className="relative z-10 flex items-center gap-4 mt-6">
          <button
            onClick={handleResetTimer}
            className="w-12 h-12 rounded-2xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 transition-colors cursor-pointer"
            title="إعادة ضبط المؤقت"
          >
            <RotateCcw className="w-5 h-5 text-[#d4af37]" />
          </button>

          <button
            onClick={isRunning ? handlePauseTimer : handleStartTimer}
            className="px-9 h-14 rounded-2xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] hover:to-[#0e4838] text-[#fbf8f2] font-bold text-base flex items-center gap-3 border border-[#c59b27]/50 shadow-xl shadow-[#020e0a] transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current text-[#d4af37]" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-[#d4af37]" />
                <span>{secondsLeft < durationSeconds ? 'استئناف' : 'بدء التركيز'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setMode(prev => (prev === 'work' ? 'break' : 'work'));
              handleResetTimer();
            }}
            className="w-12 h-12 rounded-2xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 transition-colors cursor-pointer"
            title={mode === 'work' ? 'الانتقال للاستراحة' : 'العودة لجلسة العمل'}
          >
            <Coffee className="w-5 h-5 text-[#d4af37]" />
          </button>
        </div>
      </div>

      {/* Session Enhancements: Motivational Intro & Calm Sounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Motivational Audio Intro Settings */}
        <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-[#c59b27]/20 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-sm font-bold text-[#fbf8f2]">التحفيز عند بداية الجلسة</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlayMotivation}
                onChange={e => {
                  setAutoPlayMotivation(e.target.checked);
                  storageService.saveMotivationalIntroEnabled(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#03150f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c59b27] border border-[#c59b27]/30"></div>
            </label>
          </div>
          <p className="text-xs text-[#ded3c0]/75 mb-3 leading-relaxed">
            تشغيل تسجيل صوتي تحفيزي حقيقي (صوت بشري واقعي) في بداية الجلسة لشحن الهمة وضبط النية.
          </p>

          <select
            value={selectedMotivationTrack}
            onChange={e => setSelectedMotivationTrack(e.target.value)}
            disabled={!autoPlayMotivation}
            className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl px-3 py-2 text-xs text-[#ded3c0] focus:outline-none focus:border-[#d4af37] disabled:opacity-50 cursor-pointer"
          >
            {MOTIVATIONAL_TRACKS.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.speaker})
              </option>
            ))}
          </select>
        </div>

        {/* Ambient Sounds Quick Control */}
        <div className="rounded-3xl bg-[#062017]/85 border border-[#c59b27]/25 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-[#c59b27]/20 pb-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-sm font-bold text-[#fbf8f2]">أصوات هادئة أثناء التركيز</h3>
            </div>
            {isAmbientActive && (
              <button
                onClick={() => ambientAudioEngine.stopAll()}
                className="text-[11px] text-[#e5c158] hover:underline cursor-pointer"
              >
                إيقاف الكل
              </button>
            )}
          </div>
          <p className="text-xs text-[#ded3c0]/75 mb-3 leading-relaxed">
            أصوات الطبيعة تعزل الضوضاء الخارجية وتدعم الدخول في حالة التدفق والسكينة.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {AMBIENT_TRACKS.slice(0, 3).map(track => {
              const isPlaying = ambientAudioEngine.isTrackPlaying(track.id);
              return (
                <button
                  key={track.id}
                  onClick={() => handleToggleAmbient(track.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#0e4838] text-[#fbf8f2] border border-[#c59b27]/60 shadow-md'
                      : 'bg-[#041913] text-[#ded3c0]/80 hover:bg-[#07241c] border border-[#c59b27]/20'
                  }`}
                >
                  <span className="truncate block">{track.name.replace('صوت ', '')}</span>
                  <span className="text-[10px] block opacity-80 mt-0.5 font-mono text-[#d4af37]">
                    {isPlaying ? 'يعمل ◉' : 'تشغيل'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="manuscript-border bg-[#051c15] border border-[#c59b27]/45 rounded-3xl max-w-md w-full p-7 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#093527] border border-[#c59b27]/50 flex items-center justify-center mx-auto text-[#d4af37] shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#fbf8f2] font-display">
                مبارك! اكتملت جلسة التركيز بنجاح
              </h3>
              <p className="text-xs text-[#ded3c0]/80 leading-relaxed">
                «مَنْ لَزِمَ الِاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا»
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03150f] border border-[#c59b27]/25 flex items-center justify-around shadow-inner">
              <div>
                <span className="text-[11px] text-[#ded3c0]/70 block">وقت التركيز المضاف</span>
                <span className="text-lg font-bold font-mono tabular-nums text-[#d4af37]">
                  +{completedMinutesLogged} دقيقة
                </span>
              </div>
              <div className="w-px h-8 bg-[#c59b27]/20" />
              <div>
                <span className="text-[11px] text-[#ded3c0]/70 block">نقاط الإتقان</span>
                <span className="text-lg font-bold font-mono tabular-nums text-[#d4af37]">
                  +{completedMinutesLogged} نقطة
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-xs font-bold border border-[#c59b27]/40 shadow-lg cursor-pointer"
            >
              متابعة الإنجاز
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
