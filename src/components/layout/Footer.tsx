import React from 'react';
import { NavTab } from './Navigation';
import { Compass, BookOpen, ShieldCheck, Timer, Calendar, Volume2, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenNotifications?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenNotifications }) => {
  return (
    <footer className="mt-20 border-t border-[#c59b27]/25 bg-[#03130e]/95 text-[#ded3c0] py-12 px-4 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Subtle Islamic Motif Top Line */}
        <div className="flex items-center justify-center gap-3 text-xs text-[#d4af37] opacity-80">
          <span className="w-24 h-px bg-gradient-to-r from-transparent to-[#c59b27]/60" />
          <span className="font-serif tracking-widest">❖ &nbsp; ✦ &nbsp; ❖</span>
          <span className="w-24 h-px bg-gradient-to-l from-transparent to-[#c59b27]/60" />
        </div>

        {/* 3 Columns: Brand & Mission | Fast Navigation | Authenticity & Verification */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 & 2: Brand Lockup & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0c3a2e] to-[#041d15] border border-[#c59b27]/40 flex items-center justify-center text-[#d4af37] shadow-sm">
                <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2.5C7.5 2.5 4 7 4 13.5V21.5H20V13.5C20 7 16.5 2.5 12 2.5Z" />
                </svg>
              </div>
              <span className="text-xl font-bold font-display text-[#fbf8f2] tracking-wide">
                إتـقـان
              </span>
              <span className="text-xs text-[#c59b27]">· رفيق الإنتاجية والسكينة</span>
            </div>

            <p className="text-xs text-[#ded3c0]/75 leading-relaxed max-w-md">
              منظومة إسلامية متكاملة للمسلم المعاصر، تعينك على وصل يومك ببركة الوحي، وتنظيم فرائضك وسننك ومحطات عملك ودراستك في واحة روحانية راقية وخالية من التشتيت.
            </p>

            <div className="pt-2 text-[11px] text-[#ded3c0]/60 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>مصحفك، أذكارك، مواقيت صلاتك، وخطتك اليومية في مكان واحد.</span>
            </div>
          </div>

          {/* Col 3: Fast Navigation Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#fbf8f2] tracking-wider border-b border-[#c59b27]/20 pb-1.5 inline-block">
              أقسام المنصة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3 h-3 text-[#d4af37]" />
                  <span>الرئيسية ومواقيت الصلاة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quran')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-[#d4af37]" />
                  <span>المصحف الشريف والتفاسير</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hisn_muslim')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                  <span>حصن المسلم والتحصين</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('timer')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Timer className="w-3 h-3 text-[#d4af37]" />
                  <span>مؤقت بومودورو للتركيز</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3 h-3 text-[#d4af37]" />
                  <span>الجدول اليومي والأهداف</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ambient')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-[#d4af37]" />
                  <span>أصوات السكينة والطبيعة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Verification & Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#fbf8f2] tracking-wider border-b border-[#c59b27]/20 pb-1.5 inline-block">
              التوثيق والمصادر
            </h4>
            <div className="space-y-2 text-xs text-[#ded3c0]/75">
              <p className="leading-relaxed">
                • <strong className="text-[#fbf8f2]">مواقيت الصلاة:</strong> الهيئة المصرية العامة للمساحة ودار الإفتاء.
              </p>
              <p className="leading-relaxed">
                • <strong className="text-[#fbf8f2]">المصحف الشريف:</strong> مجمع الملك فهد لطباعة المصحف الشريف والتفسير الميسر.
              </p>
              <p className="leading-relaxed">
                • <strong className="text-[#fbf8f2]">الأذكار:</strong> كتاب حصن المسلم للشيخ سعيد بن علي بن وهف القحطاني رحمه الله.
              </p>
              {onOpenNotifications && (
                <div className="pt-2">
                  <button
                    onClick={onOpenNotifications}
                    className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
                  >
                    ضبط التنبيهات والتذكيرات ←
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 border-t border-[#c59b27]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#ded3c0]/60">
          <div className="flex items-center gap-2">
            <span>إتقان © {new Date().getFullYear()}</span>
            <span aria-hidden="true">·</span>
            <span>جميع الحقوق محفوظة لكل مسلم</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#d4af37]">
            <Heart className="w-3.5 h-3.5 fill-[#d4af37]/20 text-[#d4af37]" />
            <span>صُمم بإتقان وروحانية خالصة لوجه الله تعالى</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
