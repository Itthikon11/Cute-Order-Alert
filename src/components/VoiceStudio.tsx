import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Square,
  Download,
  Volume2,
  Sliders,
  RotateCcw,
  Music,
  Check,
  Zap,
  Mic,
  Bell,
  Layers,
  Wand2,
} from 'lucide-react';
import { VoiceGenerationOptions, VoiceCharacter } from '../types';
import { VOICE_CHARACTERS } from '../data/characters';
import { AudioWaveform } from './AudioWaveform';

interface VoiceStudioProps {
  options: VoiceGenerationOptions;
  onChangeOptions: (newOpts: Partial<VoiceGenerationOptions>) => void;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
  onPlay: () => void;
  onStop: () => void;
  isPlaying: boolean;
  onDownloadWav: () => void;
  hasAudio: boolean;
  currentSource: 'ai' | 'preset' | 'mixed';
  onSelectCharacter?: (char: VoiceCharacter) => void;
}

const QUICK_PHRASES = [
  'ออเดอร์เข้าแย้ว!',
  'ออเดอร์เข้าแย้ววว~ รีบเปิดดูเร็ว!',
  'ออเดอร์เข้าแล้วค่า มีลูกค้าสั่งอาหารแย้ว',
  'ติ๊งต่อง! ออเดอร์เข้าแย้วค่ะ เฮงๆ ปังๆ',
  'Ka-ching! เงินเข้าแล้ว ออเดอร์เข้าแย้วจ้า',
  'เย้! ออเดอร์เข้าแย้ว ขอให้ขายดีทั้งวันน้า',
];

