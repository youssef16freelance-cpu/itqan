import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode (already installed and opened as app)
  if (isInstalled) {
    if (variant === 'header') {
      return (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-[#c59b27]/30 text-xs text-[#f5e1a4]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>تطبيق مُثبّت</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt
      setShowIOSModal(true);
    }
  };

  // Header button style
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm text-[#fbf8f2] bg-gradient-to-r from-[#0d3b2e] to-[#08291f] border border-[#c59b27]/50 shadow-[0_0_12px_rgba(197,155,39,0.15)] hover:border-[#c59b27] hover:shadow-[0_0_16px_rgba(197,155,39,0.3)] transition active:scale-95 group ${className}`}
          title="تثبيت إتقان كتطبيق هاتف"
        >
          <div className="w-5 h-5 rounded-lg bg-[#c59b27]/20 flex items-center justify-center text-[#f5e1a4] group-hover:scale-110 transition">
            <Download className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[#f5e1a4]">تثبيت التطبيق</span>
        </button>

        {/* iOS / Manual Guide Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#062018] border border-[#c59b27]/40 p-6 shadow-2xl text-[#fbf8f2] relative">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-lg text-[#ded3c0] hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c59b27] to-[#8f6c13] flex items-center justify-center p-0.5 shadow-md">
                  <img src="/pwa-192x192.png" alt="إتقان" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#f5e1a4]">تثبيت تطبيق إتقان</h3>
                  <p className="text-xs text-[#ded3c0]">على هواتف iPhone و Android</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-[#eae0cf] my-4 leading-relaxed">
                {isIOS ? (
                  <>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#041611] border border-[#c59b27]/20">
                      <Share className="w-5 h-5 text-[#f5e1a4] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">الخطوة الأولى:</strong>
                        اضغط على زر المشاركة <span className="text-[#f5e1a4] font-semibold">"Share"</span> في شريط Safari بالأسفل.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#041611] border border-[#c59b27]/20">
                      <PlusSquare className="w-5 h-5 text-[#f5e1a4] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">الخطوة الثانية:</strong>
                        مرر لأسفل واختر <span className="text-[#f5e1a4] font-semibold">"إضافة إلى الصفحة الرئيسية"</span> (Add to Home Screen).
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#041611] border border-[#c59b27]/20">
                      <Smartphone className="w-5 h-5 text-[#f5e1a4] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">من متصفح Chrome:</strong>
                        اضغط على خيارات المتصفح (نقاط القائمة ⋮) ثم اختر <span className="text-[#f5e1a4] font-semibold">"تثبيت التطبيق"</span> أو <span className="text-[#f5e1a4] font-semibold">"إضافة إلى الشاشة الرئيسية"</span>.
                      </div>
                    </div>
                  </>
                )}

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#f5e1a4] shrink-0" />
                  <span>ستحصل على تجربة تطبيق أصلي كامل بدون شريط المتصفح ومع وصول سريع.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#dfb746] text-[#041611] font-bold text-sm shadow-md hover:brightness-110 transition"
              >
                فهمت، حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Floating banner for mobile screens
  return (
    <>
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#062018] to-[#041812] border border-[#c59b27]/40 shadow-xl ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c59b27] to-[#8f6c13] flex items-center justify-center p-0.5 shadow">
              <img src="/pwa-192x192.png" alt="إتقان" className="w-full h-full rounded-lg object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#f5e1a4]">تثبيت تطبيق إتقان</h4>
              <p className="text-xs text-[#ded3c0]">شاشة كاملة، وصول فوري، وروحانية هادئة</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#dfb746] text-[#041611] font-bold text-xs shadow-md hover:brightness-110 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#062018] border border-[#c59b27]/40 p-6 shadow-2xl text-[#fbf8f2] relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg text-[#ded3c0] hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src="/pwa-192x192.png" alt="إتقان" className="w-11 h-11 rounded-xl shadow-md" />
              <div>
                <h3 className="font-bold text-base text-[#f5e1a4]">تثبيت تطبيق إتقان</h3>
                <p className="text-xs text-[#ded3c0]">خطوات التثبيت السريع</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#eae0cf] my-4 leading-relaxed">
              {isIOS ? (
                <>
                  <p>1. اضغط على زر المشاركة (Share) في أسفل متصفح Safari.</p>
                  <p>2. اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</p>
                </>
              ) : (
                <p>اضغط على قائمة المتصفح (⋮) ثم اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة للشاشة الرئيسية"</strong>.</p>
              )}
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#dfb746] text-[#041611] font-bold text-sm"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
