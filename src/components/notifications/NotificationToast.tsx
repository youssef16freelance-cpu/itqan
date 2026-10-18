import React, { useState, useEffect } from 'react';
import { BookOpen, Timer, Sparkles, X, Play } from 'lucide-react';
import { AppNotification, notificationService } from '../../services/notificationService';

interface NotificationToastProps {
  onNavigateAction: (tab: 'quran' | 'timer' | 'schedule', surahId?: number) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onNavigateAction }) => {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;
    const unsub = notificationService.subscribe(() => {
      const list = notificationService.getNotifications();
      if (list.length > 0 && !list[0].read) {
        setActiveToast(list[0]);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setActiveToast(null);
        }, 7000);
      }
    });

    return () => {
      unsub();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!activeToast) return null;

  return (
    <div className="fixed top-16 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="manuscript-border rounded-2xl bg-[#051c15]/95 backdrop-blur-md border border-[#c59b27]/60 p-4 shadow-2xl shadow-[#020e0a] flex items-start justify-between gap-3 text-right">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#093527] text-[#d4af37] border border-[#c59b27]/40 flex items-center justify-center shrink-0 mt-0.5">
            {activeToast.type === 'quran_wird' || activeToast.type === 'mulk_night' ? (
              <BookOpen className="w-4 h-4" />
            ) : activeToast.type === 'focus_session' ? (
              <Timer className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#fbf8f2]">{activeToast.title}</h4>
            <p className="text-[11px] text-[#ded3c0]/85 mt-0.5 leading-snug line-clamp-2">
              {activeToast.message}
            </p>

            {activeToast.actionLabel && activeToast.actionTab && (
              <button
                onClick={() => {
                  notificationService.markAsRead(activeToast.id);
                  onNavigateAction(activeToast.actionTab!, activeToast.targetSurahId);
                  setActiveToast(null);
                }}
                className="mt-2 px-3 py-1 rounded-xl bg-gradient-to-l from-[#0e4838] to-[#0a382c] hover:from-[#125946] text-[#fbf8f2] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#c59b27]/40"
              >
                <Play className="w-3 h-3 fill-current text-[#d4af37]" />
                <span>{activeToast.actionLabel}</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            notificationService.markAsRead(activeToast.id);
            setActiveToast(null);
          }}
          className="text-[#ded3c0]/40 hover:text-[#fbf8f2] p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
