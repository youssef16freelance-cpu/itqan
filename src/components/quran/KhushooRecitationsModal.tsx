import React from 'react';
import { X, Play, Sparkles, CloudRain, Heart, Headphones } from 'lucide-react';
import { KHUSHOO_RECITATIONS, KhushooRecitation } from '../../data/khushooRecitations';

interface KhushooRecitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecitation: (recitation: KhushooRecitation) => void;
  currentSurahId: number;
  currentReciterId: string;
}

export const KhushooRecitationsModal: React.FC<KhushooRecitationsModalProps> = ({
  isOpen,
  onClose,
  onSelectRecitation,
  currentSurahId,
  currentReciterId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-stone-800 flex items-center justify-between bg-gradient-to-l from-emerald-950/40 to-stone-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>تلاوات خاشعة ومؤثرة</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  مختارات الإتقان
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                مجموعة منتقاة بعناية لأعذب التلاوات التي تفيض بالسكينة والخشوع وترق لها القلوب
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recitations Grid / List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3 divide-y divide-stone-800/60">
          {KHUSHOO_RECITATIONS.map(item => {
            const isCurrentPlaying = currentSurahId === item.surahId && currentReciterId === item.reciterId;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectRecitation(item);
                  onClose();
                }}
                className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrentPlaying
                    ? 'bg-emerald-950/40 border border-emerald-600/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'hover:bg-stone-800/60 border border-transparent hover:border-stone-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                      {item.mood}
                    </span>
                    {item.recommendedRain && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 flex items-center gap-1 font-semibold">
                        <CloudRain className="w-3 h-3" />
                        <span>مطر وسكينة</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-stone-400 flex items-center gap-2 pt-0.5">
                    <Headphones className="w-3 h-3 text-emerald-400" />
                    <span>القارئ: <strong className="text-emerald-300">{item.reciterName}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                      isCurrentPlaying
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white border border-stone-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrentPlaying ? 'يعمل الآن' : 'استماع'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
