import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Search,
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Info,
  Check,
  Headphones,
  Sparkles,
  CloudRain,
  Moon
} from 'lucide-react';
import { ALL_SURAHS, RECITERS } from '../../data/quranSurahs';
import { TAFSEER_SOURCE_NAME } from '../../data/curatedQuranData';
import { KHUSHOO_RECITATIONS, KhushooRecitation } from '../../data/khushooRecitations';
import { QuranCalmMode } from './QuranCalmMode';
import { KhushooRecitationsModal } from './KhushooRecitationsModal';
import {
  fetchSurahAyahs,
  getAyahAudioUrl,
  getSurahAudioFallbackUrls,
  getSurahAudioUrl,
  getSurahMeta,
  pad3,
  isSurahAvailableForReciter,
  SHERIF_MOSTAFA_AVAILABLE_SURAHS
} from '../../services/quranApi';
import { storageService } from '../../services/storage';
import { ambientAudioEngine } from '../../services/ambientAudio';
import { Ayah, Reciter, SurahMeta } from '../../types';

interface QuranViewProps {
  initialSurahId?: number;
  initialAyahNumber?: number;
  onAyahRead?: (count: number) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  initialSurahId = 1,
  initialAyahNumber = 1,
  onAyahRead
}) => {
  const [currentSurahId, setCurrentSurahId] = useState<number>(initialSurahId);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => storageService.getFavoriteReciter());
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [repeatCount, setRepeatCount] = useState<number>(1); // 1, 3, 5, 999 (infinite)
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState<number>(0);
  const [isAudioBuffering, setIsAudioBuffering] = useState<boolean>(false);

  // YouTube Studio & Rain Atmosphere effects
  const [youtubeEffectsEnabled, setYoutubeEffectsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('itqan_youtube_effects');
    return saved !== null ? saved === 'true' : true;
  });
  const [youtubeEffectsVolume, setYoutubeEffectsVolume] = useState<number>(() => {
    const saved = localStorage.getItem('itqan_youtube_volume');
    return saved ? Number(saved) : 0.22;
  });

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSurahModal, setShowSurahModal] = useState<boolean>(false);
  const [showReciterModal, setShowReciterModal] = useState<boolean>(false);
  const [activeTafseerAyah, setActiveTafseerAyah] = useState<Ayah | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [bookmarkedAyah, setBookmarkedAyah] = useState<number | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [reciterNotice, setReciterNotice] = useState<string | null>(null);
  const [calmMode, setCalmMode] = useState<boolean>(false);
  const [showKhushooModal, setShowKhushooModal] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUrlsRef = useRef<string[]>([]);
  const currentFallbackIdxRef = useRef<number>(0);
  const currentSurah = getSurahMeta(currentSurahId) || ALL_SURAHS[0];
  const currentReciter = RECITERS.find(r => r.id === selectedReciterId) || RECITERS[0];

  // Load Surah Ayahs
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAyahIndex(null);

    fetchSurahAyahs(currentSurahId).then(data => {
      if (mounted) {
        setAyahs(data);
        setLoading(false);
        // Track stats if reading
        if (onAyahRead && data.length > 0) {
          onAyahRead(Math.min(data.length, 5));
        }
      }
    });

    // Check saved bookmark
    const stats = storageService.getStats();
    if (stats.bookmarks && stats.bookmarks.surahId === currentSurahId) {
      setBookmarkedAyah(stats.bookmarks.ayahNumber);
    } else {
      setBookmarkedAyah(null);
    }

    return () => {
      mounted = false;
    };
  }, [currentSurahId]);

  // Synchronize YouTube atmosphere with audio playback
  useEffect(() => {
    if (isPlaying && youtubeEffectsEnabled) {
      ambientAudioEngine.startYouTubeAtmosphere(youtubeEffectsVolume);
    } else {
      ambientAudioEngine.stopYouTubeAtmosphere();
    }
  }, [isPlaying, youtubeEffectsEnabled, youtubeEffectsVolume]);

  useEffect(() => {
    return () => {
      ambientAudioEngine.stopYouTubeAtmosphere();
    };
  }, []);

  // Reciter change
  const handleSelectReciter = (reciterId: string) => {
    setSelectedReciterId(reciterId);
    storageService.saveFavoriteReciter(reciterId);
    setShowReciterModal(false);

    // Auto-enable YouTube atmosphere when Sherif Mostafa is chosen
    if (reciterId === 'sherif_mostafa') {
      setYoutubeEffectsEnabled(true);
      localStorage.setItem('itqan_youtube_effects', 'true');
    }

    // Restart audio if playing
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // Khushoo Recitation Selection
  const handleSelectKhushooRecitation = (item: KhushooRecitation) => {
    setSelectedReciterId(item.reciterId);
    storageService.saveFavoriteReciter(item.reciterId);
    setCurrentSurahId(item.surahId);

    if (item.recommendedRain) {
      setYoutubeEffectsEnabled(true);
      localStorage.setItem('itqan_youtube_effects', 'true');
      if (item.rainVolume) {
        setYoutubeEffectsVolume(item.rainVolume);
        localStorage.setItem('itqan_youtube_volume', item.rainVolume.toString());
      }
    }

    // Auto start playing
    setTimeout(() => {
      handleTogglePlay(0);
    }, 250);
  };

  // Play / Pause toggler
  const handleTogglePlay = (indexToPlay?: number) => {
    if (!audioRef.current) return;

    if (isPlaying && (indexToPlay === undefined || indexToPlay === playingAyahIndex)) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const targetIndex = indexToPlay !== undefined ? indexToPlay : (playingAyahIndex ?? 0);
    playAyahAtIndex(targetIndex);
  };

  const playAyahAtIndex = (index: number) => {
    if (!audioRef.current || index < 0 || index >= ayahs.length) return;

    const targetAyah = ayahs[index];
    const isFullSurahReciter = !currentReciter.supportsAyahAudio;

    const isSherifSelected = selectedReciterId === 'sherif_mostafa';
    const isSherifAvailable = isSurahAvailableForReciter('sherif_mostafa', currentSurahId);

    let fallbackList = getSurahAudioFallbackUrls(selectedReciterId, currentSurahId);

    if (isSherifSelected && !isSherifAvailable) {
      setReciterNotice(`سورة ${currentSurah.name} لم يسجلها القارئ شريف مصطفى؛ يتم الاستماع بصوت الشيخ مشاري العفاسي. يمكنك النقر على السور المقترحة أدناه لسماع صوت شريف مصطفى.`);
      fallbackList = [`https://server8.mp3quran.net/afs/${pad3(currentSurahId)}.mp3`];
    } else {
      setReciterNotice(null);
    }

    fallbackUrlsRef.current = fallbackList;
    currentFallbackIdxRef.current = 0;

    let url = fallbackList[0];
    if (!isFullSurahReciter && (!isSherifSelected || !isSherifAvailable)) {
      const ayahUrl = getAyahAudioUrl(selectedReciterId, currentSurahId, targetAyah.numberInSurah);
      if (ayahUrl) url = ayahUrl;
    }

    setPlayingAyahIndex(index);
    setIsAudioBuffering(true);

    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsAudioBuffering(false);
      })
      .catch(err => {
        console.warn('Playback error, attempting fallback...', err);
        handleAudioError();
      });
  };

  const handleAudioError = () => {
    if (currentFallbackIdxRef.current < fallbackUrlsRef.current.length - 1) {
      currentFallbackIdxRef.current += 1;
      const nextUrl = fallbackUrlsRef.current[currentFallbackIdxRef.current];
      if (audioRef.current) {
        audioRef.current.src = nextUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsAudioBuffering(false);
          })
          .catch(e => {
            console.warn('Fallback play error', e);
            handleAudioError();
          });
      }
    } else {
      setIsAudioBuffering(false);
      setIsPlaying(false);
    }
  };

  // Audio Ended Handler (Handles repeat & auto-advance)
  const handleAudioEnded = () => {
    if (!currentReciter.supportsAyahAudio) {
      // For full surah audio, it finished the entire surah
      setIsPlaying(false);
      setPlayingAyahIndex(null);
      return;
    }

    // Check repeat logic
    if (currentRepeatIteration < repeatCount - 1) {
      setCurrentRepeatIteration(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    // Reset repeat counter and advance to next Ayah
    setCurrentRepeatIteration(0);
    if (playingAyahIndex !== null && playingAyahIndex < ayahs.length - 1) {
      playAyahAtIndex(playingAyahIndex + 1);
    } else {
      setIsPlaying(false);
      setPlayingAyahIndex(null);
    }
  };

  // Bookmark current ayah
  const handleBookmark = (ayahNumberInSurah: number) => {
    const stats = storageService.getStats();
    stats.bookmarks = {
      surahId: currentSurahId,
      ayahNumber: ayahNumberInSurah,
      savedAt: new Date().toISOString()
    };
    storageService.saveStats(stats);
    setBookmarkedAyah(ayahNumberInSurah);
  };

  // Copy Ayah text
  const handleCopyAyah = (text: string, ayahNum: number) => {
    navigator.clipboard.writeText(`${text} [${currentSurah.name}: ${ayahNum}]`);
    setCopiedAyah(ayahNum);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  // Filtered Surahs for modal search
  const filteredSurahs = ALL_SURAHS.filter(s =>
    s.name.includes(searchQuery) ||
    s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString() === searchQuery
  );

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Surah Header & Toolbar: Illuminated Quranic Plaque */}
      <div className="relative overflow-hidden rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 md:p-8 shadow-2xl">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 islamic-pattern-bg opacity-35 pointer-events-none" />
        
        {/* Corner Gilded Accents */}
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c59b27]/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c59b27]/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Surah Info Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={() => setShowSurahModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] hover:to-[#0e4838] text-[#fbf8f2] font-bold text-lg flex items-center gap-2.5 border border-[#c59b27]/45 shadow-lg shadow-[#020e0a] transition-all cursor-pointer font-display"
            >
              <span>سورة {currentSurah.name}</span>
              <span className="text-xs font-normal text-[#d4af37] opacity-90">(فهرس السور ▾)</span>
            </button>

            <div className="text-xs text-[#ded3c0]/80 flex items-center flex-wrap gap-2">
              <span className="font-semibold text-[#d4af37] px-2 py-0.5 rounded-full bg-[#0a3528] border border-[#c59b27]/25">
                {currentSurah.revelationType}
              </span>
              <span>·</span>
              <span><strong className="font-mono tabular-nums text-[#fbf8f2]">{currentSurah.versesCount}</strong> آية</span>
              <span>·</span>
              <span>الجزء <strong className="font-mono tabular-nums text-[#fbf8f2]">{currentSurah.juz}</strong></span>
              <span>·</span>
              <span>الصفحة <strong className="font-mono tabular-nums text-[#fbf8f2]">{currentSurah.page}</strong></span>
            </div>
          </div>

          {/* Quick reciter, Calm Mode, Khushoo and size buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Khushoo Recitations Trigger */}
            <button
              onClick={() => setShowKhushooModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c59b27]/15 hover:bg-[#c59b27]/25 text-[#f2dc87] text-xs font-semibold border border-[#c59b27]/40 transition-colors cursor-pointer shadow-sm"
              title="قائمة بتلاوات خاشعة ومؤثرة لكبار القراء"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>تلاوات خاشعة</span>
            </button>

            {/* Calm Mode Trigger */}
            <button
              onClick={() => setCalmMode(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/30 transition-colors cursor-pointer shadow-sm"
              title="تفعيل الوضع الهادئ لتخفيف التشتت والتركيز التام أثناء الاستماع"
            >
              <Moon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الوضع الهادئ</span>
            </button>

            {/* Reciter Selector */}
            <button
              onClick={() => setShowReciterModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] text-xs border border-[#c59b27]/30 transition-colors cursor-pointer"
              title="اختيار القارئ"
            >
              <Headphones className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>القارئ: {currentReciter.name}</span>
            </button>

            {/* Font size switcher */}
            <div className="flex items-center bg-[#051c15] rounded-xl p-1 border border-[#c59b27]/25 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${fontSize === 'normal' ? 'bg-[#c59b27] text-[#041611] font-bold' : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'}`}
              >
                أ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${fontSize === 'large' ? 'bg-[#c59b27] text-[#041611] font-bold' : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'}`}
              >
                أ+
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${fontSize === 'huge' ? 'bg-[#c59b27] text-[#041611] font-bold' : 'text-[#ded3c0]/70 hover:text-[#fbf8f2]'}`}
              >
                أ++
              </button>
            </div>
          </div>
        </div>

        {/* Curated Khushoo Recitations Horizontal Carousel */}
        <div className="mt-4 pt-3.5 border-t border-stone-800/80">
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تلاوات خاشعة ومؤثرة لكبار القراء:</span>
            </div>
            <button
              onClick={() => setShowKhushooModal(true)}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              عرض الكل (12 تلاوة) ←
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {KHUSHOO_RECITATIONS.map(item => {
              const isItemActive = currentSurahId === item.surahId && selectedReciterId === item.reciterId;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectKhushooRecitation(item)}
                  className={`px-3 py-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 flex items-center gap-2.5 text-xs ${
                    isItemActive
                      ? 'bg-amber-950/60 border-amber-500/60 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-stone-800/70 hover:bg-stone-800 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isItemActive ? 'bg-amber-500 text-amber-950 font-bold' : 'bg-stone-800 text-amber-400'
                  }`}>
                    {isItemActive && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-amber-950 animate-ping" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>سورة {item.surahName}</span>
                      <span className="text-[10px] text-amber-300/90 font-normal">({item.mood})</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      بصوت {item.reciterName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Player Bar */}
        <div className="mt-5 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTogglePlay()}
              className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 transition-transform active:scale-95"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
            >
              {isAudioBuffering ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white mr-0.5" />
              )}
            </button>

            {/* Prev / Next Surah */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentSurahId <= 1}
                onClick={() => setCurrentSurahId(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="السورة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentSurahId >= 114}
                onClick={() => setCurrentSurahId(prev => Math.min(114, prev + 1))}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="السورة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-300">
              {playingAyahIndex !== null ? (
                currentReciter.supportsAyahAudio ? (
                  <span>
                    تلاوة الآية <span className="font-mono font-bold text-emerald-400">{playingAyahIndex + 1}</span> من {ayahs.length}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>تلاوة سورة {currentSurah.name} كاملة بصوت القارئ {currentReciter.name}</span>
                  </span>
                )
              ) : (
                <span>تلاوة كاملة بصوت القارئ {currentReciter.name}</span>
              )}
            </div>
          </div>

          {/* Repeat Ayah & Speed Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Repeat count (for ayah-by-ayah reciters) */}
            {currentReciter.supportsAyahAudio && (
              <div className="flex items-center gap-1 bg-stone-800/80 px-2.5 py-1.5 rounded-lg border border-stone-700">
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-400">التكرار:</span>
                {[1, 3, 5].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setRepeatCount(cnt)}
                    className={`px-1.5 py-0.5 rounded font-mono cursor-pointer ${
                      repeatCount === cnt ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {cnt}x
                  </button>
                ))}
              </div>
            )}

            {/* Playback speed */}
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 0.8 : 1.0;
                setPlaybackSpeed(nextSpeed);
                if (audioRef.current) {
                  audioRef.current.playbackRate = nextSpeed;
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 font-mono cursor-pointer"
              title="سرعة التلاوة"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>

        {/* Quick Reciter Selection Bar */}
        <div className="mt-4 pt-3.5 border-t border-stone-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-stone-400 shrink-0">
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-stone-300">القرّاء المتاحون:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {RECITERS.map(rec => {
              const isSelected = selectedReciterId === rec.id;
              const isSherif = rec.id === 'sherif_mostafa';

              return (
                <button
                  key={rec.id}
                  onClick={() => handleSelectReciter(rec.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold ring-1 ring-emerald-400/50'
                      : isSherif
                      ? 'bg-stone-800/90 text-amber-200 border border-amber-600/50 hover:bg-stone-700'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                  }`}
                  title={rec.description}
                >
                  <span>{rec.name}</span>
                  {isSherif && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      خاشع
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sherif Mostafa Status & Recorded Surahs Guidance */}
        {selectedReciterId === 'sherif_mostafa' && (
          isSurahAvailableForReciter('sherif_mostafa', currentSurahId) ? (
            <div className="mt-3.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  تلاوة استوديو حقيقية ومسجلة بصوت <strong>القارئ شريف مصطفى</strong> لسورة {currentSurah.name} مصحوبة بمؤثرات المطر والسكينة ✨
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3.5 p-3.5 rounded-2xl bg-stone-900/90 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>تلاوات القارئ شريف مصطفى الحقيقية (22 سورة خاشعة):</span>
                </div>
                <span className="text-[10px] text-stone-400">اختر سورة للاستماع لصوته</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                سورة {currentSurah.name} لم يسجلها القارئ شريف مصطفى بالكامل؛ انقر على إحدى سوره الشهيرة المسجلة للاستماع إليها فوراً:
              </p>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {[
                  { id: 20, name: 'طه' },
                  { id: 19, name: 'مريم' },
                  { id: 67, name: 'الملك' },
                  { id: 56, name: 'الواقعة' },
                  { id: 55, name: 'الرحمن' },
                  { id: 76, name: 'الإنسان' },
                  { id: 89, name: 'الفجر' },
                  { id: 53, name: 'النجم' },
                  { id: 57, name: 'الحديد' },
                  { id: 71, name: 'نوح' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSurahId(s.id);
                      setReciterNotice(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium cursor-pointer transition-colors"
                  >
                    سورة {s.name}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {/* Reciter Notice (if applicable) */}
        {reciterNotice && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-center justify-between gap-2">
            <span>{reciterNotice}</span>
            <button
              onClick={() => setReciterNotice(null)}
              className="text-stone-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quran Atmosphere & Calming Rain Controls */}
        <div className={`mt-3.5 p-3.5 rounded-2xl border transition-all ${
          youtubeEffectsEnabled
            ? 'bg-gradient-to-l from-amber-950/40 via-stone-900/90 to-stone-900 border-amber-500/40 shadow-lg ring-1 ring-amber-500/20'
            : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                youtubeEffectsEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-stone-800 text-stone-500'
              }`}>
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">مؤثرات القرآن والسكينة (صوت المطر والصدى الخاشع)</span>
                  {selectedReciterId === 'sherif_mostafa' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      نمط تلاوات شريف مصطفى الشهيرة ✨
                    </span>
                  )}
                  {isPlaying && youtubeEffectsEnabled && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>المؤثرات تعمل مع التلاوة</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                  خلفية صوتية هادئة تحاكي تلاوات يوتيوب الخاشعة مع رذاذ المطر الرقيق ودوي رعد لطيف مهدئ للأعصاب يجعل صوت التلاوة أعمق وأحلى.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 flex-wrap">
              {youtubeEffectsEnabled && (
                <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700/80">
                  <span className="text-[10px] text-stone-400">شدة المطر:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={youtubeEffectsVolume}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setYoutubeEffectsVolume(v);
                      localStorage.setItem('itqan_youtube_volume', v.toString());
                      if (isPlaying) {
                        ambientAudioEngine.startYouTubeAtmosphere(v);
                      }
                    }}
                    className="w-20 accent-amber-500 cursor-pointer"
                    title="تعديل شدة صوت المطر في الخلفية"
                  />
                  <span className="text-[10px] font-mono text-amber-400 font-bold min-w-7">
                    {Math.round(youtubeEffectsVolume * 100)}%
                  </span>
                </div>
              )}

              {/* Main Toggle Button */}
              <button
                onClick={() => {
                  const next = !youtubeEffectsEnabled;
                  setYoutubeEffectsEnabled(next);
                  localStorage.setItem('itqan_youtube_effects', next ? 'true' : 'false');
                  if (!next) {
                    ambientAudioEngine.stopYouTubeAtmosphere();
                  } else if (isPlaying) {
                    ambientAudioEngine.startYouTubeAtmosphere(youtubeEffectsVolume);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  youtubeEffectsEnabled
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950 font-bold ring-1 ring-amber-400/40'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                }`}
              >
                <span>{youtubeEffectsEnabled ? 'مؤثرات القرآن: مفعلة 🌧️' : 'تفعيل مؤثرات القرآن والمطر'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basmalah (except for Surah At-Tawbah 9 and Surah Al-Fatihah 1 which has it as Ayah 1) */}
      {currentSurahId !== 9 && currentSurahId !== 1 && (
        <div className="relative text-center py-6 my-2">
          <div className="inline-block relative px-8 py-3 rounded-2xl bg-gradient-to-b from-[#07271e] to-[#041913] border border-[#c59b27]/35 shadow-lg">
            <span className="absolute -top-2 right-1/2 translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full" />
            <p className="font-quran text-2xl sm:text-3xl text-[#fbf8f2] tracking-wider drop-shadow-[0_0_10px_rgba(212,175,55,0.25)]">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>
      )}

      {/* Ayahs Stream: Luxury Gilded Manuscript Formatting */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#c59b27] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#ded3c0]/80">جاري تحميل آيات سورة {currentSurah.name} والتفسير الميسر...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ayahs.map((ayah, index) => {
            const isPlayingThis = playingAyahIndex === index && isPlaying;
            const isBookmarked = bookmarkedAyah === ayah.numberInSurah;
            const isCopied = copiedAyah === ayah.numberInSurah;

            return (
              <div
                key={ayah.number}
                className={`group relative rounded-3xl p-6 sm:p-7 md:p-8 transition-all border ${
                  isPlayingThis
                    ? 'bg-gradient-to-l from-[#0e4838] via-[#093527] to-[#06251c] border-[#c59b27] shadow-xl shadow-[#020e0a] ring-1 ring-[#c59b27]/50'
                    : isBookmarked
                    ? 'bg-[#08291f]/90 border-[#c59b27]/60 shadow-md'
                    : 'bg-[#051c15]/80 border-[#c59b27]/25 hover:border-[#c59b27]/45 hover:bg-[#07241c]/90 shadow-sm'
                }`}
              >
                {/* Subtle corner gilded brackets */}
                <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-[#c59b27]/35 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#c59b27]/35 pointer-events-none" />

                {/* Ayah Text with generous line height and clear Arabic typography */}
                <div className="mb-5 text-right">
                  <p
                    className={`font-quran text-[#fbf8f2] leading-[2.6] transition-all ${
                      fontSize === 'normal'
                        ? 'text-xl sm:text-2xl'
                        : fontSize === 'large'
                        ? 'text-2xl sm:text-3xl'
                        : 'text-3xl sm:text-4xl'
                    }`}
                  >
                    {ayah.text}{' '}
                    {/* Gilded Rosette Ayah Marker */}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#c59b27]/70 text-[#d4af37] text-xs font-mono tabular-nums mr-2.5 bg-[#051e17] align-middle shadow-inner">
                      {ayah.numberInSurah}
                    </span>
                  </p>
                </div>

                {/* Ayah Actions & Tafseer Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#c59b27]/20 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Play this Ayah */}
                    <button
                      onClick={() => handleTogglePlay(index)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#c59b27] text-[#041611] font-bold shadow-md shadow-[#c59b27]/30'
                          : 'bg-[#07261e] hover:bg-[#0c382b] text-[#ded3c0] hover:text-[#fbf8f2] border border-[#c59b27]/25'
                      }`}
                    >
                      {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingThis ? 'إيقاف' : 'استمع للآية'}</span>
                    </button>

                    {/* Tafseer Trigger */}
                    <button
                      onClick={() => setActiveTafseerAyah(ayah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07261e] hover:bg-[#0c382b] text-[#d4af37] hover:text-[#f2dc87] transition-colors border border-[#c59b27]/25 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>معاني وتفسير الآية</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[#ded3c0]/70">
                    {/* Copy */}
                    <button
                      onClick={() => handleCopyAyah(ayah.text, ayah.numberInSurah)}
                      className="p-1.5 rounded-lg hover:bg-[#0a3528] hover:text-[#fbf8f2] transition-colors cursor-pointer"
                      title="نسخ الآية"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-[#d4af37]" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleBookmark(ayah.numberInSurah)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-[#d4af37] hover:bg-[#0a3528]'
                          : 'hover:bg-[#0a3528] hover:text-[#d4af37]'
                      }`}
                      title={isBookmarked ? 'العلامة الحالية' : 'حفظ كعلامة للقراءة'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#d4af37]' : ''}`} />
                    </button>

                    <span className="font-mono tabular-nums text-[11px] text-[#ded3c0]/60 mr-1">
                      ص {ayah.page} · جـ {ayah.juz}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* End of Surah Illuminated Seal */}
          <div className="text-center py-8 my-4 border-t border-b border-[#c59b27]/25">
            <div className="inline-flex items-center gap-3 text-xs text-[#d4af37]">
              <span>❖</span>
              <span className="font-display text-base font-bold text-[#fbf8f2]">
                صَدَقَ اللَّهُ الْعَظِيمُ
              </span>
              <span>❖</span>
            </div>
            <p className="text-[11px] text-[#ded3c0]/60 mt-1">
              تمت بحمد الله وتوفيقه سورة {currentSurah.name}
            </p>
          </div>
        </div>
      )}

      {/* Tafseer Drawer / Modal */}
      {activeTafseerAyah && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-7 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#c59b27]/20 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#fbf8f2] font-display">
                  معنى وتفسير الآية {activeTafseerAyah.numberInSurah} من سورة {currentSurah.name}
                </h3>
                {/* Mandatory explicit Tafseer Source citation */}
                <p className="text-[11px] text-[#d4af37] font-medium mt-0.5">
                  المصدر: {TAFSEER_SOURCE_NAME}
                </p>
              </div>
              <button
                onClick={() => setActiveTafseerAyah(null)}
                className="w-8 h-8 rounded-full bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ayah display in Tafseer modal */}
            <div className="p-5 rounded-2xl bg-[#03150f] border border-[#c59b27]/30 mb-5 text-center shadow-inner">
              <p className="font-quran text-xl text-[#fbf8f2] leading-loose">
                « {activeTafseerAyah.text} »
              </p>
            </div>

            {/* Tafseer prose */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#d4af37]">نص التفسير الميسر:</h4>
              <p className="text-sm text-[#ded3c0] leading-relaxed bg-[#07241c]/60 p-4 rounded-xl border border-[#c59b27]/20">
                {activeTafseerAyah.tafseer || 'التفسير متاح بالرجوع لمصادر التفاسير المعتمدة.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#c59b27]/20 flex justify-end">
              <button
                onClick={() => setActiveTafseerAyah(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0a3528] hover:bg-[#0e4838] text-[#fbf8f2] text-xs font-semibold border border-[#c59b27]/40 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Surah List Modal */}
      {showSurahModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-7 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20">
              <h3 className="text-base font-bold text-[#fbf8f2] flex items-center gap-2 font-display">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <span>فهرس سور القرآن الكريم (114 سورة)</span>
              </h3>
              <button
                onClick={() => setShowSurahModal(false)}
                className="w-8 h-8 rounded-full bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-4">
              <Search className="w-4 h-4 text-[#c59b27] absolute right-3.5 top-3.5" />
              <input
                type="text"
                placeholder="ابحث باسم السورة (مثل: الكهف، البقرة، يس)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#03150f] border border-[#c59b27]/30 rounded-xl pr-10 pl-4 py-2.5 text-xs text-[#fbf8f2] placeholder-[#ded3c0]/50 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Surah Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
              {filteredSurahs.map(s => {
                const isCurrent = s.id === currentSurahId;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSurahId(s.id);
                      setShowSurahModal(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-right transition-colors border cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0d4737] border-[#c59b27] text-[#fbf8f2] shadow-sm'
                        : 'bg-[#07241c]/70 border-[#c59b27]/20 hover:bg-[#0a3528] text-[#ded3c0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#041913] border border-[#c59b27]/30 flex items-center justify-center text-xs font-mono tabular-nums text-[#d4af37]">
                        {s.id}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#fbf8f2]">{s.name}</p>
                        <span className="text-[10px] text-[#ded3c0]/60">{s.nameEnglish}</span>
                      </div>
                    </div>
                    <div className="text-left text-[11px] text-[#ded3c0]/70">
                      <span>{s.versesCount} آية</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reciter Selector Modal */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="manuscript-border bg-[#051c15] border border-[#c59b27]/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b27]/20 mb-4">
              <h3 className="text-base font-bold text-[#fbf8f2] flex items-center gap-2 font-display">
                <Volume2 className="w-5 h-5 text-[#d4af37]" />
                <span>اختر القارئ المفضل</span>
              </h3>
              <button
                onClick={() => setShowReciterModal(false)}
                className="w-8 h-8 rounded-full bg-[#082a20] hover:bg-[#0c382b] text-[#ded3c0] flex items-center justify-center border border-[#c59b27]/30 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {RECITERS.map(reciter => {
                const isSelected = reciter.id === selectedReciterId;
                const isSherif = reciter.id === 'sherif_mostafa';

                return (
                  <button
                    key={reciter.id}
                    onClick={() => handleSelectReciter(reciter.id)}
                    className={`w-full p-4 rounded-2xl text-right transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-600 shadow-md ring-1 ring-emerald-500/40'
                        : isSherif
                        ? 'bg-stone-800/70 border-amber-600/50 hover:bg-stone-800 text-stone-100'
                        : 'bg-stone-800/40 border-stone-800 hover:bg-stone-800 text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{reciter.name}</span>
                        {isSherif && (
                          <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                            صوت خاشع ومؤثر
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                            المحدد حالياً
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300 mt-1">{reciter.description}</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        {reciter.supportsAyahAudio
                          ? 'يدعم التكرار آية بآية'
                          : 'بث مباشر عالي الجودة لكامل السورة'}
                      </span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Khushoo Recitations Modal */}
      <KhushooRecitationsModal
        isOpen={showKhushooModal}
        onClose={() => setShowKhushooModal(false)}
        onSelectRecitation={handleSelectKhushooRecitation}
        currentSurahId={currentSurahId}
        currentReciterId={selectedReciterId}
      />

      {/* Calm Mode Fullscreen Focus Stage */}
      {calmMode && (
        <QuranCalmMode
          surah={currentSurah}
          ayahs={ayahs}
          currentAyahIndex={playingAyahIndex ?? 0}
          isPlaying={isPlaying}
          reciter={currentReciter}
          playbackSpeed={playbackSpeed}
          repeatCount={repeatCount}
          rainEnabled={youtubeEffectsEnabled}
          rainVolume={youtubeEffectsVolume}
          onTogglePlay={() => handleTogglePlay()}
          onNextAyah={() => {
            const next = Math.min(ayahs.length - 1, (playingAyahIndex ?? 0) + 1);
            playAyahAtIndex(next);
          }}
          onPrevAyah={() => {
            const prev = Math.max(0, (playingAyahIndex ?? 0) - 1);
            playAyahAtIndex(prev);
          }}
          onSelectAyah={(idx) => playAyahAtIndex(idx)}
          onChangeSpeed={(spd) => {
            setPlaybackSpeed(spd);
            if (audioRef.current) audioRef.current.playbackRate = spd;
          }}
          onToggleRepeat={() => {
            const nextCnt = repeatCount === 1 ? 3 : repeatCount === 3 ? 5 : 1;
            setRepeatCount(nextCnt);
          }}
          onToggleRain={() => {
            const next = !youtubeEffectsEnabled;
            setYoutubeEffectsEnabled(next);
            localStorage.setItem('itqan_youtube_effects', next ? 'true' : 'false');
            if (!next) {
              ambientAudioEngine.stopYouTubeAtmosphere();
            } else if (isPlaying) {
              ambientAudioEngine.startYouTubeAtmosphere(youtubeEffectsVolume);
            }
          }}
          onChangeRainVolume={(vol) => {
            setYoutubeEffectsVolume(vol);
            localStorage.setItem('itqan_youtube_volume', vol.toString());
            if (isPlaying && youtubeEffectsEnabled) {
              ambientAudioEngine.startYouTubeAtmosphere(vol);
            }
          }}
          onExit={() => setCalmMode(false)}
        />
      )}
    </div>
  );
};
