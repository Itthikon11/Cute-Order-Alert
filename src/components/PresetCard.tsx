import React from 'react';
import { Play, Square, Download, Sparkles, SlidersHorizontal, Music } from 'lucide-react';
import { SoundPreset } from '../types';

interface PresetCardProps {
  preset: SoundPreset;
  isPlaying: boolean;
  onPlay: (preset: SoundPreset) => void;
  onStop: () => void;
  onSelect: (preset: SoundPreset) => void;
  onDownload: (preset: SoundPreset) => void;
  isSelected?: boolean;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  isPlaying,
  onPlay,
  onStop,
  onSelect,
  onDownload,
  isSelected,
}) => {
  const getChimeIcon = (type: SoundPreset['chimeType']) => {
    switch (type) {
      case 'bell':
        return '🔔 กระดิ่งแก้ววิ้งๆ';
      case 'cash':
        return '💰 เงินเข้า Ka-Ching';
      case 'pop':
        return '🫧 บับเบิ้ลป๊อป';
      case 'dingdong':
        return '🚪 ติ๊งต่องร้านค้า';
      case 'coin':
        return '👾 เหรียญ 8-Bit';
      case 'marimba':
        return '🎶 มาริมบาละมุน';
      default:
        return '🎙️ เสียงพูดล้วน';
    }
  };

  return (
    <div
      className={`relative group bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? 'border-pink-500 shadow-lg shadow-pink-100 ring-2 ring-pink-400/30'
          : 'border-slate-200/80 hover:border-pink-300 hover:shadow-md'
      }`}
    >
      {/* Top Tag & Badge */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${preset.badgeColor} shadow-2xs`}
          >
            {preset.tag}
          </span>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            {getChimeIcon(preset.chimeType)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors font-['Mitr'] flex items-center gap-1.5">
          {preset.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{preset.subtitle}</p>

        {/* Quote text bubble */}
        <div className="mt-3.5 p-3 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-pink-950 font-medium flex items-start gap-2">
          <span className="text-pink-400 font-bold text-base leading-none">“</span>
          <span className="leading-relaxed flex-1">{preset.text}</span>
          <span className="text-pink-400 font-bold text-base leading-none">”</span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
          {preset.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => (isPlaying ? onStop() : onPlay(preset))}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-xs transition-all shadow-xs ${
            isPlaying
              ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
          }`}
          title={isPlaying ? 'หยุดเล่น' : 'ลองฟังเสียงนี้'}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>หยุด</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ฟังเสียง</span>
            </>
          )}
        </button>

        <button
          onClick={() => onSelect(preset)}
          className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isSelected
              ? 'border-pink-500 bg-pink-50 text-pink-700'
              : 'border-slate-200 hover:border-pink-300 text-slate-700 hover:bg-slate-50'
          }`}
          title="โหลดข้อมูลเสียงนี้เข้าสตูดิโอปรับแต่ง"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">ปรับแต่ง</span>
        </button>

        <button
          onClick={() => onDownload(preset)}
          className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
          title="ดาวน์โหลดไฟล์ .WAV ทันที"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