const CHIME_OPTIONS: {
  id: VoiceGenerationOptions['chimeType'];
  name: string;
  icon: string;
  desc: string;
}[] = [
  { id: 'bell', name: 'กระดิ่งแก้ววิ้งๆ', icon: '🔔', desc: 'เสียงคริสตัลใส กังวานหรูหรา' },
  { id: 'cash', name: 'เงินเข้า Ka-ching!', icon: '💰', desc: 'เสียงเครื่องคิดเงิน เสริมดวงค้าขาย' },
  { id: 'pop', name: 'บับเบิ้ลป๊อป', icon: '🫧', desc: 'เสียงป๊อปน่ารัก สไตล์อนิเมะ' },
  { id: 'dingdong', name: 'ติ๊งต่องหน้าร้าน', icon: '🚪', desc: 'เสียงกริ่งสองจังหวะ คลาสสิก' },
  { id: 'coin', name: 'เหรียญ 8-Bit', icon: '👾', desc: 'เสียงเก็บเหรียญเกมเรโทร' },
  { id: 'marimba', name: 'มาริมบาละมุน', icon: '🎶', desc: 'เสียงเครื่องเคาะไม้ สบายหู' },
  { id: 'none', name: 'ไม่มีเสียงกริ่ง', icon: '🎙️', desc: 'เสียงพูดน่ารักอย่างเดียว' },
];

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  options,
  onChangeOptions,
  onGenerateAI,
  isGenerating,
  onPlay,
  onStop,
  isPlaying,
  onDownloadWav,
  hasAudio,
  currentSource,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'chime' | 'effects'>('text');

  return (
    <div className="bg-white rounded-3xl border border-pink-100 shadow-xl shadow-pink-500/5 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Mitr']">
                  สตูดิโอออกแบบเสียงแจ้งเตือน
                </h2>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-pink-100 mt-0.5">
                ปรับแต่งข้อความพูด เสียงกริ่งนำหน้า ความเร็ว และระดับความน่ารักได้ตามใจชอบ
              </p>
            </div>
          </div>

          {/* Quick source badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                โหมด:{' '}
                {currentSource === 'ai'
                  ? 'Gemini AI Voice ✨'
                  : currentSource === 'mixed'
                  ? 'Custom Studio Mix 🎛️'
                  : 'พรีเซ็ตสำเร็จรูป 🎵'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/60 p-2 gap-2 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
            activeTab === 'text'
              ? 'bg-white text-pink-600 shadow-xs border border-pink-100 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic className="w-4 h-4 text-pink-500" />
          <span>ข้อความ &amp; ตัวละครเสียง</span>
        </button>
        <button
          onClick={() => setActiveTab('chime')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
            activeTab === 'chime'
              ? 'bg-white text-amber-600 shadow-xs border border-amber-100 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>เสียงกริ่งนำหน้า ({CHIME_OPTIONS.find((c) => c.id === options.chimeType)?.name})</span>
        </button>
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
            activeTab === 'effects'
              ? 'bg-white text-purple-600 shadow-xs border border-purple-100 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-500" />
          <span>ปรับระดับเสียง &amp; ความแบ๊ว</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 space-y-6">
        {activeTab === 'text' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  ข้อความที่ต้องการให้พูด (ไทย / อังกฤษ)
                </label>
                <span className="text-[11px] text-slate-400">
                  {options.text.length}/100 ตัวอักษร
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={100}
                  value={options.text}
                  onChange={(e) => onChangeOptions({ text: e.target.value })}
                  placeholder="เช่น ออเดอร์เข้าแย้ว, ออเดอร์เข้าแล้วค่า..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-hidden font-medium text-slate-900 text-sm transition-all"
                />
              </div>

              {/* Quick Chip Phrases */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 py-1 font-medium">
                  ประโยคฮิต:
                </span>
                {QUICK_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => onChangeOptions({ text: phrase })}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      options.text === phrase
                        ? 'bg-pink-100 border-pink-300 text-pink-700 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:border-pink-200 hover:bg-pink-50/50'
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Characters Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  เลือกโทนเสียงสาวน้อย AI (Voice Character)
                </label>
                <span className="text-[11px] text-pink-600 font-medium">
                  คลิกเพื่อเปลี่ยนโทนเสียง &amp; ปรับระดับความน่ารักให้อัตโนมัติ
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOICE_CHARACTERS.map((char) => {
                  const isSelected = options.voiceName === char.id;
                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        if (onSelectCharacter) {
                          onSelectCharacter(char);
                        } else {
                          onChangeOptions({
                            voiceName: char.id,
                            pitch: char.defaultPitch,
                            speed: char.defaultSpeed,
                            style: `${char.stylePrompt}${options.text}`,
                          });
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/70 shadow-md ring-2 ring-pink-400/40'
                          : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <span className="text-2xl p-1.5 bg-white rounded-xl shadow-2xs border border-pink-100 shrink-0">
                        {char.avatar}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 font-['Mitr'] flex items-center gap-1.5">
                            {char.title}
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                            )}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-pink-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {char.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {char.desc}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                            Pitch: {(char.defaultPitch * 100).toFixed(0)}%
                          </span>
                          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                            Speed: {char.defaultSpeed.toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chime' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                เลือกเสียงกริ่ง / เอฟเฟกต์เล่นก่อนเริ่มพูด
              </label>
              <span className="text-[11px] text-slate-400">
                มิกซ์เข้ากับเสียงพูดในไฟล์เดียวกันอัตโนมัติ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CHIME_OPTIONS.map((chime) => (
                <button
                  key={chime.id}
                  onClick={() => onChangeOptions({ chimeType: chime.id })}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    options.chimeType === chime.id
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-300/30'
                      : 'border-slate-200 hover:border-amber-200 hover:bg-slate-50/70'
                  }`}
                >
                  <span className="text-xl p-1.5 bg-white rounded-xl shadow-2xs border border-amber-100">
                    {chime.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 font-['Mitr']">
                      {chime.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {chime.desc}
                    </div>
                  </div>
                  {options.chimeType === chime.id && (
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Intro Delay Slider */}
            {options.chimeType !== 'none' && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-slate-700">
                    ช่วงเวลาทอดเสียงกริ่งก่อนเริ่มพูด (Intro Delay)
                  </span>
                  <span className="font-semibold text-amber-700">
                    {options.introDelay.toFixed(2)} วินาที
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={options.introDelay}
                  onChange={(e) =>
                    onChangeOptions({ introDelay: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Pitch / Cute Shift */}
            <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <span>ระดับความน่ารักแบ๊วๆ (Pitch Shifter)</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-sm">
                    {options.pitch > 1.15
                      ? 'น่ารักมาก สไตล์ชิบิ 👧🏻'
                      : options.pitch > 1.05
                      ? 'น่ารักสดใส 🌸'
                      : 'เสียงธรรมชาติ 🎙️'}
                  </span>
                </div>
                <span className="font-bold text-pink-600 font-mono">
                  {(options.pitch * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.35"
                step="0.02"
                value={options.pitch}
                onChange={(e) =>
                  onChangeOptions({ pitch: parseFloat(e.target.value) })
                }
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>ผู้ใหญ่เรียบร้อย (90%)</span>
                <span>มาตรฐาน (100%)</span>
                <span>สาวน้อยคาวาอี้ (115%)</span>
                <span>ชิบิตัวจิ๋ว (135%)</span>
              </div>
            </div>

            {/* Speed Slider */}
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800">
                  ความเร็วในการพูด (Speed)
                </span>
                <span className="font-bold text-purple-600 font-mono">
                  {options.speed.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.25"
                step="0.05"
                value={options.speed}
                onChange={(e) =>
                  onChangeOptions({ speed: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>ช้าชัดถ้อยชัดคำ (0.85x)</span>
                <span>ปกติ (1.0x)</span>
                <span>กระฉับกระเฉง (1.25x)</span>
              </div>
            </div>

            {/* Volume Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">ความดังเสียงกริ่ง</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {Math.round(options.chimeVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={options.chimeVolume}
                  onChange={(e) =>
                    onChangeOptions({ chimeVolume: parseFloat(e.target.value) })
                  }
                  className="w-full accent-slate-600 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">ความดังเสียงพูด</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {Math.round(options.voiceVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={options.voiceVolume}
                  onChange={(e) =>
                    onChangeOptions({ voiceVolume: parseFloat(e.target.value) })
                  }
                  className="w-full accent-pink-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Waveform Visualizer Area */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-slate-600 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-pink-500" />
              คลื่นเสียงแจ้งเตือน (Audio Waveform Preview)
            </span>
            <span className="text-[11px] text-slate-400">
              {isPlaying ? 'กำลังส่งเสียงเตือน...' : 'พร้อมเล่นเสียง'}
            </span>
          </div>

          <AudioWaveform isPlaying={isPlaying} />
        </div>

        {/* Master Control Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {/* AI Generate Button */}
          <button
            onClick={onGenerateAI}
            disabled={isGenerating}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isGenerating
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/20 hover:shadow-lg'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังสร้างเสียงพูด AI ด้วย Gemini...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>สร้างเสียงพูดใหม่ด้วย AI (Gemini TTS)</span>
              </>
            )}
          </button>

          {/* Play/Stop Button */}
          <button
            onClick={isPlaying ? onStop : onPlay}
            className={`py-3.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-slate-900 hover:bg-black text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>หยุดฟัง</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ลองฟังเสียง</span>
              </>
            )}
          </button>

          {/* Download WAV Button */}
          <button
            onClick={onDownloadWav}
            disabled={!hasAudio}
            className={`py-3.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
              hasAudio
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                : 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
            }`}
            title="ดาวน์โหลดไฟล์ .WAV คมชัดสูง สำหรับตั้งเป็นเสียงแจ้งเตือนมือถือ"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด (.WAV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
