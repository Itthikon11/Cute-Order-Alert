import React from 'react';
import { Bell, HelpCircle, Download, Sparkles, Smartphone, Volume2 } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onScrollToSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuide,
  onScrollToSimulator,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-pink-500/20 text-white">
            <Bell className="w-5 h-5 animate-wiggle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 font-['Mitr']">
                Cute Order Alert
              </span>
              <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                ออเดอร์เข้าแย้ว
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              สตูดิโอเสียงแจ้งเตือนร้านค้า เสียงผู้หญิงน่ารักๆ 16-Bit WAV
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onScrollToSimulator}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-pink-300 text-xs font-medium text-slate-700 hover:bg-pink-50/50 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-500" />
            <span>จำลองแจ้งเตือน</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold shadow-xs shadow-pink-500/20 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>วิธีติดตั้งลงมือถือ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
