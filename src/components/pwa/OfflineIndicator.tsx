import React, { useState } from 'react';
import { WifiOff, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // If online or manually dismissed during this offline session
  if (isOnline || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in">
      <div className="p-4 rounded-2xl bg-[#09221a]/95 backdrop-blur-md border border-[#c59b27]/40 shadow-2xl text-[#fbf8f2] text-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-bold text-[#f5e1a4]">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>أنت في وضع عدم الاتصال</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-[#ded3c0] hover:text-[#fbf8f2] transition rounded"
              title="تفاصيل"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-[#ded3c0] hover:text-[#fbf8f2] transition rounded"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="mt-1.5 text-xs text-[#ded3c0] leading-relaxed">
          تم تفعيل وضع عدم الاتصال. صفحات الموقع الثابتة، المصحف، وحساب مواقيت الصلاة الفلكية في مصر تعمل معك، بينما تحتاج بعض التلاوات الصوتية الخارجية إلى اتصال بالإنترنت.
        </p>

        {expanded && (
          <div className="mt-3 pt-2.5 border-t border-[#c59b27]/20 text-[11px] text-[#baa891] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>يعمل بدون إنترنت: نصوص القرآن، الأذكار، المؤقت، حساب مواقيت الصلاة لمصر</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 inline-block shrink-0" />
              <span>يتطلب إنترنت: البث الصوتي المباشر للتلاوات والملفات الصوتية غير المحملة مسبقاً</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
