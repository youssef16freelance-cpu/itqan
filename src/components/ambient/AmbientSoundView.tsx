import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Waves,
  Flame,
  Droplets,
  Trees,
  Moon,
  Headphones,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AMBIENT_TRACKS, AmbientTrackConfig, ambientAudioEngine } from '../../services/ambientAudio';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain,
  Waves,
  Flame,
  Droplets,
  Trees,
  Moon,
  Headphones
};

export const AmbientSoundView: React.FC = () => {
  const [activeTracks, setActiveTracks] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolume] = useState<number>(0.8);

  // Sync state with audio engine
  useEffect(() => {
    const update = () => {
      const active = AMBIENT_TRACKS.filter(t => ambientAudioEngine.isTrackPlaying(t.id)).map(t => t.id);
      setActiveTracks(active);
      const vols: Record<string, number> = {};
      AMBIENT_TRACKS.forEach(t => {
        vols[t.id] = ambientAudioEngine.getTrackVolume(t.id);
      });
      setVolumes(vols);
      setMasterVolume(ambientAudioEngine.getMasterVolume());
    };

    update();
    const unsub = ambientAudioEngine.subscribe(update);
    return () => unsub();
  }, []);

  const handleToggle = (trackId: string) => {
    ambientAudioEngine.toggleTrack(trackId);
  };

  const handleVolumeChange = (trackId: string, val: number) => {
    ambientAudioEngine.setTrackVolume(trackId, val);
  };

  const handleMasterVolumeChange = (val: number) => {
    ambientAudioEngine.setMasterVolume(val);
  };

  const handleStopAll = () => {
    ambientAudioEngine.stopAll();
  };

  // Sound Mix Presets
  const applyPreset = (presetTracks: { id: string; vol: number }[]) => {
    ambientAudioEngine.stopAll();
    setTimeout(() => {
      presetTracks.forEach(pt => {
        ambientAudioEngine.setTrackVolume(pt.id, pt.vol);
        ambientAudioEngine.toggleTrack(pt.id);
      });
    }, 50);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Studio Header: Illuminated Header */}
      <div className="relative overflow-hidden rounded-3xl manuscript-border bg-gradient-to-b from-[#07261e] via-[#051e17] to-[#041611] p-6 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 islamic-pattern-bg opacity-35 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] mb-1.5">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>استوديو السكينة والأصوات الهادئة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fbf8f2] font-display">
            أصوات الطبيعة لعزل المشتتات والتركيز العميق
          </h2>
          <p className="text-xs text-[#ded3c0]/85 mt-1 max-w-xl leading-relaxed">
            أصوات مريحة تعمل في الخلفية بدون انقطاع حتى أثناء استخدام مؤقت بومودورو أو تصفح المصحف الشريف.
          </p>
        </div>

        {/* Master Controls */}
        <div className="relative z-10 flex items-center gap-4 bg-[#051c15] p-3 rounded-2xl border border-[#c59b27]/30 shadow-inner shrink-0">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#d4af37]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={e => handleMasterVolumeChange(Number(e.target.value))}
              className="w-24 accent-[#d4af37] cursor-pointer"
              title="مستوى الصوت العام"
            />
          </div>

          <button
            disabled={activeTracks.length === 0}
            onClick={handleStopAll}
            className="px-3.5 py-1.5 rounded-xl bg-[#093527] hover:bg-[#0d4735] disabled:opacity-40 text-[#ded3c0] hover:text-[#fbf8f2] text-xs font-medium border border-[#c59b27]/30 transition-colors cursor-pointer"
          >
            إيقاف الكل ({activeTracks.length})
          </button>
        </div>
      </div>

      {/* Recommended Mix Presets */}
      <div>
        <h3 className="text-xs font-bold text-[#d4af37] mb-2.5 flex items-center gap-1.5">
          <span>خلطات صوتية موصى بها للتركيز والسكينة:</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset([{ id: 'rain', vol: 0.7 }, { id: 'brown_noise', vol: 0.4 }])}
            className="p-3.5 rounded-2xl bg-[#062017]/80 hover:bg-[#093023] border border-[#c59b27]/20 hover:border-[#c59b27]/45 text-right transition-all cursor-pointer shadow-sm"
          >
            <p className="text-xs font-bold text-[#fbf8f2]">مطر وهدوء ذهني</p>
            <span className="text-[10px] text-[#ded3c0]/65 mt-0.5 block">مطر + ضوضاء بنية للتركيز</span>
          </button>

          <button
            onClick={() => applyPreset([{ id: 'forest', vol: 0.7 }, { id: 'stream', vol: 0.5 }])}
            className="p-3.5 rounded-2xl bg-[#062017]/80 hover:bg-[#093023] border border-[#c59b27]/20 hover:border-[#c59b27]/45 text-right transition-all cursor-pointer shadow-sm"
          >
            <p className="text-xs font-bold text-[#fbf8f2]">طبيعة جبلية غناء</p>
            <span className="text-[10px] text-[#ded3c0]/65 mt-0.5 block">نسيم الغابة + جدول ماء</span>
          </button>

          <button
            onClick={() => applyPreset([{ id: 'waves', vol: 0.7 }, { id: 'crickets', vol: 0.4 }])}
            className="p-3.5 rounded-2xl bg-[#062017]/80 hover:bg-[#093023] border border-[#c59b27]/20 hover:border-[#c59b27]/45 text-right transition-all cursor-pointer shadow-sm"
          >
            <p className="text-xs font-bold text-[#fbf8f2]">سكون ليل وبحر</p>
            <span className="text-[10px] text-[#ded3c0]/65 mt-0.5 block">أمواج هادئة + صرار الليل</span>
          </button>

          <button
            onClick={() => applyPreset([{ id: 'fire', vol: 0.7 }, { id: 'rain', vol: 0.5 }])}
            className="p-3.5 rounded-2xl bg-[#062017]/80 hover:bg-[#093023] border border-[#c59b27]/20 hover:border-[#c59b27]/45 text-right transition-all cursor-pointer shadow-sm"
          >
            <p className="text-xs font-bold text-[#fbf8f2]">دفء الموقد والمطر</p>
            <span className="text-[10px] text-[#ded3c0]/65 mt-0.5 block">حطب دافئ + قطرات المطر</span>
          </button>
        </div>
      </div>

      {/* Individual Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AMBIENT_TRACKS.map(track => {
          const Icon = ICON_MAP[track.icon] || Headphones;
          const isPlaying = activeTracks.includes(track.id);
          const currentVol = volumes[track.id] ?? 0.6;

          return (
            <div
              key={track.id}
              className={`rounded-3xl p-5 border transition-all shadow-md relative overflow-hidden ${
                isPlaying
                  ? 'bg-gradient-to-b from-[#0b382c] to-[#06251c] border-[#c59b27] shadow-xl shadow-[#020e0a] ring-1 ring-[#c59b27]/40'
                  : 'bg-[#062017]/80 border-[#c59b27]/20 hover:border-[#c59b27]/40 hover:bg-[#082a20]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#093527] border border-[#c59b27]/40 flex items-center justify-center text-[#d4af37] shadow-sm"
                  >
                    <Icon className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#fbf8f2]">{track.name}</h4>
                    <span className="text-[10px] text-[#ded3c0]/60">{track.nameEn}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(track.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#c59b27] text-[#041611] shadow-md shadow-[#c59b27]/40 font-bold'
                      : 'bg-[#093527] hover:bg-[#0c4433] text-[#ded3c0] border border-[#c59b27]/25'
                  }`}
                  title={isPlaying ? 'إيقاف' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
                </button>
              </div>

              <p className="text-xs text-[#ded3c0]/80 mb-4 leading-relaxed min-h-[32px]">
                {track.description}
              </p>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 pt-2.5 border-t border-[#c59b27]/20">
                <span className="text-[10px] text-[#ded3c0]/70">الحجم:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentVol}
                  onChange={e => handleVolumeChange(track.id, Number(e.target.value))}
                  disabled={!isPlaying}
                  className="flex-1 accent-[#d4af37] disabled:opacity-30 cursor-pointer"
                />
                <span className="text-[10px] font-mono tabular-nums text-[#d4af37] w-8 text-left">
                  {Math.round(currentVol * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
