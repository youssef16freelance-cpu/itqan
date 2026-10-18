import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Sparkles,
  Quote,
  Clock,
  Check,
  Share2,
  Volume2,
  BookmarkCheck,
  Mic,
  RotateCcw,
  VolumeX,
  Radio,
  BookOpen,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { MOTIVATIONAL_TRACKS } from '../../data/motivationalData';
import { storageService } from '../../services/storage';
import { MotivationalTrack } from '../../types';

export const MotivationView: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'khutbah' | 'verse' | 'wisdom'>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackIndexRef = useRef<number>(0);
  const currentTrack = MOTIVATIONAL_TRACKS[currentTrackIndex];

  // Set default start track in storage
  const [defaultStartTrackId, setDefaultStartTrackId] = useState<string>(() =>
    storageService.get('default_motivation_track', MOTIVATIONAL_TRACKS[0].id)
  );

  const getTrackUrls = (track: MotivationalTrack): string[] => {
    return [track.audioUrl, ...(track.fallbackUrls || [])];
  };

  const playWithFallback = (urls: string[], index: number) => {
    if (!audioRef.current || index >= urls.length) {
      setIsBuffering(false);
      setIsPlaying(false);
      return;
    }

    fallbackIndexRef.current = index;
    const targetUrl = urls[index];
    audioRef.current.src = targetUrl;
    audioRef.current.volume = isMuted ? 0 : volume;
    setIsBuffering(true);

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      })
      .catch(err => {
        console.warn(`Error playing track url ${targetUrl}, trying fallback...`, err);
        if (index + 1 < urls.length) {
          playWithFallback(urls, index + 1);
        } else {
          setIsBuffering(false);
          setIsPlaying(false);
        }
      });
  };

  const handleSelectTrack = (index: number) => {
    if (currentTrackIndex === index && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
    fallbackIndexRef.current = 0;

    const urls = getTrackUrls(MOTIVATIONAL_TRACKS[index]);
    playWithFallback(urls, 0);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        const urls = getTrackUrls(currentTrack);
        playWithFallback(urls, 0);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.warn('Play error, trying fallbacks', e);
            const urls = getTrackUrls(currentTrack);
            playWithFallback(urls, fallbackIndexRef.current + 1);
          });
      }
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      handleTogglePlay();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const handleAudioError = () => {
    console.warn('Audio element error event caught, trying next fallback...');
    const urls = getTrackUrls(currentTrack);
    const nextIdx = fallbackIndexRef.current + 1;
    if (nextIdx < urls.length) {
      playWithFallback(urls, nextIdx);
    } else {
      setIsBuffering(false);
      setIsPlaying(false);
    }
  };

  const handleCopyQuote = (quoteText: string) => {
    navigator.clipboard.writeText(`"${quoteText}" — ${currentTrack.speaker}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleSetDefaultStart = (trackId: string) => {
    setDefaultStartTrackId(trackId);
    storageService.set('default_motivation_track', trackId);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered tracks
  const filteredTracks = MOTIVATIONAL_TRACKS.filter(t => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Real audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={handleAudioError}
      />

      {/* Header: Illuminated Banner */}
      <div className="relative overflow-hidden rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 islamic-pattern-bg opacity-35 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1.5">
            <Mic className="w-4 h-4 text-[#d4af37]" />
            <span>تسجيلات تحفيزية واقعية بصوت بشري حقيقي مسجل</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fbf8f2] font-display">
            شحنات الهمة ومواعظ استثمار الأوقات
          </h2>
          <p className="text-xs text-[#ded3c0]/85 mt-1 max-w-xl leading-relaxed">
            تسجيلات وخطب حقيقية لمشايخ وعلماء لرفع العزيمة، التخلص من الفتور والتسويف، وبدء جلسة التركيز بحضور ذهني مبارك.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a382c] border border-[#c59b27]/35 text-[#d4af37] text-xs font-semibold shrink-0">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>أصوات شيوخ وخطب مؤثرة 100%</span>
        </div>
      </div>

      {/* Active Track Player Card: Manuscript Layout */}
      <div className="manuscript-border rounded-3xl bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c59b27]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold mb-1">
              <span>{currentTrack.theme}</span>
              <span>·</span>
              <span>المتحدث: {currentTrack.speaker}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#fbf8f2] font-display">
              {currentTrack.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSetDefaultStart(currentTrack.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                defaultStartTrackId === currentTrack.id
                  ? 'bg-[#c59b27] text-[#041611] font-bold border-[#c59b27] shadow-sm'
                  : 'bg-[#051c15] border-[#c59b27]/30 text-[#ded3c0] hover:text-[#fbf8f2]'
              }`}
              title="تعيين هذا التسجيل ليبدأ تلقائياً عند تشغيل مؤقت بومودورو"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{defaultStartTrackId === currentTrack.id ? 'المحدد لبدء المؤقت' : 'تعيين لبدء المؤقت'}</span>
            </button>
          </div>
        </div>

        {/* Audio Scrubber & Controls */}
        <div className="space-y-3 bg-[#03150f] p-4 sm:p-5 rounded-2xl border border-[#c59b27]/30 shadow-inner">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-2xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] flex items-center justify-center shrink-0 border border-[#c59b27]/50 shadow-lg shadow-[#020e0a] transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isBuffering ? (
                <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-[#d4af37]" />
              ) : (
                <Play className="w-5 h-5 fill-current text-[#d4af37] mr-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center shrink-0 border border-[#c59b27]/25 cursor-pointer"
              title="إعادة من البداية"
            >
              <RotateCcw className="w-4 h-4 text-[#d4af37]" />
            </button>

            <div className="flex-1 space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-[#d4af37] cursor-pointer h-1.5 bg-[#082a20] rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#ded3c0]/70">
                <span>{formatSeconds(currentTime)}</span>
                <span>{duration > 0 ? formatSeconds(duration) : currentTrack.duration}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 pr-2 border-r border-[#c59b27]/20">
              <button
                onClick={handleToggleMute}
                className="text-[#ded3c0]/70 hover:text-[#fbf8f2] p-1 cursor-pointer"
                title={isMuted ? 'إلغاء الكتم' : 'كتم'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#d4af37]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-[#d4af37] cursor-pointer h-1 bg-[#082a20] rounded-lg appearance-none"
                title="مستوى الصوت"
              />
            </div>
          </div>
        </div>

        {/* Quote Highlight */}
        <div className="p-4 rounded-2xl bg-[#041913] border border-[#c59b27]/30 flex items-start justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs md:text-sm text-[#fbf8f2] font-medium leading-relaxed font-sans">
                {currentTrack.quote}
              </p>
              <p className="text-[11px] text-[#ded3c0]/70 mt-2 leading-relaxed">
                {currentTrack.script}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopyQuote(currentTrack.quote)}
            className="p-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] transition-colors shrink-0 cursor-pointer border border-[#c59b27]/25"
            title="نسخ العبارة"
          >
            {copiedQuote ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Explicit Copyright and Source Attribution Card */}
        <div className="p-3.5 rounded-2xl bg-[#03150f] border border-[#c59b27]/25 text-xs text-[#ded3c0]/85 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="leading-relaxed">{currentTrack.copyrightNotice}</span>
          </div>
          <span className="text-[11px] text-[#d4af37] font-medium shrink-0 bg-[#07251d] px-2.5 py-1 rounded-lg border border-[#c59b27]/30">
            {currentTrack.sourceAttribution}
          </span>
        </div>
      </div>

      {/* Track Selection Section with Categories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-[#fbf8f2] font-display">قائمة الخطب والآيات المؤثرة</h4>
            <p className="text-xs text-[#ded3c0]/70">جميع المقاطع بصوت شيوخ وقراء معتمدين ومحفوظة الحقوق 100%</p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-[#051c15] p-1 rounded-xl border border-[#c59b27]/25 text-xs flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] font-bold border border-[#c59b27]/40 shadow-sm'
                  : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
              }`}
            >
              الكل ({MOTIVATIONAL_TRACKS.length})
            </button>
            <button
              onClick={() => setActiveCategory('khutbah')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeCategory === 'khutbah'
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] font-bold border border-[#c59b27]/40 shadow-sm'
                  : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
              }`}
            >
              <Radio className="w-3 h-3 text-[#d4af37]" />
              <span>خطب ومواعظ ({MOTIVATIONAL_TRACKS.filter(t => t.category === 'khutbah').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('verse')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeCategory === 'verse'
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] font-bold border border-[#c59b27]/40 shadow-sm'
                  : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
              }`}
            >
              <BookOpen className="w-3 h-3 text-[#d4af37]" />
              <span>آيات خاشعة ({MOTIVATIONAL_TRACKS.filter(t => t.category === 'verse').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('wisdom')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeCategory === 'wisdom'
                  ? 'bg-gradient-to-l from-[#0e4838] to-[#0a382c] text-[#fbf8f2] font-bold border border-[#c59b27]/40 shadow-sm'
                  : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-[#d4af37]" />
              <span>درر وهمة ({MOTIVATIONAL_TRACKS.filter(t => t.category === 'wisdom').length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTracks.map(track => {
            const originalIndex = MOTIVATIONAL_TRACKS.findIndex(t => t.id === track.id);
            const isCurrent = currentTrackIndex === originalIndex;
            const isThisPlaying = isCurrent && isPlaying;

            const categoryLabel = track.category === 'khutbah' ? 'موعظة' : track.category === 'verse' ? 'تلاوة خاشعة' : 'حكمة';

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(originalIndex)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#0b382c] to-[#06251c] border-[#c59b27] shadow-xl shadow-[#020e0a] ring-1 ring-[#c59b27]/40'
                    : 'bg-[#062017]/80 border-[#c59b27]/20 hover:border-[#c59b27]/40 hover:bg-[#082a20]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isThisPlaying
                          ? 'bg-[#c59b27] text-[#041611] shadow-md shadow-[#c59b27]/40 font-bold'
                          : 'bg-[#082a20] text-[#ded3c0] border border-[#c59b27]/25'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current mr-0.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#041913] text-[#d4af37] border border-[#c59b27]/30 font-medium">
                          {categoryLabel}
                        </span>
                        <h5 className="text-xs font-bold text-[#fbf8f2] truncate">{track.title}</h5>
                      </div>
                      <p className="text-[11px] text-[#ded3c0]/70 truncate mt-1">{track.speaker}</p>
                    </div>
                  </div>

                  <div className="text-left text-[11px] font-mono tabular-nums text-[#d4af37] shrink-0 flex items-center gap-2">
                    {defaultStartTrackId === track.id && (
                      <span className="text-[10px] bg-[#0a3528] text-[#d4af37] px-1.5 py-0.5 rounded border border-[#c59b27]/30 font-sans">
                        افتراضي
                      </span>
                    )}
                    <span>{track.duration}</span>
                  </div>
                </div>

                {/* Card Copyright / Attribution Footer */}
                <div className="pt-2 border-t border-[#c59b27]/20 flex items-center justify-between text-[10px] text-[#ded3c0]/70">
                  <span className="truncate flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{track.sourceAttribution}</span>
                  </span>
                  <span className="text-[9px] text-[#ded3c0]/50 shrink-0">حقوق محفوظة ©</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
